# Despliegue automático a Hostinger (GitHub Actions)

> Este YAML no se pudo commitear directamente (subir archivos de `.github/workflows/` requiere un
> token con permiso `workflow`, que la sesión de Claude no tiene). **Créalo tú desde la web de
> GitHub**, que sí lo permite:
>
> GitHub → pestaña **Actions** → **New workflow** → **set up a workflow yourself** → pega el YAML de
> abajo → nómbralo `sync-deploy.yml` → Commit. (O crea el archivo `.github/workflows/sync-deploy.yml`
> con el editor de archivos de GitHub.)

## Qué hace
Reconstruye la web con el **inventario fresco del feed de Habitatsoft** (si hay `HABITATSOFT_FEED_URL`;
si no, usa el volcado) y la **despliega a Hostinger por FTP**. Se dispara por **cron** (cada noche),
**a mano** (botón en Actions) y por **webhook externo** (`repository_dispatch`, p. ej. desde Supabase
cuando cambie un piso).

## Activarlo (cuando la web esté lista para publicar)
En GitHub → Settings → Secrets and variables → Actions:
- **Variable** `DEPLOY_ENABLED = true` (mientras no sea `true`, NO despliega nada).
- **Secrets:** `HABITATSOFT_FEED_URL` (opcional), `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`,
  `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` (carpeta destino terminada en `/`,
  p. ej. `/public_html/`).

**No pongas `DEPLOY_ENABLED=true` hasta tener resueltos los bloqueantes de go-live** (datos legales
AICAT/NIF, fotos pendientes, `sampleData=false`): este workflow publica la web de producción.

## YAML

```yaml
name: Sync Habitatsoft y desplegar (Hostinger)

on:
  schedule:
    - cron: '0 3 * * *' # ~03:00 UTC cada día (04:00/05:00 Madrid)
  workflow_dispatch: {}
  repository_dispatch:
    types: [deploy]

concurrency:
  group: deploy-hostinger
  cancel-in-progress: true

jobs:
  build-deploy:
    if: ${{ vars.DEPLOY_ENABLED == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - name: Build (inventario fresco del feed de Habitatsoft)
        run: npm run build
        env:
          HABITATSOFT_FEED_URL: ${{ secrets.HABITATSOFT_FEED_URL }}
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      - name: Desplegar dist/client a Hostinger por FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/client/
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
```

## Disparar el deploy desde fuera (webhook)
Para refrescar la web cuando cambie un piso (sin esperar al cron), llama a la API de GitHub:
```
POST https://api.github.com/repos/sebastiandimasy/conroma-web/dispatches
Authorization: Bearer <token con scope repo>
Body: {"event_type":"deploy"}
```
Esto es lo que usaría un **webhook de Supabase** si el inventario pasa a gestionarse en nuestro CRM
(ver la alternativa "sin feed de Habitatsoft" más abajo / en `docs/INTEGRACIONES.md`).
