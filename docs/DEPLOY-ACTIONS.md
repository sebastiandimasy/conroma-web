# Despliegue automático a Hostinger (GitHub Actions)

> **Creado el 19-nov-2026** desde la web de GitHub en la rama por defecto del repo
> (`feat/design-system-fase0-4`): `.github/workflows/sync-deploy.yml`. Los cron y los
> `repository_dispatch` solo corren desde la rama por defecto; por eso vive ahí y hace checkout de
> la rama donde está la web (`DEPLOY_REF`, por defecto `feat/crm-leads`). Tras el swipe, cuando la
> web pase a `main` y `main` sea la rama por defecto, mover el archivo allí y quitar `DEPLOY_REF`.
>
> Desde la sesión de Claude no se puede hacer push de `.github/workflows/` (el token no tiene
> permiso `workflow`): cualquier cambio del YAML se hace en el editor web de GitHub.

## Qué hace
Reconstruye la web con el **inventario fresco del feed de Habitatsoft** (si hay `HABITATSOFT_FEED_URL`;
si no, usa el volcado) y la **despliega a Hostinger por FTP**. Se dispara por **cron** (cada noche),
**a mano** (botón en Actions) y por **webhook externo** (`repository_dispatch`, p. ej. desde Supabase
cuando cambie un piso).

## Cómo entra el inventario de Habitatsoft (importante)
El feed se trae en un **pre-build**: el hook `prebuild` de `package.json` ejecuta
`scripts/fetch-inventory.mjs`, que descarga el feed "Enlace Web 2.0" (XML), lo parsea y reescribe
`src/data/properties.real.json` **antes** de `astro build`. Por eso el workflow de arriba funciona tal
cual (su `npm run build` ya dispara el `prebuild`); **no hay que tocar el YAML**.

Se hace antes del build a propósito: el **adaptador Cloudflare prohíbe `fetch()` en el scope global**
de un módulo, así que leer el feed dentro del build (como hacía `loadInventory()`) fallaba siempre y
caía al volcado, en silencio. Sin `HABITATSOFT_FEED_URL`, el `prebuild` no hace nada y se usa el
volcado commiteado (desarrollo local normal).

**Verificado** (16-11-2026) de punta a punta con un feed de prueba: un piso del feed se generó como
ficha en `dist`. **Pendiente:** el parser aún NO extrae el **certificado energético** (`energyRating`),
que por ley debe salir en el anuncio y está en Habitatsoft — hay que mapear su campo cuando tengamos
el feed real (tocar `scripts/fetch-inventory.mjs` y `src/lib/habitatsoft.ts`). Para que la fuente sea
Habitatsoft y no Supabase, dejar la tabla `property` de Supabase **vacía** (no correr `seed:pisos`).

## Activarlo (cuando la web esté lista para publicar)
En GitHub → Settings → Secrets and variables → Actions:
- **Variable** `DEPLOY_ENABLED = true` (mientras no sea `true`, NO despliega nada).
- **Variable** `DEPLOY_REF` (opcional): rama a publicar; por defecto `feat/crm-leads`.
- **Variable** `SITE_URL` (opcional, p. ej. `https://conromaasesores.com`): si existe, tras subir pasa `scripts/smoke.mjs` y el job falla si algo no carga.
- **Secrets:** `HABITATSOFT_FEED_URL` (opcional), `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`,
  `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` (carpeta destino terminada en `/`,
  p. ej. `/public_html/`).

**No pongas `DEPLOY_ENABLED=true` hasta tener resueltos los bloqueantes de go-live** (datos legales
AICAT/NIF, fotos pendientes, `sampleData=false`): este workflow publica la web de producción.

## YAML

```yaml
name: Sync Habitatsoft y desplegar (Hostinger)

# Reconstruye la web con el inventario fresco y la sube a Hostinger por FTP.
# No hace nada hasta que la variable DEPLOY_ENABLED valga 'true' (Settings > Secrets and variables > Actions).
# Guía completa: docs/DEPLOY-ACTIONS.md

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
        with:
          # La web vive en esta rama hasta el swipe; cámbiala con la variable DEPLOY_REF.
          ref: ${{ vars.DEPLOY_REF || 'feat/crm-leads' }}
      - uses: actions/setup-node@v4
        with:
          node-version: '24' # el prebuild importa TypeScript (Node >= 22.18)
          cache: 'npm'
      - run: npm ci
      - name: Build (inventario fresco del feed de Habitatsoft)
        run: npm run build
        env:
          HABITATSOFT_FEED_URL: ${{ secrets.HABITATSOFT_FEED_URL }}
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      - name: Tests
        run: npx vitest run
      - name: Desplegar dist/client a Hostinger por FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/client/
          server-dir: ${{ secrets.FTP_SERVER_DIR }}
      - name: Prueba de humo de la web publicada
        if: ${{ vars.SITE_URL != '' }}
        run: node scripts/smoke.mjs "${{ vars.SITE_URL }}"
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
