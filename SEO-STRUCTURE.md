# SEO-STRUCTURE — Conroma web

> Arquitectura SEO: jerarquía H1/H2/H3, metadatos, enlazado interno y datos estructurados por
> página. Refleja el estado tras los fixes de esta sesión (H1 corregidos, Service schema). Dominio
> de producción: `https://conromaasesores.com`. Fecha: 2026-11-15.

## 1. Metadatos globales (en `BaseLayout.astro` + `lib/seo.ts`)
- `title` por página (patrón `… | Conroma`), `description` única por página.
- `canonical` absoluto en todas; `hreflang` solo si hay ≥2 idiomas (hoy **ES-only** → no emite, correcto).
- `og:*` + Twitter card (`og:image` = `/img/og-conroma.jpg` 1200×630, override por página).
- `robots`: `public/robots.txt` (`Allow:/` + bots IA explícitos) + `noindex` por página cuando toca
  (`/estilo`, `/guardados`, catálogo si `!catalogIndexable`). `sitemap-index.xml` (excluye internas).
- **Schema site-wide:** `WebSite` (`#website`, publisher → `#agencia`) inyectado en cada página.

## 2. Jerarquía y target por página

| URL | Intención | Title | H1 (tras fix) | H2 principales | Schema propio |
|---|---|---|---|---|---|
| `/es/` | inmobiliaria Malgrat (marca/local) | Inmobiliaria en Malgrat de Mar \| Conroma | **Encuentra tu hogar en Malgrat de Mar** | servicios, contador, instagram, FAQ | RealEstateAgent, FAQPage |
| `/es/comprar/` | comprar piso Malgrat | Comprar piso en Malgrat de Mar | **Comprar piso o casa en Malgrat de Mar** | "Comprar en Malgrat", proceso, pisos | Breadcrumb |
| `/es/vender/` | vender piso Malgrat | Vender piso en Malgrat de Mar | **Vender tu piso en Malgrat de Mar** | proceso, FAQ | Breadcrumb, FAQPage, **Service** |
| `/es/alquilar/` | alquiler Malgrat | Alquilar piso en Malgrat de Mar | **Pisos en alquiler en Malgrat de Mar** | proceso, FAQ | Breadcrumb, FAQPage, **Service** |
| `/es/valoracion/` | valoración gratis | ¿Cuánto vale mi piso? Valoración gratis | **¿Cuánto vale tu piso? Valoración gratis…** (visually-hidden) | wizard | **Service** |
| `/es/comprar/puedo-comprar/` | ¿puedo comprar? (info) | ¿Puedo comprar un piso? Calcula tu presupuesto | **¿Puedo comprar un piso?** | calculadora | Breadcrumb |
| `/es/reformas/` | reformas Malgrat | Reformas en Malgrat de Mar: Conroma en Obras | **Reformas de pisos en Malgrat de Mar** | cómo lo hacemos, galería | Breadcrumb, **Service** |
| `/es/gestion-de-patrimonio/` | gestión patrimonio | Gestión de patrimonio inmobiliario en Malgrat de Mar | **Gestión de patrimonio inmobiliario** | qué hacemos | Breadcrumb, **Service** |
| `/es/servicios/` | servicios inmobiliaria | Servicios inmobiliarios en Malgrat de Mar | **Servicios inmobiliarios en Malgrat de Mar…** | lista de servicios | Breadcrumb |
| `/es/inmobiliaria/{pueblo}/` | inmobiliaria en {pueblo} (hub) | Inmobiliaria en {pueblo}: comprar y vender | **Inmobiliaria en {pueblo}** | Comprar en {pueblo}, Vender en {pueblo}, FAQ | Breadcrumb, FAQPage |
| `/es/venta/{pueblo}/` | pisos en venta {pueblo} (catálogo) | {heading} | **Pisos/Inmuebles en venta en {pueblo}** | listado, filtros | Breadcrumb, CollectionPage |
| `/es/venta/` | inmuebles en venta Maresme | Inmuebles en venta en el Maresme y La Selva | **Todo lo que tenemos en venta** | índice de municipios | Breadcrumb |
| `/es/inmueble/{slug}/` | ficha del piso | {título del piso} | **{título del piso}** | características, zona | Breadcrumb, listing (Offer) |
| `/es/empresa/` · `/es/equipo/` · `/es/contacto/` | marca/about | (keyword + marca) | frases de marca (about, aceptable) | — | Breadcrumb |
| `/es/blog/` · `/es/blog/{slug}/` | guías | Blog… / {título} | {título del post} | artículos | Breadcrumb, Article |

> Canibalización resuelta por intención: `/inmobiliaria/{pueblo}` = hub de agencia (comprar+vender);
> `/venta/{pueblo}` = catálogo de pisos. Keywords primarias distintas (ver `docs/KEYWORDS.md`).

## 3. Enlazado interno
- Silos por intención: comprar · vender · alquilar · servicios (reformas, patrimonio) · municipios.
- Migas (`BreadcrumbList`) en páginas internas. `TownLinks` enlaza los municipios publicados.
- Las fichas enlazan a su listado de municipio (o al listado general si el pueblo está fuera del
  índice). La home enlaza a los recorridos principales.

## 4. Datos estructurados (resumen)
| Schema | Dónde | Notas |
|---|---|---|
| `WebSite` | site-wide | entidad del sitio, publisher → `#agencia` |
| `RealEstateAgent` (`#agencia`) | home (+ contacto/empresa) | NAP, geo, horarios, areaServed, sameAs, hasMap |
| `BreadcrumbList` | páginas internas | migas |
| `FAQPage` | home, vender, alquilar, inmobiliaria/{pueblo}… | solo con FAQ visibles |
| `Service` | vender, alquilar, patrimonio, reformas, valoración | provider → `#agencia`, casa con lo visible |
| listing (`Offer`) | ficha de inmueble | precio/estado del piso |
| `Article` | posts de blog | — |

Todos los schema **coinciden con el contenido visible**; no se añade schema sin respaldo. `llms.txt`
existe como guía para crawlers de IA (utilidad, no factor de ranking confirmado).

## 5. Pendiente (del AUDIT-REPORT)
H1 "about" opcionales (empresa/equipo/contacto, tono libre) · validar JSON-LD en Rich Results ·
medir CWV en ficha/listado (A-03) · reforzar E-E-A-T con `Person`/autor cuando haya datos legales.
