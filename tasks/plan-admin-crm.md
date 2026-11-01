# Plan — Panel de administración + CRM (Conroma Asesores)

> Fecha: 2026-10-29 · Estado: propuesta para decidir, aún sin código.
> Alcance: dashboard para que los comerciales (1) den de alta viviendas con ficha
> completa + ubicación por círculo 30–70 m, y (2) gestionen citas con disparo de
> reseña Google post-visita (WhatsApp + email).
>
> Respeta [[orden-de-trabajo]]: la web pública (contenido + migración) va **antes**;
> esto arranca después. Este documento es el brainstorm que pedía
> `~/.claude/projects/-Users-sebastian-conroma-web/memory/admin-crm-dashboard.md`.

---

## 0. TL;DR (la recomendación en 6 líneas)

- **Integrar, no reconstruir el alta de pisos.** Conroma ya trabaja con **Habitatsoft**
  (código de agencia **527526**: las fotos en `src/data/property-photos.json` salen de su
  CDN `fotoshs.imghs.net/.../527526/...`, y ya existe el parser `src/lib/habitatsoft.ts`).
  El panel NO debe duplicar el alta de inmuebles: Habitatsoft es la fuente de verdad del
  inventario. El panel solo **añade lo que Habitatsoft no da**: el radio del círculo y las
  notas editoriales (`likes`/`watchOut`), y gestiona el **CRM de citas + reseñas**, que es
  lo que de verdad no existe hoy.
- **Arquitectura: no montar backend aparte.** El sitio ya se despliega como **Cloudflare
  Worker** (`adapter: cloudflare()` en `astro.config.mjs`, `wrangler.jsonc`). Se añaden
  **rutas de API de Astro** (`prerender = false`) + **D1** (citas/clientes/overrides) +
  **R2** (fotos propias, si las hubiera) sobre el mismo proyecto. Cero servicios nuevos.
- **3 preguntas que bloquean el arranque** (detalle en §10): (1) ¿tenéis el **feed/URL de
  Enlace Web 2.0** de Habitatsoft y permite escritura o solo lectura?; (2) ¿WhatsApp
  **API Cloud** (automático, de pago, alta Meta) o **wa.me semiautomático** (gratis, un
  clic del comercial)?; (3) ¿el disparo de reseña lo hace **este proyecto** o se delega al
  piloto **Fidelización NFC** (PHP+SQLite Calipso) ya en marcha?

---

## 1. Objetivo y alcance

### Qué resuelve
Dar a los comerciales una herramienta propia para (a) tener fichas de piso completas en la
web pública con ubicación aproximada controlada, y (b) no perder citas ni reseñas: hoy las
reseñas de Google se muestran en carrusel (`src/islands/TestimonialCarousel.tsx`) pero
**nunca se piden**; el disparo post-visita cierra ese bucle.

### Qué SÍ entra en v1 (MVP)
- Login de comerciales (pocos usuarios).
- Lista de pisos **leída del feed Habitatsoft**, con un panel para editar **solo los campos
  que el feed no cubre**: centro del mapa + **radio 30–70 m**, y notas `likes`/`watchOut`.
- CRM de citas: crear cita (piso + cliente + fecha/hora + comercial), estados
  **pendiente → realizada / no-show / cancelada**, vista **calendario** y vista lista.
- Al marcar **realizada**: disparo de **WhatsApp + email** al cliente pidiendo valoración
  del servicio + reseña de Google (con el `googleRating.url` de `src/data/site.ts`).
- Registro de "reseña pedida / abierta" para medir el bucle.

### Qué NO entra en v1 (para no sobre-construir — ponytail)
- Alta de pisos desde cero con subida masiva de fotos (lo hace Habitatsoft; ver §2).
- Portal del cliente, firma de documentos, facturación, pipeline de leads completo.
- Multi-idioma del panel (los comerciales trabajan en es/ca).
- App móvil nativa (el panel es web responsive; móvil ~97% del tráfico → [[validar-en-movil]]).
- Sincronización bidireccional con Habitatsoft (solo lectura del feed en v1; ver riesgos).

---

## 2. Decisión clave: integrar con Habitatsoft vs. construir alta propia

**Recomendación: INTEGRAR (leer el feed Habitatsoft). No reconstruir el alta de pisos.**

### Evidencia en el repo de que Habitatsoft ya es la fuente real
- `src/lib/habitatsoft.ts`: parser completo del feed **"Enlace Web 2.0" (v1.7)**
  `<WEB><Inmuebles><Inmueble>` → `Property`, incluyendo fotos (`Medias/Fotos/Foto`),
  geo (`Latitud`/`Longitud`) y textos por idioma. Hoy está **definido pero sin cablear**
  (nadie importa `parseHabitatsoftXml`): es el "enchufe" que el proyecto dejó preparado.
- `src/data/property-photos.json`: las URLs de fotos reales ya vienen del **CDN de
  Habitatsoft** (`fotoshs.imghs.net/3xl//527526/...`), código de agencia **527526**.
- `src/data/properties.ts` lo dice explícito en comentario: *"el día que llegue el feed de
  Habitatsoft, solo cambia esta constante `source` (y un parser XML→Property), sin tocar
  páginas"*. La costura `getListings()/getListing()` ya está pensada para eso.
- Hoy el inventario es un **volcado de Excel** (`scripts/build_properties.py` →
  `properties.real.json`, 126 pisos) **+ scrape de fotos** — un parche temporal, no la
  fuente de verdad.

### Razonamiento build-vs-integrate
| Criterio | Integrar feed Habitatsoft | Reconstruir alta en el panel |
|---|---|---|
| Fuente única de verdad | Sí (Habitatsoft ya la tiene) | Se duplica → dos verdades que divergen |
| Fotos/descripciones/geo | Ya vienen en el feed | Habría que re-subir todo a R2 |
| Coste de construcción | Bajo (parser ya hecho) | Alto (formulario + subida fotos + validación) |
| Mantenimiento | Bajo; el comercial sigue usando Habitatsoft | Doble trabajo del comercial (alta en 2 sitios) |
| Riesgo | Depender del formato/URL del feed | Reinventar un PMS inmobiliario |

**Conclusión:** el comercial da de alta el piso **en Habitatsoft como ya hace**. El panel
Conroma **lee** ese feed y solo guarda, por referencia de piso, un pequeño "override"
(radio del círculo + `likes`/`watchOut`), que la costura `properties.ts` fusiona con el feed.
Eso evita el componente más caro (alta + fotos) y mantiene una sola verdad del inventario.

> **Suposición a confirmar (§10):** que Conroma efectivamente gestiona su cartera en
> Habitatsoft y puede obtener la URL del feed Enlace Web 2.0. Si NO usaran Habitatsoft como
> gestor, cambia todo: habría que construir alta propia y el presupuesto se multiplica.

---

## 3. Arquitectura (ecosistema Cloudflare actual)

**Hecho de partida (verificado en el repo):** el sitio **no es "estático a pelo"**: usa
`adapter: cloudflare()` (`astro.config.mjs`) y se despliega como **Cloudflare Worker**
(`wrangler.jsonc`, `main: @astrojs/cloudflare/entrypoints/server`, binding `ASSETS` → `./dist`).
No hay `output` forzado → por defecto las páginas se **prerenderizan estáticas**, pero el
Worker **puede servir rutas on-demand** marcándolas `export const prerender = false`. Hoy no
hay ninguna ruta de API ni binding de datos (solo `ASSETS`). **Es decir: la capa dinámica ya
está medio montada; falta encenderla.**

### Opción A (RECOMENDADA) — Todo en el mismo Worker de Astro
- El panel vive en `/es/admin/...` como páginas Astro + islas React, `prerender = false`.
- La API vive en rutas Astro `src/pages/api/*.ts` (`export const POST/GET`), también dinámicas.
- Datos en **D1** (SQLite de Cloudflare): citas, clientes, comerciales, overrides de piso.
- Fotos/adjuntos propios en **R2** (solo si el comercial sube algo que Habitatsoft no tiene;
  en v1 probablemente ni hace falta porque las fotos vienen del CDN de Habitatsoft).
- **KV** para sesión/caché del feed Habitatsoft (TTL corto).
- La web pública consume el inventario como hoy vía `getListings()`; el feed se cachea y los
  overrides se leen de D1 en build (o en runtime si la ficha pasa a dinámica).
- **Trade-off:** un único despliegue, una sola auth, bindings en el `wrangler.jsonc` que ya
  existe. Mezcla web pública de marketing con panel interno (mitigable: `/admin` detrás de
  auth, `noindex`, y ya excluible del sitemap como se hace con `hiddenPaths`).
- **Por qué gana:** es la de menos piezas nuevas. Reutiliza adapter, wrangler, costura de
  inventario y la "espina de conversión" ([[espina-conversion]]) sin duplicar nada.

### Opción B — Worker de API separado + mismo front
- Un segundo Worker (`conroma-crm`) con su `wrangler.jsonc`, D1/R2 propios, y el panel
  consumiéndolo por `fetch`.
- **Trade-off:** aísla el panel de la web de marketing (deploys independientes, menos riesgo
  de romper la web al tocar el CRM), pero duplica config, auth y CORS. Útil solo si el CRM
  crece mucho o lo usa otra marca.

### Opción C — SaaS externo (no-build) para el CRM
- El CRM de citas no se construye: se usa una herramienta existente (ver §8). El panel
  Conroma solo cubre el override de piso (radio + notas), y las citas/reseñas se delegan.
- **Trade-off:** el menor código, pero menor control del disparo WhatsApp+reseña a medida y
  posibles costes de licencia. Encaja si se reutiliza el piloto **NFC** para reseñas.

### Publicación web: rebuild en push vs. render dinámico
- **v1 (recomendado): rebuild**. El override de piso cambia poco; un cambio dispara
  `npm run build && wrangler deploy` (o un hook de Cloudflare Pages/Workers Build). Simple,
  cacheable, barato. La ficha pública sigue estática.
- **v2 (si molesta la latencia de publicación): render dinámico** de la ficha de piso
  (`/es/inmueble/[slug]` con `prerender = false`) leyendo feed+D1 en runtime. Más caro en
  CPU del Worker, innecesario mientras el inventario no cambie cada minuto.

---

## 4. Modelo de datos (alto nivel, D1)

El inventario **no se modela aquí**: vive en Habitatsoft y se lee por `ref`. D1 solo guarda
lo que el feed no da y el CRM.

- **`agent` (comercial)**: `id`, `name`, `email`, `role` (admin/comercial), `password_hash`
  o proveedor de auth. (Pocos registros.)
- **`property_override`**: `ref` (PK, la de Habitatsoft, ej. `C-1280-A`),
  `geo_lat`, `geo_lng`, `radius_m` (30–70, validar rango), `likes`, `watch_out`,
  `updated_by`, `updated_at`. **No** duplica precio/fotos/etc. del feed.
- **`client`**: `id`, `name`, `phone` (E.164 para wa.me), `email`, `consent_marketing`
  (bool + fecha + origen — clave RGPD, §9), `created_by`.
- **`appointment` (cita)**: `id`, `property_ref`, `client_id`, `agent_id`, `starts_at`,
  `ends_at`, `status` (`pendiente`|`realizada`|`no_show`|`cancelada`), `notes`, `created_at`.
- **`review_request`**: `id`, `appointment_id`, `channel` (`whatsapp`|`email`),
  `sent_at`, `status` (`enviada`|`fallida`|`clic`), `review_link_clicked_at`. Cierra la
  medición del bucle de reseñas.

> Nota: `Property.geo` hoy es solo `{latitude, longitude}` (ver `src/data/properties.ts`).
> Hay que **añadir `radiusM?`** al tipo para que la ficha pública lo pase al mapa (hoy
> `src/pages/es/inmueble/[slug].astro` llama a `<ApproxLocationMap>` **sin** `radiusMeters`,
> así que usa el default 250 m del island). Ese es el único cambio de esquema público.

---

## 5. Flujo de alta/edición de piso (lo mínimo, porque Habitatsoft hace el resto)

1. El comercial da de alta el piso **en Habitatsoft** (fotos, características, precio, geo
   real) — como ya hace hoy.
2. El panel Conroma lista los pisos del feed (por `ref`). Para cada uno, un formulario corto:
   - **Mapa de círculo**: reutiliza `src/islands/ApproxLocationMap.tsx` en modo edición.
     El comercial arrastra el centro y ajusta el **radio 30–70 m** (slider; validar rango).
     Hoy el island solo pinta un círculo fijo; habría que añadirle modo "editable" (mover
     centro + cambiar radio) y devolver `{lat, lng, radiusM}`. Guardar en `property_override`.
   - **Notas editoriales**: `likes` ("lo que enamora") y `watchOut` ("ojo con…") — campos
     que el feed Habitatsoft **no** trae (el propio `habitatsoft.ts` lo comenta).
3. **Fotos → R2**: solo si el comercial quiere una foto que no está en Habitatsoft. En v1 se
   puede **omitir** (las fotos vienen del CDN `fotoshs.imghs.net`). Nombrarlo como la opción
   pequeña: *si no hay necesidad real de fotos propias, no montar R2 en v1*.
4. **Publicación**: al guardar, se dispara el rebuild (o, en v2, la ficha dinámica lo lee en
   runtime). La costura `getListings()` fusiona feed + override sin tocar las páginas.

---

## 6. CRM de citas + disparador post-visita

### Estados y calendario
- Estados: `pendiente` → `realizada` | `no_show` | `cancelada`.
- Vistas: **calendario** (semana/día) + lista filtrable por comercial. En el front, HeroUI
  (`@heroui/react` ya está en `package.json`) cubre tablas/inputs; para el calendario, o un
  componente propio simple o una librería ligera (ver §8). Móvil primero ([[validar-en-movil]]).

### Disparador: al marcar "realizada" → WhatsApp + email
Flujo: `PATCH /api/appointments/:id {status:'realizada'}` → si hay `consent_marketing` →
encola envío WhatsApp + email → crea filas `review_request`. **Debe ser idempotente** (no
reenviar si ya se envió para esa cita).

**Opciones WhatsApp:**
- **(a) wa.me semiautomático (recomendado para MVP, ponytail).** El panel no envía solo:
  muestra al comercial un botón `wa.me/<tel>?text=<plantilla>` ya redactado (reutiliza el
  patrón de `src/lib/links.ts` → `whatsappUrl`/`whatsappMessage`). Un clic del comercial y
  WhatsApp Web/móvil abre el mensaje. **Coste 0, sin alta en Meta, sin plantillas aprobadas.**
  Limitación: requiere el clic humano; no es 100% automático.
  `shortcut: envío manual por el comercial; subir a API Cloud cuando el volumen de citas lo
  justifique o se quiera envío desatendido.`
- **(b) WhatsApp Business API Cloud (automático).** Envío desatendido, pero exige cuenta de
  WhatsApp Business, número verificado, **plantillas (HSM) aprobadas por Meta** para mensajes
  iniciados por la empresa, y **coste por conversación**. Reservar para v2 si el volumen lo pide.

**Opciones email:** proveedor transaccional por API desde el Worker — **Resend**, **MailChannels**
(históricamente gratis desde Workers; confirmar estado actual), **Brevo** o **SendGrid**.
Recomendado: el más simple con dominio ya verificado (SPF/DKIM de `conromaasesores.com`).
> **Suposición:** no veo proveedor de email transaccional configurado en el repo; hay que elegirlo.

**Plantilla del mensaje** (es/ca): agradecer la visita + pedir valoración + enlace directo a
reseña de Google usando `site.googleRating.url` / `site.mapsUrl` de `src/data/site.ts`
(CID `18024108401007901977`).

### Cómo medir que la reseña se pidió / se consiguió
- **Pedida:** fila `review_request` por cita + canal (dato duro en D1).
- **Clic al enlace de reseña:** el enlace lleva un redirector propio
  `/api/r/:requestId` → cuenta el clic (actualiza `review_request.status='clic'`) → 302 a
  Google. Además, `data-contact="resena"` + `data-origin="postvisita"` para que lo recoja el
  mismo listener Click-URL de `BaseLayout.astro` ([[espina-conversion]]) en GA4/GTM.
- **Conseguida:** Google **no** da atribución por reseña individual; se infiere comparando
  `googleRating.count` en `site.ts` antes/después (hoy 107, revisado 2026-10-12). Dejarlo
  claro: "pedida" y "clic" son medibles; "conseguida" es estimación, no dato 1:1.

---

## 7. Fases de entrega (cada una con criterio de "hecho")

- **Fase 0 — Decisiones (§10).** *Hecho cuando* hay URL del feed Habitatsoft, elección
  WhatsApp (a/b), elección email, y decisión NFC vs. propio.
- **Fase 1 — Cablear el feed Habitatsoft.** Importar `parseHabitatsoftXml`, cachear en KV,
  sustituir el `source` de Excel por el feed en `properties.ts`. *Hecho cuando* la web pública
  muestra el inventario desde el feed y los 126 pisos cuadran con Habitatsoft.
- **Fase 2 — Auth + override de piso (radio + notas).** Login comerciales, D1
  `property_override`, `ApproxLocationMap` editable (centro + radio 30–70 m), `Property.geo`
  con `radiusM`, ficha pública pasando el radio. *Hecho cuando* un comercial fija un círculo
  de 50 m y se ve publicado en la ficha.
- **Fase 3 — CRM de citas (sin disparo).** Crear/editar citas, estados, calendario + lista.
  *Hecho cuando* un comercial gestiona su agenda semanal en móvil.
- **Fase 4 — Disparo post-visita + medición.** Al marcar "realizada": WhatsApp (opción
  elegida) + email + `review_request` + redirector `/api/r/:id`. *Hecho cuando* al cerrar una
  cita el cliente recibe la petición y el clic al enlace de Google queda contado.
- **Fase 5 (opcional) — Automatizar/escala.** Subir WhatsApp a API Cloud, fotos propias en
  R2, ficha dinámica si hace falta. *Hecho cuando* el envío es desatendido con plantilla
  aprobada.

---

## 8. Build vs. buy por componente

| Componente | Recomendación | Nota |
|---|---|---|
| Alta/inventario de pisos | **BUY/integrate** (Habitatsoft) | Ya es el PMS; solo leer su feed (§2). |
| Mapa círculo 30–70 m | **BUILD (ya hecho)** | `ApproxLocationMap.tsx` existe; añadir modo edición. |
| Auth comerciales | **BUILD mínimo** o Cloudflare Access | Pocos usuarios; Cloudflare Access evita montar login. |
| Base de datos CRM | **BUY plataforma** (D1) | Serverless, ya en el ecosistema; sin servidor propio. |
| Calendario de citas | **BUILD ligero** vs. **Calendly/Cal.com** | Calendly resuelve agenda+recordatorios pero no liga a piso/ficha ni al disparo de reseña a medida. Evaluar Cal.com (open source) si se quiere no construir. |
| Disparo reseña (WhatsApp/email) | **BUY APIs** (wa.me/Resend) o **reutilizar NFC** | El piloto **Fidelización NFC** (PHP+SQLite Calipso + dashboard React) ya existe para reseñas: el disparo podría delegarse ahí en vez de construir nuevo. |
| CRM completo | **No construir** en v1 | HubSpot free, Pipedrive, etc. son overkill y no ligan a Habitatsoft ni al mapa. |

**Línea ponytail:** el máximo ahorro es *integrar Habitatsoft + reutilizar NFC para el
disparo de reseña + Cloudflare Access para auth*; así el código nuevo se reduce casi al CRM
de citas y al override de piso.

---

## 9. Riesgos

- **RGPD / consentimiento (el mayor).** Enviar WhatsApp/email pidiendo reseña es comunicación
  comercial: requiere **base legal/consentimiento** del cliente (campo `consent_marketing` con
  fecha y origen) y que la petición sea proporcionada a la relación (acaba de visitar un piso).
  Sin consentimiento registrado, **no disparar**. Añadir opt-out y texto legal (hay
  `src/pages/es/privacidad.astro`/`aviso-legal.astro` que actualizar).
- **WhatsApp API: coste y fricción.** La opción (b) cobra por conversación y exige plantillas
  aprobadas por Meta; además, mensajes no solicitados pueden marcar el número como spam. La
  opción (a) wa.me lo evita a cambio del clic manual.
- **Dependencia del feed Habitatsoft.** Si cambia el formato de "Enlace Web 2.0", se rompe la
  web. Mitigar: cachear la última versión buena en KV y validar el parse (el parser ya es
  tolerante: `asArray`, `num`, `bool01`).
- **Solo-lectura del feed.** Si Habitatsoft no expone escritura por API, el override (radio +
  notas) vive solo en Conroma y nunca vuelve a Habitatsoft — asumible, pero hay que tenerlo claro.
- **Mezclar panel interno con web de marketing** (Opción A): el `/admin` debe ir con auth,
  `noindex` y fuera de sitemap (ya hay patrón `hiddenPaths` en `astro.config.mjs`).
- **Mantenimiento.** Más piezas (D1, API, auth, colas de envío) = más superficie que mantener
  para una agencia pequeña. Favorecer buy/reutilizar siempre que se pueda (§8).
- **Medición de reseña "conseguida"** no es atribuible 1:1 (§6): no prometer ese número exacto.

---

## 10. Preguntas abiertas para el usuario (desbloquean la Fase 0)

1. **Habitatsoft como fuente de verdad (la más crítica):** ¿Conroma gestiona su cartera en
   Habitatsoft y tenéis la **URL del feed "Enlace Web 2.0"** (agencia 527526)? ¿Ese feed es
   **solo lectura** o permite **escritura por API** (para devolver el radio/notas)? Toda la §2
   depende de esto.
2. **WhatsApp:** ¿opción **(a) wa.me semiautomático** (gratis, un clic del comercial) o **(b)
   API Cloud** (automático, de pago, alta en Meta + plantillas aprobadas)? Esto define coste y
   si el disparo es desatendido.
3. **Disparo de reseña: ¿aquí o en NFC?** ¿Se construye en este proyecto o se **reutiliza el
   piloto Fidelización NFC** (PHP+SQLite Calipso + dashboard React) que ya existe para reseñas?
4. **Email transaccional:** ¿qué proveedor? (Resend/MailChannels/Brevo/SendGrid) y ¿está
   verificado el dominio `conromaasesores.com` con SPF/DKIM?
5. **Auth:** ¿**Cloudflare Access** (cero código, login por email) o login propio? ¿Cuántos
   comerciales y qué roles (admin vs. comercial)?
6. **Fotos propias:** ¿los comerciales necesitan subir fotos que **no** están en Habitatsoft?
   Si no, se omite R2 en v1.
7. **Publicación:** ¿sirve **rebuild al guardar** (minutos de latencia) o hace falta que el
   cambio de piso se vea **al instante** (ficha dinámica, más coste)?

---

### Ficheros citados (evidencia)
- `astro.config.mjs` — adapter Cloudflare, sin `output` (estático + Worker), `hiddenPaths`.
- `wrangler.jsonc` — Worker `conroma-web`, binding `ASSETS`, sin D1/R2/KV aún.
- `src/data/properties.ts` — costura `getListings()/getListing()`, `Property.geo`, comentario
  del plan de feed; fusiona `properties.real.json` + `property-photos.json`.
- `src/lib/habitatsoft.ts` — `parseHabitatsoftXml` (Enlace Web 2.0 v1.7), **sin cablear**.
- `src/data/property-photos.json` — fotos del CDN Habitatsoft (527526).
- `scripts/build_properties.py` — volcado temporal del Excel (126 pisos).
- `src/islands/ApproxLocationMap.tsx` — círculo (default 250 m, `radiusMeters` configurable).
- `src/pages/es/inmueble/[slug].astro` — usa el mapa **sin** pasar radio (línea ~158).
- `src/lib/links.ts` — `whatsappUrl`/`whatsappMessage`, patrón reutilizable para el disparo.
- `src/islands/TestimonialCarousel.tsx` + `src/data/testimonials.ts` — reseñas mostradas, no pedidas.
- `src/layouts/BaseLayout.astro` — GA4/GTM + listener Click-URL (`data-contact`/`data-origin`).
- `src/data/site.ts` — NAP, `whatsapp`, `googleRating.url`, `mapsUrl` (CID), `geo`.
