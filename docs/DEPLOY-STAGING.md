# Preview / staging en Hostinger (subdominio, noindex) — GitHub Actions

> Publica la web nueva en un **subdominio de staging** (p. ej. `preview.conromaasesores.com`) en
> **cada push** a `feat/crm-leads`, con **todo el sitio en `noindex`** (`PUBLIC_PREVIEW=true`): no lo
> rastrea Google ni compite con la web antigua. Sirve para enseñárselo al stakeholder **online** y
> para auditar "en vivo": cambias → push → se actualiza solo en 1-2 min.
>
> El YAML no se puede commitear por git (subir a `.github/workflows/` requiere un token con permiso
> `workflow`, que la sesión de Claude no tiene). **Créalo tú desde la web de GitHub:** repo →
> **Actions** → **New workflow** → **set up a workflow yourself** → pega el YAML → nómbralo
> `deploy-staging.yml` → Commit.

## Pasos de una sola vez

1. **Subdominio** en Hostinger: hPanel → **Dominios → Subdominios** → crea `preview` →
   `preview.conromaasesores.com`. Apunta la ruta de su carpeta (algo como
   `/domains/conromaasesores.com/public_html/preview` o `/public_html/preview`).
2. **Variable** en GitHub (repo → Settings → Secrets and variables → **Actions → Variables**):
   - `STAGING_ENABLED = true`  (mientras no sea `true`, el workflow no hace nada).
3. **Secrets** (misma pestaña → **Secrets**). Reutiliza los del deploy de producción y añade el de
   staging:
   - `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`  (Hostinger → hPanel → **Cuentas FTP**).
   - `FTP_SERVER_DIR_STAGING` = **la carpeta del subdominio terminada en `/`** (p. ej.
     `/domains/conromaasesores.com/public_html/preview/`). ⚠️ Que apunte a la carpeta PROPIA del
     subdominio, no a `public_html/` raíz (el deploy sincroniza y borra lo que no toca).
   - Opcionales: `HABITATSOFT_FEED_URL` (si ya lo tienes, staging mostrará el inventario real),
     `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.

> Las credenciales FTP van **solo en GitHub Secrets**: ni Claude ni el chat las ven en claro.

## YAML (`.github/workflows/deploy-staging.yml`)

```yaml
name: Preview staging (Hostinger, noindex)

on:
  push:
    branches: [feat/crm-leads]   # cada push publica el preview
  workflow_dispatch: {}           # botón para lanzarlo a mano

concurrency:
  group: deploy-staging
  cancel-in-progress: true

jobs:
  build-deploy-staging:
    if: ${{ vars.STAGING_ENABLED == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Build preview (noindex + inventario del feed)
        run: npm run build          # el hook prebuild trae el feed de Habitatsoft
        env:
          PUBLIC_PREVIEW: 'true'    # <-- todo el sitio noindex
          HABITATSOFT_FEED_URL: ${{ secrets.HABITATSOFT_FEED_URL }}
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      - name: Desplegar dist/client al subdominio por FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/client/
          server-dir: ${{ secrets.FTP_SERVER_DIR_STAGING }}
```

## Cómo funciona la "auditoría en vivo"
- Cada **push** a `feat/crm-leads` dispara el build (noindex) y lo sube al subdominio.
- `SamKirkland/FTP-Deploy-Action` sube **solo los archivos que cambian** (incremental, guarda un
  estado en el servidor), así que a partir del primer deploy las actualizaciones son rápidas.
- Flujo: cambio → `git push` → en ~1-2 min `https://preview.conromaasesores.com` muestra lo último.
- SSL del subdominio: Hostinger lo provisiona solo (Let's Encrypt) la primera vez.

## Relación con producción
Este workflow es **independiente** del de producción (`docs/DEPLOY-ACTIONS.md`): staging usa
`PUBLIC_PREVIEW=true` + `FTP_SERVER_DIR_STAGING` + `STAGING_ENABLED`, y producción usa su propia
carpeta + `DEPLOY_ENABLED` + cron. Pueden convivir como dos archivos `.yml` distintos.

## Primera vez sin esperar al workflow
Si quieres enseñarlo **ya**, sin montar el Actions: sube el zip `~/Desktop/conroma-preview.zip`
(build con `PUBLIC_PREVIEW=true`, ya hecho) a la carpeta del subdominio por el Administrador de
archivos de Hostinger y extráelo ahí. Luego el workflow se encarga de las actualizaciones.
