# Conroma Asesores — web nueva + CRM

Inmobiliaria familiar en **Malgrat de Mar** (Alt Maresme, Barcelona). Este repo es la **web nueva**
que sustituye a la antigua de `conromaasesores.com`. Responde siempre **en español**.

> Si abres este repo por primera vez en una sesión nueva: lee también `ESTADO.md`, que dice
> exactamente en qué punto está el trabajo, qué está hecho y qué falta.

## Marca (no improvisar colores)
- **Negro `#1A1912`** = color principal. Botones de acción: fondo negro, texto blanco.
- **Amarillo `#F3BC16`** = acento secundario, nunca para texto largo ni para brillos.
- **Gris** para fondos, **blanco** para tarjetas. Verde adoptado solo para estados positivos.
- Prohibido el azul como color de marca (solo se tolera en gráficas).
- Reglas completas en `ESTANDAR.md`.

## Arquitectura
- **Astro** estático, **se publica en Hostinger** (no Cloudflare). El build aún usa el adaptador
  Cloudflare (`wrangler.jsonc`), pero la web es estática; ver `docs/HOSTINGER.md`.
- **Este repo es SOLO la web pública.** El CRM es otro repo (`conroma-crm-ui`, Vite). No se
  mezclan. La arquitectura completa (web ↔ CRM ↔ Supabase), la **seguridad** y la **migración de
  Habitatsoft** están en **`docs/INTEGRACIONES.md`** (léelo antes de tocar datos).
- **Supabase**: Postgres + Auth + Storage + RLS. Esquema canónico en `supabase/migrations/`.
- Roles en `app_metadata.role`: `admin` | `comercial`. **Nunca** en `user_metadata` (el usuario
  podría editarlo).
- **Captación de leads (opción A)**: la web estática inserta directo en `lead` con la anon key +
  policy RLS solo-INSERT (`migrations/0003`). El Worker `api/leads.ts` (service_role) se retira.
- `src/lib/supabase.ts`: cliente anon para la web. La `service_role` solo la usa el script local
  de altas de usuarios, jamás el navegador ni un commit.

## Convenciones de trabajo
- **El móvil es ~97% del tráfico.** Verifica siempre a 390 px antes de dar algo por bueno.
  Si `resize_window` no cambia el viewport, usa un iframe de 390 px.
- **Datos reales, no inventados.** Volúmenes de búsqueda: NotFair `getKeywordIdeas` (Planificador
  de Google Ads). Auditoría técnica: Screaming Frog MCP. **DataForSEO normalmente NO está
  conectado**: si hace falta SERP o backlinks reales, decirlo en vez de estimar.
- **Secretos:** `.env*` y `.dev.vars*` están en `.gitignore` y no se commitean nunca.
  La `SUPABASE_SERVICE_ROLE_KEY` no se pega en el chat ni se sube a GitHub bajo ningún concepto.
- Medición de conversiones **por Click URL** (`wa.me` / `tel:`), nunca por el texto del botón.
- **Tres idiomas (es, en, ca).** Todo texto visible va en `strings({ es, en, ca })` de
  `src/i18n/` y todo cambio de texto se hace en los tres (traducción natural, mismo tono). Los
  enlaces internos pasan por `localizePath(ruta, lang)`; el idioma sale de `getLang(Astro.url)`
  y las islas reciben `lang` como prop.

## Comandos
```bash
npm run dev        # desarrollo
npm run build      # incluye astro check; tiene que pasar antes de cada commit
npx vitest run     # tests
npm run preview    # previsualiza con wrangler (entorno real del Worker)
```

## Dar de alta usuarios del panel
```bash
node scripts/crear-usuario.mjs rosa@conromaasesores.com admin "Rosa Camps"
```
Necesita un `.dev.vars` local con `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
Detalles y alternativa por panel web en `docs/USUARIOS.md`.

## CRM
El CRM de gestión (pisos + leads + agenda) se está prototipando en **otro repo**:
`conroma-crm-ui` (Vite + React 18 + Tailwind v4). Sigue la estructura y la paleta de la
plantilla **Spike Admin**, con los colores de Conroma sustituidos. Ver `docs/INTEGRACIONES.md`
para cómo se conecta la web con el CRM.
