# Conroma · Arquitectura, lógica de datos, seguridad y migración

> Documento canónico. Define cómo se separan **website** y **CRM**, cómo conectan con
> **Supabase**, la seguridad, y el plan para migrar la gestión de pisos de **Habitatsoft**.
> Estado: 10-nov-2026. Mantener al día (es la fuente para no confundirse entre repos).

---

## 1. Las tres piezas

```
                         SUPABASE  (única fuente de verdad)
     property · property_photo · lead · lead_event · client · appointment
     · review_request · agent          + Auth + Storage + RLS
        ▲ CRUD staff (login + RLS)                 ▲ inserta lead · lee pisos publicados
        │                                          │
 ┌──────┴──────────────────┐              ┌────────┴───────────────────────┐
 │  CRM  (conroma-crm-ui)  │              │  WEB  (conroma-web, ESTE repo) │
 │  Vite + React 18        │              │  Astro, ESTÁTICA en Hostinger  │
 │  gestión interna        │              │  fichas, buscador, formularios │
 └─────────────────────────┘              └────────────────────────────────┘
```

- **Dos repos separados, un solo Supabase.** No se mezclan: stacks distintos.
  - `conroma-web` (este): la web pública. Astro, se publica **estática en Hostinger**.
  - `conroma-crm-ui`: el CRM interno. Vite SPA. `github.com/sebastiandimasy/conroma-crm-ui`.
- **Supabase es el backend de ambos.** No hace falta otra base de datos ni otro backend.
- La web NO contiene UI de CRM. (El antiguo `AdminApp.tsx` / `/es/admin` era un primer intento
  de meter el CRM en Astro; se **abandonó** al pasar el CRM a su repo Vite y se ha **borrado**.)

## 2. Responsabilidades (qué va en cada repo)

| | `conroma-web` (web) | `conroma-crm-ui` (CRM) |
|---|---|---|
| Público | Sí, indexable | No, interno (login) |
| Hosting | Hostinger (estático) | estático (subdominio / Pages) |
| Escribe en Supabase | solo INSERT en `lead` (anon) | CRUD completo (staff, RLS) |
| Lee de Supabase | `property` publicados + fotos | todo lo suyo |
| Auth | no (anónimo) | Supabase Auth (email+password) |
| Esquema de la DB | **vive aquí** (`supabase/migrations/`) | lo referencia |

- El **esquema de Supabase** (migraciones) es canónico en `conroma-web/supabase/migrations/`.
  El CRM solo lo referencia. Si cambia el esquema, se añade una migración aquí y se aplica en
  el SQL Editor de Supabase; luego se avisa al CRM.
- Las **altas de usuarios** del panel (Supabase Auth) se hacen con `scripts/crear-usuario.mjs`
  (necesita `.dev.vars` local con `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`). Ver `docs/USUARIOS.md`.

## 3. Lógica de datos: web ↔ Supabase

### 3.1 Captación de leads (decisión: opción A — insert directo)
La web es estática, así que **no hay Worker**. El formulario escribe **directo** en `lead` con la
anon key y una policy RLS que **solo** permite INSERT (migración `0003_web_lead_insert.sql`).

- Cliente: `supabase.from('lead').insert(row, { returning: 'minimal' })` con la anon key.
  `returning: 'minimal'` es obligatorio (anon no tiene SELECT sobre `lead`).
- Lo usan `ContactForm.tsx` y `ValuationWizard.tsx` (esta con `source:'valoracion'`).
- Anti-spam Fase 1: **honeypot** (campo `company` oculto, ya existe) + la policy acotada.
- **Pendiente de implementar** (el rework en sí): adaptar los dos formularios al insert directo,
  añadir el cliente anon de Supabase a la web y **borrar `src/pages/api/leads.ts`** (el Worker
  con service_role, que en Hostinger no corre). Está acotado en `docs/HOSTINGER.md` (opción A).

### 3.2 La web lee los pisos
Hoy `src/data/properties.ts` lee `properties.real.json` (volcado del Excel, 126 pisos). La costura
está prevista: `getListings()`/`getListing()` son el único punto de lectura. **Pendiente (clave):**
cambiar la fuente a Supabase (`property` con `status='publicado'`). Ver §4.

## 4. Gestión de pisos y migración de Habitatsoft (Fase 1 del CRM)

**Situación.** Hoy los pisos se gestionan en **Habitatsoft** (el CRM antiguo), que además
**publica en los portales** (Idealista/Fotocasa) y aloja las fotos (CDN `fotoshs.imghs.net`).
Ese es su valor real y el que más cuesta replicar.

**Estrategia recomendada: por fases, sin cortar el negocio.**

### Fase 1 — Habitatsoft sigue siendo el sistema de alta; sincronizamos a Supabase
- Los asesores **siguen dando de alta pisos en Habitatsoft** (y publicando en portales). No se
  cambia su rutina.
- **Sincronización automática**: feed XML de Habitatsoft "Enlace Web 2.0 (v1.7)" →
  `src/lib/habitatsoft.ts` (**parser ya escrito**) → **upsert** en Supabase `property` + fotos.
  Lo ejecuta un job programado (Supabase **Edge Function con cron**, o un script).
- **Upsert por `ref`, preservando la capa editorial nuestra**: el feed NO trae `likes`,
  `watchOut` ni "destacado/oculto". El sync actualiza los campos del feed y **no pisa** los
  campos propios que el equipo edite en nuestro CRM. (Clave para que las dos cosas convivan.)
- **La web lee de Supabase** (`getListings()` → `property` publicados). Se desacopla del JSON.
- **Nuestro CRM en Fase 1** aporta lo que Habitatsoft hace mal o no hace: **leads, agenda,
  reseñas**, y una **capa editorial** sobre el piso sincronizado (notas, destacar, ocultar de la
  web). Los pisos se ven en el CRM; el alta sigue en Habitatsoft.

### Fase 2 — Cortar con Habitatsoft (cuando el negocio pueda)
- El CRM gana **alta/edición nativa de pisos** + **subida de fotos a Storage** (`property-photos`).
- Se decide el **publicado en portales**: o se integra la publicación (feeds a Idealista/Fotocasa,
  que son de pago/complejos) o la agencia asume gestionarlos aparte.
- Cuando eso esté, Supabase pasa a ser el sistema de alta y **se retira Habitatsoft**.

> Decisión abierta para el dueño: confirmar el enfoque por fases (lo recomendado) frente a un
> corte inmediato. El corte inmediato obliga a resolver YA la publicación en portales.

## 5. Seguridad (revisión)

| Área | Estado | Nota |
|---|---|---|
| Rol en `app_metadata` (no `user_metadata`) | OK | El usuario no puede auto-ascenderse. `is_staff()` lee el JWT. |
| `service_role` solo en servidor | OK | Nunca en el navegador ni en git. Con opción A la web deja de usarla (solo el script local de altas). |
| anon: lectura | OK | Solo `property`/`property_photo` publicados. Leads/citas/clientes sin acceso anon. |
| anon: escritura de leads | **Nuevo (0003)** | INSERT-only y acotado (no asigna asesor, no fija estado/interés, campos con tope). Sin SELECT. |
| Límite de peticiones / CAPTCHA | **Limitación conocida** | En hosting estático no hay servidor para validar Turnstile ni limitar por IP. Fase 1 = honeypot + policy acotada. Si hay spam → opción B (Edge Function con Turnstile) o trigger de tope global. |
| Scope por comercial (ve solo lo suyo) | **Hueco (hardening Fase 2)** | Hoy la RLS deja a **cualquier staff** leer/escribir todo; el "comercial solo lo suyo" está en la UI del CRM, NO en la DB. Endurecer: policies que acoten `comercial` a `assigned_to = su id` y dejen a `admin` ver todo. |
| Sesiones (Supabase Auth) | **Config en el panel** | Recomendado: caducidad de JWT corta + rotación de refresh token. Trampa: **borrar un usuario NO invalida sus tokens activos** → al dar de baja a alguien, cerrar sus sesiones (revoke) además de borrarlo. |
| Cabeceras HTTP | OK + pendiente | `.htaccess`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`, `X-Frame-Options`. **CSP pendiente** (probar en Report-Only; hosts: googletagmanager, google-analytics, fonts.gstatic, fotoshs.imghs.net, *.supabase.co). |
| Medición / consentimiento | OK | Consent Mode v2 denegado por defecto; el banner (HTML servido) actualiza el consentimiento. |

## 6. Variables de entorno (por NOMBRE, nunca valores)

- **Web** (`.env`, públicas/seguras): `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`.
  Flag de build: `PUBLIC_PREVIEW`.
- **CRM** (`.env`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. Sin credenciales → modo demo.
- **Solo servidor / ops** (nunca en git): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  (script de altas; antes también el Worker de leads, que desaparece con la opción A).
- **Medición** (públicas, en el código): GA4 `G-C9WV5S78LX`, GTM `GTM-KWJHKHR2`,
  Trustindex `d045063849cb67522f863d5cb82` (retirado de Inicio el 2026-11-18: las reseñas
  van ahora en texto propio con la isla `TestimonialCarousel`).
- **Futuras** (ver tabla de §3 de la versión anterior): WhatsApp/IG webhooks, Turnstile, IA de
  descripciones — cuando se aborden esas conexiones.

## 7. Hoja de ruta por fases

1. **Estructura y datos (esta sesión)**: repos separados y limpios, este documento, migración
   0003 (insert anon seguro), cabeceras. *(hecho)*
2. **Captación real en Hostinger (opción A)**: adaptar `ContactForm`/`ValuationWizard` al insert
   directo, aplicar 0003 en Supabase, borrar `api/leads.ts`.
3. **Pisos a Supabase**: sync Habitatsoft (feed → `habitatsoft.ts` → upsert) + `getListings()`
   lee de `property`. Fotos a Storage.
4. **Conectar el resto del CRM** (`conroma-crm-ui`): Pisos, Ficha, Agenda, Valoraciones,
   Contactos, Difusión, Asesores (patrón de `Leads.jsx` + `useData.js`).
5. **Go-live web**: datos legales, fotos de 8 pisos, `sampleData=false`, publicar en Hostinger.
6. **Hardening**: RLS por comercial, CSP, CAPTCHA si hace falta.
7. **Fase 2 pisos**: alta nativa + portales → retirar Habitatsoft.
