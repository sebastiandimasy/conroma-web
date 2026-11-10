# CONTEXT.md — Conroma Asesores (web + CRM)

> Volcado de contexto para una sesión de Claude que continúa el trabajo. No asume
> conocimiento previo. Última actualización: 2026-11-03.

## 1. Objetivo y estado

**Proyecto.** Conroma Asesores, inmobiliaria familiar en Malgrat de Mar (Alt Maresme,
Costa Brava). Dos entregables: (a) **rediseño de la web** conromaasesores.com y (b) un
**CRM/panel interno** para que los comerciales suban pisos y gestionen leads, citas y
reseñas. Todo en **español**. El **móvil es ~97% del tráfico** (verificar siempre a 390px,
claro y oscuro).

**Repo.** `/Users/sebastian/conroma-web`. Rama de trabajo actual:
`feat/design-system-fase0-4` (no se trabaja sobre main). Commits firmados
`Co-Authored-By: Claude Opus 4.8`.

**Estado web (casi lista, sin publicar):**
- HECHO: todas las páginas estructuradas, 126 pisos reales cargados, 301 de migración,
  medición (GTM + Consent Mode), reseñas Trustindex, reglas de UI móvil, paleta Tailwind,
  limpieza de bundle, cabeceras de seguridad, preview noindex desplegado.
- A MEDIAS: PageSpeed objetivo 100/100 (pendiente medir y optimizar; GTM/GA e imágenes
  remotas son los frenos). og:image usa una foto de equipo como placeholder (falta OG 1200x630).
- FALTA (bloquea go-live): datos legales reales, fotos de 8 pisos, flip `sampleData`.

**Estado CRM (en diseño/scaffold):**
- HECHO: wireframe low-fi navegable (ver §4); esquema SQL de Supabase escrito y **aplicado
  por el usuario** en el SQL Editor (confirmó "success"); panel admin base `AdminApp.tsx`
  (login Supabase + alta/edición de pisos directo contra la tabla `property`).
- FALTA: construir el front completo del CRM (módulos leads/contactos/agenda/difusión),
  subida de fotos a Storage, mapa con círculo 30–70 m, crear el primer usuario admin,
  y conectar `getListings()` para que lea de Supabase (hoy lee de un JSON).

## 2. Stack y servicios

**Frontend.** Astro **7.4.0** (sitio estático + islas React) + Tailwind **4** +
`motion` (animación; `gsap` en 6 sitios) + `maplibre-gl` (mapas) + `@heroui/react` (UI).
Adaptador **Cloudflare** (`@astrojs/cloudflare`, salida estática + rutas prerender=false).
`astro.config.mjs`: redirects, sitemap con `hiddenPaths`, prefetch (hover),
`inlineStylesheets: 'auto'`.

**Despliegue.** Cloudflare Workers con `wrangler`.
- Producción: worker `conroma-web` (`npm run deploy`). **No desplegar sin visto bueno.**
- Preview para stakeholder: worker `conroma-web-preview`, build con `PUBLIC_PREVIEW=true`
  → noindex en todo el sitio (`npm run deploy:preview`).
  URL: https://conroma-web-preview.conroma-web.workers.dev
- `public/_redirects` (301 de migración) y `public/_headers` (seguridad) → formato
  Cloudflare, servidos desde `dist/client/`.

**Backend / datos.** No hay backend propio; el "backend" del CRM es **Supabase**. La web
pública hoy lee el inventario de archivos JSON, no de Supabase (costura en
`src/data/properties.ts` → `getListings()`).

**Supabase (detalle).**
- project_ref `mcorvtqoenrndlpslmuy`, URL `https://mcorvtqoenrndlpslmuy.supabase.co`.
- Cliente: `@supabase/supabase-js` **2.118.0**. Wrapper en `src/lib/supabase.ts`:
  `createBrowserClient()` (anon/publishable) y `createServiceClient()` (service_role, solo
  servidor).
- **Auth**: email+password (Supabase Auth). El rol del comercial va en **`app_metadata`**
  (`role` ∈ `admin`|`comercial`), NUNCA en `user_metadata` (editable por el usuario).
- **RLS**: activada en todas las tablas. Función `public.is_staff()` lee el rol del JWT.
  Staff = full CRUD; `anon` = solo SELECT de `property` con `status='publicado'` y sus fotos.
- **Storage**: bucket público `property-photos`; escritura solo staff (policies en §8).
- **Edge functions**: NINGUNA todavía (no existen).
- **MCP de Supabase**: conectado en modo **read-only** (features docs, account, database,
  debugging, development, functions, branching). No puede escribir esquema → el usuario
  aplica el SQL desde el SQL Editor; Claude verifica vía REST/anon.
- PENDIENTE en Supabase: crear el primer usuario (Authentication → Add user con
  `app_metadata {"role":"admin"}`); confirmar que existen las policies de `storage.objects`.

## 3. Planteamiento del CRM

**Entidades (tablas en §8):**
- `property` (piso/ficha): ref, operación (venta/alquiler), tipo, pueblo, zona, precio,
  habitaciones/baños/m²/planta, extras, textos web, geo + `radius_m` (30–70, círculo de
  privacidad), `status` de publicación.
- `agent` (comercial; espejo de `auth.users`, rol admin/comercial).
- `lead` (oportunidad): nombre, teléfono (E.164 para wa.me), intención, zona, presupuesto,
  piso de interés, canal, estado, asesor asignado, consentimiento RGPD.
- `lead_event` (historial de interacciones: llamada/whatsapp/email/nota/cambio_estado).
- `client` (persona/propietario-demandante; se asciende desde lead).
- `appointment` (visita/cita): piso + lead + cliente + asesor, estado
  pendiente/realizada/no_show/cancelada.
- `review_request` (petición de reseña Google tras la cita; canal whatsapp/email).
- `property_photo` (fotos en Storage, orden, alt).

**Estados del pipeline de lead** (`lead.status`): `nuevo → contactado → cita → ganado /
perdido`, más `sin_respuesta`. En el wireframe se muestran como columnas
Nuevo→Contactado→Visita→Negociación→Ganado/Perdido (ver nota de alineación abajo).

**Estados del piso** — se separan DOS campos (patrón de CRMs líderes):
- Operación: Disponible · Reservado · Vendido · Alquilado · Retirado.
- Visibilidad web: Publicado / Oculto.
- Dar de baja un vendido = cambiar estado a Vendido (sale de la web, queda en histórico).
  Nunca se borra. (En el SQL actual esto está simplificado a
  `status ∈ borrador|publicado|retirado`; ver alineación abajo.)

**Clasificación de leads** (modelo objetivo pedido por el usuario):
- Por **CANAL/origen**: WhatsApp · Web (formulario) · Instagram · (portales Idealista/
  Fotocasa) · Llamada · Recomendación · Manual.
- Por **INTENCIÓN**: Vender · Reformar · Alquilar · Comprar · (Valoración / Gestión de
  patrimonio).
- Por **nivel de interés**: Caliente / Templado / Frío (lo marca el asesor; sube/baja por
  actividad).
- La clasificación es **automática al entrar** (origen e intención se derivan del canal y
  del formulario) y cae en `nuevo` sin asignar.

> ALINEACIÓN PENDIENTE (drift conocido): el SQL `lead.source` hoy es
> `('web','whatsapp','formulario','llamada','valoracion','manual')` (falta `instagram`,
> `recomendacion`) y `lead.intent` es `('comprar','vender','alquilar','valoracion','otro')`
> (falta `reformar`). Hay que ampliar estos CHECK para encajar el modelo canal/intención
> de arriba. El wireframe usó `patrimonio`; converger en el conjunto de arriba.

## 4. Wireframe low-fi (pantallas y flujos)

Artifact navegable (fondo blanco, escala de grises, color solo en chips de estado), layout
tipo admin (sidebar por categorías + topbar + área de trabajo). 7 pantallas por hash:

- **Panel** (`#panel`): KPIs de cabecera; luego **Leads** y **Pisos** en bloques separados
  (cada uno con su desglose por estado); **Tareas de hoy** como bloque con estados
  (Urgente/Pendiente/Hecho); abajo gráfica de barras (leads vs cierres) + origen de leads.
- **Leads** (`#leads`): tablero kanban por estado; cada tarjeta con etiquetas de tipo e
  interés; barra de filtros por tipo/interés; alternativa vista tabla. Nota de
  clasificación automática.
- **Contactos** (`#contactos`): tabla propietarios/demandantes + ficha de persona con
  historial (timeline). Explica lead ≠ contacto.
- **Agenda** (`#agenda`): citas del día/semana; acción "Pedir reseña" al cerrar visita.
- **Pisos** (`#pisos`): inventario en tabla con estado + visibilidad web + menú `···`
  (cambiar estado / publicar-ocultar); debajo la **ficha** por secciones (datos,
  características, textos web, fotos con portada, ubicación con círculo 30–70 m, operación +
  publicación + asesor). Flujo crear→borrador→publicar.
- **Difusión** (`#difusion`): publicar/despublicar en portales (web propia/Idealista/
  Fotocasa) + métricas de reseñas Google.
- **Asesores** (`#asesores`): rendimiento por comercial + tabla de usuarios/roles/alcance.

Es solo estructura; el estilo final se define después. (El usuario validó la estructura;
pidió afinar el Panel, ya reorganizado.)

## 5. Migración web conromaasesores.com

- **Interruptor**: `src/data/site.ts` → `sampleData` (hoy `true`). A `false`: quita el aviso
  "Web en construcción", hace indexables `/es/inmueble/` y `/es/venta/` y los mete al
  sitemap. Seguro: `properties.sample.json` no se importa en ningún sitio; las fichas leen
  `properties.real.json`.
- **URLs/redirecciones**: `public/_redirects` con **72 reglas 301** del sitio antiguo
  (estáticas 1:1, `/detalle/*`, `/buscador/*`, restos técnicos). Todos los destinos existen
  y compilan. No hay enlaces internos a rutas viejas. NO se pudo rastrear el dominio en vivo
  (ya sirve el build nuevo o 404, y no hay Screaming Frog montado): para garantizar 100% hay
  que rastrear una copia/staging o el sitemap antiguo (Wayback) y diff contra `_redirects`.
- **Checklist SEO**: canonical + hreflang por página; sitemap excluye `/admin/`, `/estilo/`,
  `/guardados/`, `/privacidad/`; robots.txt permite todo + apunta al sitemap. Pendiente:
  og:image dedicada; `/politica_cookies` debería redirigir a `/es/cookies/` (hoy va a
  privacidad); 17 municipios de Girona con intro vacía.
- **Medición instalada**: Google Tag Manager `GTM-KWJHKHR2` como **único contenedor** (se
  eliminó el gtag.js directo de GA4 para no duplicar); Consent Mode v2 (denegado hasta
  aceptar cookies); listener que empuja `contacto_click` al dataLayer en clics a `wa.me/` y
  `tel:` (con `origen`/`contacto`). GA4 id `G-C9WV5S78LX`. Reseñas: widget Trustindex
  (`loader.js?d045063849cb67522f863d5cb82`).
  PENDIENTE EN LA UI DE GTM (no es código): crear/confirmar etiqueta **GA4 Configuration**
  con `G-C9WV5S78LX` (si no, GA4 deja de medir) y un disparador sobre `contacto_click`
  mapeado a conversión de GA4/Google Ads.

**Bloqueantes de go-live (P0):**
1. Datos legales reales en `aviso-legal.astro`, `cookies.astro`, `privacidad.astro` (hoy
   placeholders `[NIF/CIF pendiente]`, `[nº AICAT pendiente]` y notas de "borrador"); las dos
   primeras son indexables.
2. Fotos de 8 pisos: `C-1281-A, T-2048, T-2093-A, T-2058, L-1087, L-1083-D, C-1236, T-2029-H`.
3. Flip `sampleData → false` cuando 1 y 2 estén resueltos.

## 6. Decisiones tomadas (y descartes)

- **Inventario propio en Supabase** como fuente de verdad (no integrar Habitatsoft como
  backend; las fotos sí vienen de su CDN `fotoshs.imghs.net`).
- **Supabase oficial** para el CRM (Postgres + Auth + Storage). (El descarte de Supabase de
  la memoria global es de OTRO proyecto, el piloto NFC, no de Conroma.)
- **Front propio del CRM** con usuarios/contraseñas por comercial; NO editar Supabase
  directamente. Apoyo en 21st.dev para la UI.
- **Medición por Click URL** (wa.me/tel:), nunca por el texto del botón; GTM como contenedor
  único.
- **Paleta Tailwind** (ámbar + stone + emerald/red) y **sin emojis** en UI/entregables.
- Descartado: hero "abanico" de fotos (no convencía); GA4 directo duplicado; dependencia
  `@shadergradient/react` (three.js, sin uso); islands huérfanos (HeroGradient,
  ReelTestimonials, SearchForm, HeroCta); fuente Pacifico se CONSERVA (firma del CEO).

## 7. Próximos pasos priorizados

1. **PageSpeed**: medir preview (PSI con API key o Lighthouse local), corregir; objetivo
   100/100. Palancas: diferir/offload de GTM (p. ej. Partytown), srcset/formatos modernos en
   imágenes remotas de Habitatsoft, revisar LCP/CLS de la home y de la ficha.
2. **Go-live web**: cerrar los 3 bloqueantes P0 (§5) y flip `sampleData`.
3. **CRM front**: construir módulos del wireframe sobre `AdminApp.tsx`; empezar por Leads
   (captura desde el formulario web → tabla `lead`) y subida de fotos a Storage.
4. **Supabase**: crear primer usuario admin; ampliar enums de `lead` (canal/intención, §3);
   confirmar policies de `storage.objects`.
5. **GTM**: etiqueta GA4 Configuration + conversión sobre `contacto_click`.
6. Conectar `getListings()` a Supabase cuando el panel ya mantenga el inventario.

## 8. Esquema SQL de Supabase

Archivo: `supabase/migrations/0001_crm_init.sql` (ya aplicado por el usuario). CREATE TABLE
principales (recortado a la estructura; ver el archivo para RLS y Storage completos):

```sql
-- Rol desde el JWT (app_metadata), no editable por el usuario.
create or replace function public.is_staff() returns boolean
language sql stable set search_path = '' as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','comercial'), false)
$$;

create table if not exists public.agent (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null, email text not null,
  role text not null default 'comercial' check (role in ('admin','comercial')),
  created_at timestamptz not null default now()
);

create table if not exists public.property (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  operation text not null check (operation in ('venta','alquiler')),
  type text not null, town text not null, zone text not null,
  price integer not null, previous_price integer,
  rooms integer not null default 0, baths integer not null default 0,
  area integer not null default 0, floor integer,
  elevator boolean, parking boolean, terrace boolean,
  state text, tag text, description text, likes text, watch_out text,
  geo_lat double precision, geo_lng double precision,
  radius_m integer check (radius_m between 30 and 70),
  status text not null default 'borrador' check (status in ('borrador','publicado','retirado')),
  created_by uuid references public.agent (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.property_photo (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.property (id) on delete cascade,
  storage_key text not null, sort_order integer not null default 0, alt text,
  created_at timestamptz not null default now()
);

create table if not exists public.lead (
  id uuid primary key default gen_random_uuid(),
  name text, phone text, email text,
  intent text check (intent in ('comprar','vender','alquilar','valoracion','otro')),
  zone text, budget integer, property_ref text,
  source text not null default 'web'
    check (source in ('web','whatsapp','formulario','llamada','valoracion','manual')),
  status text not null default 'nuevo'
    check (status in ('nuevo','contactado','cita','ganado','perdido','sin_respuesta')),
  assigned_to uuid references public.agent (id),
  consent_marketing boolean not null default false,
  consent_at timestamptz, consent_source text,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_event (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.lead (id) on delete cascade,
  type text not null check (type in ('llamada','whatsapp','email','nota','cambio_estado')),
  note text, agent_id uuid references public.agent (id),
  created_at timestamptz not null default now()
);

create table if not exists public.client (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.lead (id),
  name text not null, phone text, email text,
  consent_marketing boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.appointment (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.property (id),
  lead_id uuid references public.lead (id),
  client_id uuid references public.client (id),
  agent_id uuid references public.agent (id),
  starts_at timestamptz not null, ends_at timestamptz,
  status text not null default 'pendiente'
    check (status in ('pendiente','realizada','no_show','cancelada')),
  notes text, created_at timestamptz not null default now()
);

create table if not exists public.review_request (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointment (id) on delete cascade,
  channel text not null check (channel in ('whatsapp','email')),
  status text not null default 'enviada' check (status in ('enviada','fallida','clic')),
  sent_at timestamptz not null default now(), clicked_at timestamptz
);

-- RLS: enable en las 8 tablas. Staff (is_staff()) => SELECT/INSERT/UPDATE/DELETE.
-- anon (web pública) => SELECT solo property.status='publicado' y sus property_photo.
-- Storage: bucket público 'property-photos'; INSERT/UPDATE/DELETE solo staff.
```

## Variables de entorno / claves (POR NOMBRE — nunca pegar valores)

- `.env` y `.env.example` (frontend, públicas/seguras):
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY` (clave *publishable* `sb_publishable_…`, pública por diseño)
- Build: `PUBLIC_PREVIEW` (=`true` solo para el build de preview noindex).
- Solo servidor (NUNCA en git; como **secret de Cloudflare** `wrangler secret put`):
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (service_role / secret — jamás pegar en chat ni commitear)
- Medición (ids públicos, viven en el código): GA4 `G-C9WV5S78LX`, GTM `GTM-KWJHKHR2`,
  Trustindex `d045063849cb67522f863d5cb82`.
- Supabase MCP: se autentica por OAuth / token con scope; `.mcp.json` apunta a
  `https://mcp.supabase.com/mcp?project_ref=mcorvtqoenrndlpslmuy&read_only=true&features=…`.
  El token NO va en el repo.

**`.env` está en `.gitignore` y no se commitea nunca.**
