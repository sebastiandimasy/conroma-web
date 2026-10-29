# 02 — Estrategia y auditoría SEO · Conroma Asesores

> Solo análisis. No se ha tocado código. Fuente de verdad de marca: `ESTANDAR.md`.
> Negocio: inmobiliaria familiar en Malgrat de Mar (Alt Maresme / frontera Costa Brava).
> Escalado por fases: **local → Barcelona → Cataluña/España → internacional (ca/es/en/fr)**.

---

## 0. Resumen ejecutivo (lo accionable primero)

1. **El sitio está casi todo en `noindex` por `sampleData: true`.** Mientras los pisos sean de
   ejemplo, Google no debe indexar fichas ni listados (bien hecho), pero tampoco se indexan las
   páginas de pueblo de compra. Hoy solo son indexables: home, comprar, vender, alquilar,
   valoración, `inmobiliaria/[blanes|tordera|lloret|malgrat]`, empresa, equipo, blog (sin posts,
   son `draft`), contacto, gestión-patrimonio, reformas. **El blog está vacío de cara a Google**
   (los 3 posts son `draft` → fuera de sitemap). Prioridad: datos reales de inventario para quitar
   el `noindex`, y publicar posts.
2. **Base técnica sólida**: canonical absoluto, `trailingSlash: 'always'`, sitemap con filtros
   correctos, 301 de la web antigua bien planteados, schema `RealEstateAgent`/`Breadcrumb`/`FAQPage`/
   `RealEstateListing`, hreflang con andamiaje listo para 4 idiomas. Pocas correcciones técnicas.
3. **El activo SEO diferencial es la intención local no cubierta por los portales**: "inmobiliaria
   en <pueblo>", "cuánto vale mi piso en <pueblo>", "papeles para vender en Cataluña". Idealista/
   Fotocasa no responden estas preguntas; Conroma sí puede, con voz de pueblo y FAQPage para
   citación en IA.
4. **Huecos de keyword abandonados a propósito**: Pineda de Mar, Santa Susanna, Palafolls, Calella
   tienen `intro`/`sellerIntro` vacíos → sin página. Es volumen real sin cubrir (ver §2). Decisión
   correcta mientras no haya contenido propio, pero es la primera cola de la Fase 4.1.
5. **Falta `sameAs`** (Instagram ×2 + TikTok) en el schema del agente, y `openingHours`/`priceRange`
   para enriquecer el perfil local. `geo` es `null` (añadir lat/long reales refuerza el local pack).
6. **GEO/AEO** ya parte bien (contenido en Q&A + FAQPage), pero falta: `llms.txt`, E-E-A-T real
   (bio de Boris pendiente, sin autor en posts), y datos citables (€/m², comisión, plazos) que hoy
   se evitan por no inventarlos — hay que conseguirlos de fuente real.

---

## 1. Auditoría on-page / técnica (estado actual)

### 1.1 Títulos y meta descriptions — **bien**
- Plantilla en `seo.ts` (`pageTitle`): añade `| Conroma` una sola vez, sin duplicar. Testado.
- Títulos con intención local clara: "Inmobiliaria en Malgrat de Mar", "Pisos en venta en {town}",
  "Comprar/Vender/Alquilar piso en Malgrat de Mar", ficha "{tipo} en venta en {zona}, {town} — {precio}".
- Descriptions con gancho + dato (nº de pisos, precio desde, idiomas, "sin registrarte"). Longitud OK.
- **Mejora menor**: la home titula "Inmobiliaria en Malgrat de Mar"; la keyword de mayor volumen es
  compra/alquiler de pisos ("pisos en venta malgrat" ~1.300, "piso alquiler malgrat" ~1.600). El H1
  ya cubre "Pisos en venta y alquiler en Malgrat de Mar"; valorar si el `<title>` de home debería
  liderar con "Pisos en venta y alquiler en Malgrat de Mar | Conroma" para alinear title↔H1↔intención.

### 1.2 H1 / H2 — **correcto, con deuda de redacción ya detectada**
- Un solo H1 por página, descriptivo y con topónimo. H2 bien jerarquizados.
- `ESTANDAR.md §2` ya documenta el riesgo: **9 H1 con la misma forma** (cláusula + coma + remate),
  11 eyebrows en pregunta, 4 FAQ "X: lo que nos preguntan". No es problema de ranking sino de
  calidad percibida y de huella de plantilla (relevante también para clasificadores de IA). Romper
  1 de cada 3 como dice el estándar.
- Las páginas de pueblo repiten estructura idéntica (plantilla `[town].astro`): riesgo de
  *thin/duplicate content* a medida que se añadan pueblos sin texto propio. Ver §3.

### 1.3 Canonical / hreflang — **bien diseñado**
- Canonical absoluto por página (`absoluteUrl(path)`), coherente con `trailingSlash: 'always'`.
- `alternates()` solo emite hreflang si hay ≥2 locales publicados; hoy `publishedLocales = ['es']`
  → **no se emite hreflang** (correcto, evita hreflang huérfano). Testado. Al publicar `ca/en/fr`
  se activará solo con añadir el dato + `x-default`. Andamiaje listo sin reescritura.

### 1.4 Datos estructurados — **buena base, decisiones deliberadas**
- `RealEstateAgent` con `@id` estable (`/#agencia`), `address`, `areaServed` (8 pueblos),
  `knowsLanguage` (ca/es/en/fr). `BreadcrumbList`, `FAQPage`, `RealEstateListing` (con `Offer`,
  `House`/`Apartment`, `floorSize`, `address`), `BlogPosting` para posts.
- **Decisión consciente y correcta**: el test `does not self-declare a rating` fija que NO se mete
  `aggregateRating` autoservido en el schema del agente (evita acción manual de Google por reseñas
  autodeclaradas). Mantener. Las estrellas de Google se muestran en la UI enlazando a Maps, no en JSON-LD.
- **Faltan** (ver §4): `sameAs`, `openingHours`, `priceRange`, `geo` real, y vincular `logo`/`image`
  a una entidad `Organization` para el Knowledge Panel.

### 1.5 Enlazado interno — **suficiente pero fino**
- Home: sección `home-guide` con prosa enlazada (venta/malgrat, inmobiliaria/blanes, vender,
  valoración, comprar, alquilar) + `TownLinks` + `BlogPreview`. Buen hub.
- `venta/[town]`: enlaza a valoración y a inmobiliaria/blanes (hardcodeado). `inmueble/[slug]`:
  breadcrumb + listado del municipio + similares. Correcto.
- **Gaps**: las páginas `inmobiliaria/[town]` no se enlazan entre pueblos vecinos (clúster
  geográfico débil); el blog no enlaza a las páginas de pueblo/servicio desde el cuerpo; no hay
  enlaces cruzados comprar↔vender↔alquilar en el pie de contenido. El enlazado "blanes" está
  hardcodeado en `venta/[town]` en vez de salir del modelo de territorio.

### 1.6 Sitemap / robots / indexabilidad — **bien, con efecto colateral importante**
- `robots.txt`: `Allow: /` + sitemap. OK.
- `@astrojs/sitemap` filtra `/privacidad/`, posts `draft`, y (con `sampleData`) `/es/inmueble/` y
  `/es/venta/`. Coherente con los `noindex` de esas plantillas.
- **Efecto a vigilar**: con `sampleData: true` + los 3 posts en `draft`, el sitemap real queda muy
  corto (páginas de servicio + 4 de pueblo). Es correcto para no indexar ejemplos, pero significa
  que **el valor SEO está congelado hasta tener inventario real**. El banner "Web en construcción"
  y el `noindex` deben caer a la vez que entra el feed real.
- 301 de la web antigua (`_redirects`): bien priorizados (alquiler por intención antes que municipio,
  fichas → listado del municipio, resto → /comprar/). Preserva autoridad. Revisar tras publicar que
  no queden cadenas de redirección.

### 1.7 Rendimiento / Core Web Vitals — **fuera de alcance de esta auditoría (requiere medición)**
- Astro estático + islas con `client:visible/idle/load` + imágenes `<Picture>` avif/webp con
  `widths`/`sizes` y `loading` correcto → arquitectura favorable a buen LCP/INP. **No medido aquí**;
  requiere Lighthouse/PageSpeed en móvil real tras deploy. No afirmo números sin fuente.

---

## 2. Estrategia de keywords e intención por pueblo

**Leyenda de volumen**: `[K]` = volumen conocido (Google Ads Keyword Planner, pull previo que
aporta el brief). `[M]` = hay que medir (DataForSEO/Google Ads NO conectados ahora; NotFair
`getKeywordIdeas` puede dar volumen+CPC reales si se autoriza un pull). **No invento volúmenes.**

### 2.1 Volúmenes conocidos `[K]`
| Keyword | Vol/mes | Nota |
|---|---|---|
| piso alquiler malgrat | ~1.600 | intención alquiler, la más alta del núcleo |
| pisos en venta malgrat | ~1.300 | compra, cabecera |
| casas malgrat | ~880 | compra, tipología casa |
| inmobiliaria malgrat | ~320 | competencia **baja** → ganable rápido |
| pisos/inmobiliaria blanes | ~2.900 / ~880 | Blanes mueve más que Malgrat |
| tasacion vivienda | ~8.100 | informacional/transaccional, CPC €1–5,7 (nacional, no local) |

### 2.2 Matriz de intención por pueblo (4 intenciones + informacional)
Para cada pueblo, 5 cajones. Marco el estado en el sitio y la prioridad.

- **Comprar** → "pisos/casas en venta en <pueblo>", "comprar piso <pueblo>".
- **Vender/Captar** → "vender piso <pueblo>", "inmobiliaria <pueblo>" (doble intención).
- **Alquilar** → "piso alquiler <pueblo>", "alquilar piso <pueblo>".
- **Valorar** → "cuánto vale mi piso <pueblo>", "tasación/valoración vivienda <pueblo>".
- **Informacional** → "papeles para vender en Cataluña", "comisión inmobiliaria", "comprar viviendo fuera".

| Pueblo | Estado web | Compra | Vender/Inmob. | Alquiler | Valorar | Prioridad |
|---|---|---|---|---|---|---|
| Malgrat de Mar | catálogo + vender + inmob. | `[K]`1.300 | `[K]`320 (comp. baja) | `[K]`1.600 | `[M]` | **MÁX** (sede) |
| Blanes | solo inmob. (sin catálogo) | `[M]` ~2.900 pisos | `[K]`880 | `[M]` | `[M]` | **ALTA** (mayor volumen) |
| Lloret de Mar | solo inmob. | `[M]` (mucha compra extranjera) | `[M]` | `[M]` (temporada) | `[M]` | ALTA (en/fr después) |
| Tordera | solo inmob. | `[M]` (casas con terreno) | `[M]` | `[M]` | `[M]` | MEDIA |
| Pineda de Mar | **sin página** | `[M]` | `[M]` | `[M]` | `[M]` | MEDIA-ALTA (hueco) |
| Santa Susanna | **sin página** | `[M]` | `[M]` | `[M]` | `[M]` | MEDIA (hueco) |
| Palafolls | **sin página** | `[M]` | `[M]` | `[M]` | `[M]` | MEDIA (hueco) |
| Calella | **sin página** | `[M]` | `[M]` | `[M]` | `[M]` | MEDIA (hueco) |

**Lo que hace falta medir antes de crear páginas nuevas** (`getKeywordIdeas` o pull de Ads):
volumen+CPC+competencia para cada combinación de los 4 pueblos sin página y de las intenciones
compra/alquiler/valorar en Blanes/Tordera/Lloret. Sin ese dato no se decide qué pueblo/intención
merece página propia (criterio: volumen útil y competencia ganable, no publicar por publicar).

### 2.3 Priorización de intención
1. **Captación ("inmobiliaria/vender <pueblo>", "cuánto vale")** — menor volumen pero competencia
   baja, mayor margen y es donde Conroma gana a los portales (los portales no captan, listan).
   Malgrat "inmobiliaria" es comp. baja → victoria rápida.
2. **Alquiler Malgrat** `[K]`1.600 — alto volumen, pero hoy sin catálogo de alquiler publicado; la
   página `/alquilar/` captura la intención con dos caminos (busco / tengo piso) vía WhatsApp.
3. **Compra Malgrat/Blanes** — cabecera de volumen; compite de frente con portales, se gana con
   fichas reales (requiere feed) + páginas de pueblo con contenido propio.
4. **"tasación/valoración vivienda"** `[K]`8.100 es nacional y caro; a nivel local ("valoración
   piso <pueblo>") es más barato y convierte mejor. `/valoracion/` es el imán de captación.

---

## 3. Arquitectura SEO escalable

### 3.1 Taxonomía de URL (ya encaja con el plan, fijarla)
Patrón confirmado en el repo y en `tasks/plan.md §1.2`:
```
/es/<operación>/<territorio>/          listados   → /es/venta/malgrat-de-mar/
/es/inmobiliaria/<territorio>/         captación  → /es/inmobiliaria/blanes/
/es/inmueble/<slug>/                   ficha
/es/<servicio>/                        comprar | vender | alquilar | valoracion | reformas | ...
```
**Hueco a nombrar ya** (del propio plan): `/es/alquiler/<territorio>/` no existe; cuando entre
inventario de alquiler, replicar la plantilla de `venta/[town]`. Y la ruta de ciudad (`Barcelona`)
necesita el `tier` del modelo de territorio (plan §1.1) antes de crearse.

### 3.2 Clústeres temáticos (hub-and-spoke)
- **Hub de servicio**: `/comprar/`, `/vender/`, `/alquilar/`, `/valoracion/` (pillar pages de
  intención). Ya existen. Deben enlazar hacia abajo a: páginas de pueblo + posts informacionales.
- **Hub geográfico**: `/inmobiliaria/<pueblo>/` como pillar local; spokes = `/venta/<pueblo>/`,
  `/alquiler/<pueblo>/`, fichas, y posts locales. Interlinkar pueblos vecinos (Malgrat↔Palafolls↔
  Santa Susanna↔Pineda↔Blanes↔Tordera↔Lloret) desde el modelo de territorio, no hardcodeado.
- **Hub informacional (blog)**: clúster "vender" (papeles, pasos, comisión, plazos, herencia,
  hipoteca), clúster "comprar extranjero" (NIE, poder notarial, cuenta), clúster "valorar/precio"
  (€/m² por pueblo). Cada post enlaza a su pillar de servicio y a la página de pueblo relevante.

### 3.3 Programmatic SEO — **solo con datos reales, nunca texto generado vacío**
El modelo `towns.ts` + plantillas `[town].astro` ya es la semilla programática. Regla (coherente
con `publishedSellerTowns`/`publishedCatalogTowns` y con la regla global del usuario): **una página
de territorio solo se publica cuando tiene un dato propio que la justifique**, no solo el nombre
interpolado. Datos que harían cada página única y citable (hay que conseguirlos de fuente real):
- **€/m² por pueblo** (compra y alquiler) — fuente: CRM propio de operaciones cerradas, o portal de
  datos públicos. Hoy no existe en el repo; sin él, no publicar el dato (plan §6, regla del usuario).
- **Nº de operaciones / tiempo medio de venta** por pueblo (del CRM).
- **Inventario real** (feed Habitatsoft, plan §1.4): nº de pisos, precio desde, tipologías. Esto es
  lo que convierte `venta/<pueblo>` de plantilla vacía en página con valor.
- Lo que NO sirve: repetir el mismo párrafo cambiando el topónimo (es lo que hoy se evita dejando
  `intro` vacío en Pineda/Santa Susanna/Palafolls/Calella — mantener ese criterio).

### 3.4 GEO / AEO (aparecer en IA)
- **Ya bien**: contenido en formato pregunta-respuesta (FAQ home, FAQ pueblo, posts), `FAQPage`
  schema, respuestas cortas y directas (fáciles de extraer y citar). La voz de pueblo con datos
  concretos ("107 reseñas", "Av. Mediterránea 16") es citable.
- **Añadir**:
  - `llms.txt` / `llms-full.txt` en `/public/` (índice legible por LLM de servicios, pueblos y FAQs).
  - **E-E-A-T real**: completar la bio de Boris (hoy `bioPending: true` con placeholders `[Pendiente]`),
    firmar los posts con autor, añadir fecha visible y "actualizado el". Los LLM y Google premian
    autoría verificable en YMYL (la compra de vivienda lo es).
  - Datos citables en el cuerpo (no solo en schema): comisión (hoy `feePercent: null` y la FAQ evita
    el número — bien, pero conseguir el % real y ponerlo gana la query "comisión inmobiliaria"),
    plazos, papeles (ya cubierto en blog), €/m².
  - `sameAs` y perfil consistente NAP (ver §4) para que la IA resuelva la entidad "Conroma".

---

## 4. Schema / datos estructurados recomendados

Sobre lo que ya hay en `seo.ts` (no rehacer, añadir):

1. **`RealEstateAgent` — ampliar** `agentSchema()`:
   - `sameAs`: los 2 Instagram + TikTok de `site.ts` (resuelve la entidad para Google/IA).
   - `openingHours`/`openingHoursSpecification`: horario real de la oficina (pedir dato).
   - `priceRange`: ej. `"€€"` (señal local estándar).
   - `geo`: lat/long reales (hoy `null`) → refuerza Maps/local pack. Dato pendiente en `site.ts`.
   - `image`/`logo`: ya está el logo; añadir foto real de la oficina/equipo para el panel.
   - **Mantener SIN `aggregateRating`** (decisión testada; reseñas vía UI→Maps, no autoservidas).
2. **`LocalBusiness`/`Organization` base** con `@id` compartido para que fichas, posts y breadcrumbs
   cuelguen de la misma entidad (ya se usa `/#agencia` como `@id` y `seller`/`author`/`publisher`
   referencian ahí — bien; solo falta enriquecer la entidad).
3. **`FAQPage`** — ya en home, pueblo y (potencial) servicio. Extender a `/comprar/`, `/vender/`,
   `/alquilar/` (ya tienen FAQ en el `.astro`, pero el `faqSchema()` solo se emite en home y pueblo;
   **verificar** que las páginas de servicio también pasen su FAQ a `schemas`). → quick win AEO.
4. **`RealEstateListing`** — correcto; al salir del `sampleData`, revisar que `price`, `floorSize`
   (`MTK`), `numberOfRooms` salgan del feed real. Añadir `image` reales cuando existan.
5. **`BreadcrumbList`** — correcto en listados/fichas. Falta en algunas páginas de servicio planas
   (comprar/vender/alquilar tienen crumbs en UI pero conviene emitir también el schema).
6. **`Place`/`AdministrativeArea`** por pueblo (opcional, fase territorio): vincular cada
   `inmobiliaria/<pueblo>` a la entidad del municipio para reforzar relevancia geográfica.
7. **`Service`** por servicio (comprar/vender/alquilar/valoración/reformas) con `areaServed` y
   `provider: {@id: /#agencia}` — ayuda a IA a mapear "qué hace Conroma".

---

## 5. Plan de contenido (resolver dudas reales = posicionar + ser citado por IA)

El blog ya tiene 3 posts en `draft` bien enfocados (pasos para vender, papeles en Cataluña, comprar
viviendo fuera). **Publicarlos** (quitar `draft`) es el primer paso: hoy no indexan. Luego, clústeres:

**Clúster Vender (pillar `/vender/`)**
- "¿Cuánto cobra una inmobiliaria por vender un piso?" → query "comisión inmobiliaria" (requiere el
  % real; si no se da, explicar el modelo sin cifra inventada).
- "¿Cuánto se tarda en vender un piso en el Maresme?" (plazos reales del CRM).
- "Vender un piso heredado en Cataluña: pasos e impuestos".
- "€/m² en Malgrat de Mar y alrededores: qué pide el mercado hoy" (dato real €/m²).

**Clúster Comprar (pillar `/comprar/`)**
- Post "comprar viviendo fuera" (ya redactado) + "NIE y cuenta para comprar en España".
- "Gastos de comprar una vivienda en Cataluña (ITP, notaría, registro)".
- "¿Me lo puedo permitir? Cómo calcular tu hipoteca" → enlaza al simulador existente.

**Clúster Local/Pueblo**
- "Vivir en Malgrat de Mar: barrios, servicios y precios" (apoya el hub geográfico).
- Guías equivalentes para Blanes/Tordera/Lloret conforme tengan datos.

**Reglas de redacción**: seguir `ESTANDAR.md §2` (voz de pueblo, romper simetría de titulares,
cifras con fuente). Cada post: respuesta directa en el primer párrafo (AEO), FAQPage al pie, autor
+ fecha, enlace a pillar de servicio y a pueblo. **Ningún dato numérico sin fuente real.**

---

## 6. Roadmap SEO por fases de negocio (priorizado)

**Fase 0 — Desbloqueo (ahora, sin esperar al feed)**
1. Publicar los 3 posts del blog (quitar `draft`) + firmar con autor y fecha. (bajo esfuerzo, alto efecto)
2. Completar bio real de Boris (`site.ts`, quitar `[Pendiente]`/`bioPending`) → E-E-A-T.
3. Ampliar `agentSchema()`: `sameAs`, `openingHours`, `priceRange`, `geo` real. (requiere datos reales de oficina)
4. Verificar que `/comprar/`, `/vender/`, `/alquilar/` emitan su `faqSchema()` (hoy la FAQ está en UI).
5. Añadir `llms.txt`.
6. Romper la simetría de los 9 H1 / eyebrows (deuda de `ESTANDAR.md §2`).

**Fase 1 — Local completo (al entrar feed real + €/m²)**
7. Quitar `sampleData` → desindexar deja de aplicar; indexar fichas y `venta/<pueblo>`.
8. Medir volúmenes `[M]` (NotFair `getKeywordIdeas`/Ads) de Pineda, Santa Susanna, Palafolls,
   Calella y de compra/alquiler/valorar en Blanes/Tordera/Lloret → decidir qué páginas crear.
9. Publicar páginas de pueblo con dato propio (€/m², inventario) para los que lo justifiquen.
10. Interlinking geográfico desde el modelo de territorio (no hardcode); clúster hub-spoke.
11. Crear `/alquiler/<pueblo>/` cuando haya inventario de alquiler.
12. Google Business Profile: NAP idéntico a `site.ts`, categorías, fotos, reseñas (señal local nº1).

**Fase 2 — Barcelona (ciudad)**
13. Modelo de territorio con `tier` (plan §1.1) → landing de ciudad que enlaza los pueblos del Maresme.

**Fase 3 — Cataluña/España + `/ca/`**
14. Activar `ca` en `publishedLocales` → hreflang es/ca automático; traducir núcleo (humano).
15. Hubs por comarca/costa.

**Fase 4 — Internacional `/en/` + `/fr/`**
16. Lloret y la compra extranjera primero (en/fr); hreflang 4 idiomas; vigilar errores en Search Console.

---

## 7. Lo que NO verifiqué / riesgos

- **Core Web Vitals / velocidad real**: no medido (requiere Lighthouse móvil tras deploy). Arquitectura favorable, pero sin número no afirmo.
- **Volúmenes `[M]`**: no pulidos — DataForSEO/Ads no conectados; no inventé cifras. Pull real pendiente de autorizar (NotFair).
- **€/m², comisión, plazos, horario, geo**: datos reales que el repo aún no tiene; sin fuente no se publican (regla del usuario).
