# Plan — Panel de administración + CRM (Conroma Asesores)

> Fecha: 2026-10-29 · Rev. 2026-11-01 · Estado: propuesta para decidir, aún sin código.
> Decisiones del usuario (2026-11-01):
> - **Alta de pisos PROPIA** (NO se usa Habitatsoft como fuente): el panel construye el alta
>   completa de viviendas y las fichas viven en **nuestra** base de datos.
> - Se añade **módulo de Leads** (captura desde la web + pipeline + clasificación) como parte
>   de primera clase, no como extra de v2.
> - **Base de datos oficial: SUPABASE** (el usuario ya tiene hosting + Supabase listos). Sustituye
>   a Cloudflare D1/R2/Access del borrador anterior: Supabase aporta **Postgres** (datos),
>   **Auth** (login de comerciales), **Storage** (fotos de pisos) y **RLS** (seguridad por fila).
> - **Formulario de contacto**: al enviar **va al CRM y avisa al comercial** (deja de abrir
>   WhatsApp). Los botones de WhatsApp sueltos pueden seguir abriendo WhatsApp y capturando lead.
> - **Disparo de reseña**: **wa.me semiautomático** en v1 (un clic del comercial).
>
> Alcance: dashboard para que los comerciales (1) **den de alta y gestionen las viviendas**
> con ficha completa + fotos + ubicación por círculo 30–70 m; (2) **capturen y gestionen
> leads** (contacto, estado, recolección, clasificación); (3) gestionen **citas** con disparo
> de **reseña de Google** post-visita (WhatsApp + email).
> Respeta [[orden-de-trabajo]]: la web pública (contenido + migración) va **antes**; esto
> arranca después. Memoria: [[admin-crm-dashboard]].

---

## 0. TL;DR

- **Construimos el alta de pisos propia.** Al descartar Habitatsoft, Conroma pasa a tener su
  **propia fuente de verdad del inventario** en **Cloudflare D1**, con fotos en **R2**. El
  panel es, de hecho, un mini-PMS inmobiliario: formulario de ficha + galería + geo/radio.
  La costura `getListings()/getListing()` (`src/data/properties.ts`) ya está pensada para
  cambiar la fuente: pasa de leer el JSON de Excel a leer **D1** — sin tocar las páginas.
- **No montar backend aparte.** El sitio ya se despliega como **Cloudflare Worker**
  (`adapter: cloudflare()`, `wrangler.jsonc`). Se añaden **rutas API de Astro**
  (`prerender = false`) + **D1** (pisos, leads, citas, clientes) + **R2** (fotos) + **KV**
  (sesión/caché) sobre el mismo proyecto. Cero servicios nuevos.
- **Tres módulos:** (A) Inventario de pisos, (B) **Leads**, (C) Citas + reseñas. Fluyen en
  cadena: **lead → cita → reseña**.
- **Lo que de verdad hay que decidir antes (Fase 0, §10):** dónde viven/validan las fotos
  (R2 + límites), auth de comerciales, proveedor de email, WhatsApp (wa.me vs API Cloud), y
  si la web pública se publica por **rebuild** o pasa a **ficha dinámica**.

---

## 1. Objetivo y alcance

### Qué SÍ entra en v1 (MVP)
- **Auth de comerciales** (pocos usuarios; admin vs. comercial).
- **Alta/edición de piso completa** (módulo A): todos los campos de la ficha + **subida de
  fotos a R2** + ubicación (centro del mapa + **radio 30–70 m**). Publica a la web pública.
- **Leads** (módulo B): **captura automática desde la web** (formulario de contacto y CTAs de
  WhatsApp registran el lead), lista/bandeja, **pipeline de estados**, **clasificación**
  (intención, zona, presupuesto, origen, comercial), e **historial de contacto** por lead.
- **Citas** (módulo C): crear cita (piso + lead/cliente + fecha/hora + comercial), estados
  pendiente → realizada / no-show / cancelada, **calendario** + lista. Un lead se convierte en
  cita.
- **Disparo post-visita:** al marcar la cita "realizada" y con consentimiento → **WhatsApp +
  email** pidiendo valoración + reseña de Google. Registro para medir el bucle.

### Qué NO entra en v1 (ponytail)
- Portal del cliente, firma de documentos, facturación.
- Multi-idioma del panel (comerciales trabajan es/ca).
- App móvil nativa (panel web responsive; móvil ~97% → [[validar-en-movil]]).
- Automatización desatendida de WhatsApp (API Cloud) — se empieza con wa.me (§6).
- Importación masiva / sincronización con un PMS externo (no hay Habitatsoft).

---

## 2. Decisión clave (revisada): ALTA PROPIA del inventario

**El usuario descartó Habitatsoft → el panel construye y posee el inventario.** Implicaciones:

- El inventario deja de leerse de un feed; vive en **D1** (tabla `property`) + fotos en **R2**.
- La costura `getListings()/getListing()` cambia su `source`: hoy fusiona
  `properties.real.json` (volcado de Excel) + `property-photos.json`; pasa a **leer D1**
  (en build para la web estática, o en runtime si la ficha se hace dinámica). **Las páginas no
  cambian** gracias a la costura.
- El parser `src/lib/habitatsoft.ts` queda **sin uso** (se puede archivar); el volcado de
  Excel (`scripts/build_properties.py`) sirve como **migración inicial** de los 126 pisos
  actuales a D1 (one-shot), y luego el alta la hacen los comerciales en el panel.
- Coste mayor que integrar: hay que construir formulario de ficha, **subida/gestión de fotos**
  (lo más caro) y validación. A cambio: control total y una sola verdad propia.

> Migración de arranque: script que lee `properties.real.json` + `property-photos.json` y los
> inserta en D1 (`property` + `property_photo`), para no empezar vacío.

---

## 3. Arquitectura (Astro en Cloudflare Worker + Supabase)

**Supabase es la base de datos oficial.** El front sigue siendo este proyecto Astro (desplegado
como Cloudflare Worker); Supabase aporta datos, auth y almacenamiento de fotos.

- **Supabase Postgres**: todas las tablas (pisos, fotos, leads, eventos, clientes, citas,
  comerciales, peticiones de reseña). Con **RLS activado en todas las tablas** del esquema público.
- **Supabase Auth**: login de los comerciales (email/contraseña o magic link). El **rol**
  (admin/comercial) va en `app_metadata` (NO en `user_metadata`, que es editable por el usuario)
  y se usa en las políticas RLS.
- **Supabase Storage**: bucket para las **fotos de los pisos** (sustituye a R2). Subida con
  INSERT+SELECT+UPDATE para permitir reemplazo (upsert).
- **Panel** en `/es/admin/...` (Astro + islas React, `prerender = false`), detrás de Supabase
  Auth, `noindex` y fuera de sitemap (`hiddenPaths` en `astro.config.mjs`). El navegador usa la
  **clave pública (anon/publishable)** + sesión de Supabase Auth + RLS.
- **API** en `src/pages/api/*.ts` (dinámicas): para operaciones de servidor que lo requieran, el
  Worker usa la **service_role key** (SOLO en servidor, como **secret de Cloudflare**, nunca en
  el navegador). La mayor parte del CRUD puede ir directo desde el cliente con RLS.
- **Web pública**: la costura `getListings()/getListing()` (`src/data/properties.ts`) cambia su
  `source` para leer los pisos **publicados** de Supabase. **v1 = rebuild al guardar/publicar**
  (lee Supabase en build); **v2 = ficha dinámica** (`/es/inmueble/[slug]` con `prerender=false`)
  si la latencia molesta.

### Cómo se conectan (pasos de integración)
1. `npm i @supabase/supabase-js` (**versión fijada**, commit del lockfile).
2. Variables: `SUPABASE_URL` y `SUPABASE_ANON_KEY` (públicas, para el navegador) y
   `SUPABASE_SERVICE_ROLE_KEY` (**secreta**, solo en rutas API del Worker →
   `wrangler secret put`). Nunca exponer la service_role en el cliente.
3. Crear el **esquema** (§4) en Supabase con **RLS** y políticas por rol/propietario; exponer al
   Data API las tablas que el front lee.
4. **Auth**: alta de los comerciales en Supabase Auth; guardar el rol en `app_metadata`.
5. **Storage**: bucket `property-photos`; políticas de subida para comerciales autenticados.
6. Cablear `getListings()` para leer pisos publicados de Supabase (build v1).

> Para la puesta en marcha hay un **conector MCP de Supabase** disponible en esta sesión
> (`mcp.supabase.com`): si lo autenticas (OAuth) con un **token de acceso con permisos acotados**,
> puedo inspeccionar el proyecto, crear el esquema y las políticas. Alternativa: me pasas la URL
> del proyecto y las claves (la service_role como secret, no en texto plano en el repo).

---

## 4. Modelo de datos (alto nivel, D1)

- **`agent`** (comercial): `id`, `name`, `email`, `role`, auth.
- **`property`**: `id`, `ref`, `operation`, `type`, `town`, `zone`, `price`, `previous_price`,
  `rooms`, `baths`, `area`, `floor`, `elevator`, `parking`, `terrace`, `state`, `tag`,
  `description`, `likes`, `watch_out`, `geo_lat`, `geo_lng`, `radius_m` (30–70), `status`
  (borrador/publicado/retirado), `created_by`, `updated_at`. **Esta es ahora la fuente de verdad.**
- **`property_photo`**: `id`, `property_id`, `r2_key`, `order`, `alt`. (Galería por piso.)
- **`lead`**: `id`, `name`, `phone` (E.164), `email`, `intent` (comprar/vender/alquilar/
  valoración), `zone`, `budget`, `property_ref?` (piso de interés), `source` (whatsapp/
  formulario/llamada/valoración/manual), `status` (nuevo/contactado/cita/ganado/perdido/
  sin_respuesta), `assigned_to` (agent), `consent_marketing` (+fecha+origen, RGPD), `created_at`.
- **`lead_event`**: `id`, `lead_id`, `type` (llamada/whatsapp/email/nota/cambio_estado),
  `note`, `agent_id`, `created_at`. (Historial de contacto.)
- **`client`**: `id`, `name`, `phone`, `email`, `consent_marketing`. (Un lead "ganado" o con
  cita se promueve a cliente; puede fusionarse con `lead`.)
- **`appointment`**: `id`, `property_id`, `lead_id`/`client_id`, `agent_id`, `starts_at`,
  `ends_at`, `status`, `notes`.
- **`review_request`**: `id`, `appointment_id`, `channel`, `sent_at`, `status`, `clicked_at`.

---

## 5. Módulo A — Alta/edición de piso (ahora completa)

1. **Formulario de ficha**: todos los campos de `Property` (tipo, pueblo, zona, precio,
   habitaciones, baños, m², planta, ascensor/parking/terraza, estado, descripción, `likes`,
   `watchOut`), con validación.
2. **Fotos → R2**: subir, ordenar, borrar, foto de portada. Convertir/limitar tamaño
   (el adapter Cloudflare tiene límite de 25 MiB por asset; comprimir en subida). Es el
   componente más caro de construir.
3. **Mapa de círculo**: `src/islands/ApproxLocationMap.tsx` en modo **edición** (mover centro +
   slider de **radio 30–70 m**; hoy pinta un círculo fijo → añadir editable, devolver
   `{lat,lng,radiusM}`). Guardar en `property`.
4. **Publicación**: al guardar (estado "publicado") → rebuild (v1) o ficha dinámica (v2). La
   costura `getListings()` lee D1; las páginas no cambian.
5. **Esquema público**: añadir `radiusM?` a `Property.geo` (hoy `src/pages/es/inmueble/[slug]`
   llama a `ApproxLocationMap` sin radio → usa 250 m por defecto).

---

## 6. Módulo B — Leads (el que pediste añadir)

### Captura automática desde la web
- `ContactForm` y los CTAs de WhatsApp, además de abrir WhatsApp, hacen **`POST /api/leads`**
  con nombre/teléfono/intención/piso de interés/origen. Reusa `data-contact`/`data-origin`
  (la "espina de conversión", [[espina-conversion]]): el lead queda registrado **aunque el
  comercial no conteste**. (Hoy el formulario solo abre WhatsApp y el lead se pierde.)
- Fuentes: formulario de contacto, botón WhatsApp, botón llamar (tel:), wizard de valoración,
  consulta desde una ficha de piso. Cada una pasa su `origin` → `lead.source`.
- **RGPD:** registrar `consent_marketing` (casilla de privacidad del formulario) con fecha y
  origen; sin consentimiento no se dispara comunicación comercial luego.

### Gestión en el panel
- **Bandeja/lista** de leads con filtros (estado, intención, zona, comercial, fecha, origen).
- **Pipeline de estados:** `nuevo → contactado → cita agendada → ganado | perdido`
  (+ `sin_respuesta`). Arrastrar/cambiar estado; cada cambio crea un `lead_event`.
- **Clasificación:** intención (comprar/vender/alquilar/valoración), zona, presupuesto, origen,
  comercial asignado. Sirve para priorizar y repartir.
- **Ficha de lead:** datos + **historial de contacto** (`lead_event`) + acciones rápidas
  (WhatsApp/llamar/email con plantilla) + "convertir en cita" (enlaza al módulo C).
- **Reparto:** asignar lead a un comercial (manual en v1; reglas automáticas en v2).

### Medición
- Lead capturado = fila en D1 (dato duro) → cierra la atribución que hoy falta (los clics a
  WhatsApp se miden en GA4/GTM pero no se guarda el lead). Enlaza con [[espina-conversion]].

---

## 7. Módulo C — Citas + disparo de reseña

- Igual que la versión anterior del plan: estados pendiente → realizada/no_show/cancelada,
  calendario + lista, y al marcar **realizada** (con consentimiento) → **WhatsApp + email**
  pidiendo reseña de Google (`site.googleRating.url`/`mapsUrl`, CID 18024108401007901977).
- **WhatsApp:** v1 **wa.me semiautomático** (gratis, un clic del comercial; reusa
  `src/lib/links.ts`); v2 **API Cloud** (automático, de pago, plantillas Meta).
- **Email:** proveedor transaccional (Resend/MailChannels/Brevo) con dominio verificado.
- **Medición del bucle:** `review_request` + redirector `/api/r/:id` que cuenta el clic y 302 a
  Google (+ `data-contact="resena"`). "Pedida" y "clic" son medibles; "conseguida" se estima
  comparando `googleRating.count`.

---

## 8. Fases de entrega (re-priorizadas con alta propia + leads)

- **Fase 0 — Decisiones (§10).** Fotos/R2, auth, email, WhatsApp, publicación.
- **Fase 1 — Infra + auth + migración.** D1 + R2 + KV en `wrangler.jsonc`; auth comerciales;
  **migrar los 126 pisos** de `properties.real.json`+fotos a D1. *Hecho cuando* la web pública
  lee el inventario desde D1 (costura cambiada) sin cambiar páginas.
- **Fase 2 — Alta/edición de piso (módulo A).** Formulario + **fotos a R2** + mapa editable
  (radio 30–70 m) + publicación. *Hecho cuando* un comercial crea un piso con fotos y círculo y
  se publica.
- **Fase 3 — Leads (módulo B).** `POST /api/leads` + captura en el formulario/CTAs; bandeja,
  pipeline, clasificación, ficha de lead con historial. *Hecho cuando* un contacto de la web
  aparece como lead y el comercial lo mueve por el pipeline.
- **Fase 4 — Citas (módulo C, sin disparo).** Crear/editar citas desde un lead, estados,
  calendario. *Hecho cuando* un comercial gestiona su agenda semanal en móvil.
- **Fase 5 — Disparo post-visita + medición.** WhatsApp + email + `review_request` +
  redirector. *Hecho cuando* al cerrar una cita el cliente recibe la petición y el clic queda
  contado.
- **Fase 6 (opcional) — Escala.** WhatsApp API Cloud, reglas de reparto de leads, ficha
  dinámica, informes.

---

## 9. Build vs. buy y riesgos

| Componente | Recomendación | Nota |
|---|---|---|
| Inventario de pisos | **BUILD** (ahora propio) | D1 + R2; migrar los 126 actuales. Es el mayor coste nuevo. |
| Subida/gestión de fotos | **BUILD sobre Supabase Storage** | Bucket `property-photos`; comprimir en subida; portada + orden. |
| Mapa círculo 30–70 m | **BUILD (base hecha)** | `ApproxLocationMap.tsx` existe; añadir modo edición. |
| Auth comerciales | **Supabase Auth** | Email/contraseña o magic link; rol en `app_metadata`; cero login propio. |
| Base de datos | **Supabase (Postgres)** | Base oficial del usuario; RLS por rol/propietario. |
| Captura/gestión de leads | **BUILD** | Es el núcleo del valor; se apoya en la espina de conversión existente. |
| Calendario de citas | **BUILD ligero** o Cal.com | Cal.com si no se quiere construir agenda. |
| Disparo reseña | **wa.me + Resend** o reutilizar piloto **NFC** (Calipso) | El NFC ya existe para reseñas; valorar delegar. |

**Riesgos:** (1) **fotos** = el trabajo más pesado (subida, almacenamiento, rendimiento);
(2) **RGPD** en la captura de leads y el disparo de reseña (consentimiento con fecha/origen,
opt-out, textos legales a actualizar); (3) **mantenimiento** de más piezas para una agencia
pequeña; (4) ser ahora la **única fuente de verdad** del inventario (no hay feed de respaldo);
(5) **publicación**: rebuild por cambio puede ser lento si el inventario cambia mucho → valorar
ficha dinámica.

---

## 10. Preguntas abiertas (desbloquean la Fase 0)

1. **Fotos:** ¿cuántas por piso y de qué tamaño? ¿Se suben originales (y comprimimos nosotros)
   o ya vienen optimizadas? Confirma usar **R2**.
2. **Auth:** ¿**Cloudflare Access** (login por email, cero código) o login propio? ¿Cuántos
   comerciales y roles (admin/comercial)?
3. **Email transaccional:** proveedor (Resend/MailChannels/Brevo/SendGrid) y ¿dominio
   `conromaasesores.com` verificado (SPF/DKIM)?
4. **WhatsApp:** ¿**wa.me semiautomático** (gratis, clic del comercial) o **API Cloud**
   (automático, de pago)?
5. **Disparo de reseña:** ¿se construye aquí o se **reutiliza el piloto NFC** (Calipso)?
6. **Leads — formulario:** ¿el formulario de contacto sigue **abriendo WhatsApp** y además
   captura el lead, o cambia a **enviar al CRM** + notificar al comercial (sin abrir WhatsApp)?
7. **Publicación:** ¿sirve **rebuild al guardar** (minutos) o hace falta ver el cambio **al
   instante** (ficha dinámica, más coste de CPU del Worker)?

---

### Ficheros clave (evidencia)
- `astro.config.mjs` / `wrangler.jsonc` — Worker Cloudflare; añadir D1/R2/KV; `hiddenPaths`.
- `src/data/properties.ts` — costura `getListings()/getListing()`; cambiar `source` a D1.
- `scripts/build_properties.py` + `src/data/properties.real.json` + `property-photos.json` —
  base para la **migración inicial** de 126 pisos a D1.
- `src/islands/ApproxLocationMap.tsx` — círculo (hacer editable, radio 30–70 m).
- `src/islands/ContactForm` + `src/lib/links.ts` (`whatsappUrl`) — punto de **captura de leads**.
- `src/layouts/BaseLayout.astro` — listener Click-URL (`data-contact`/`data-origin`) para atribuir leads.
- `src/data/site.ts` — NAP, `googleRating.url`, `mapsUrl` (CID) para el disparo de reseña.
- `src/lib/habitatsoft.ts` — queda **sin uso** (se descarta Habitatsoft).
