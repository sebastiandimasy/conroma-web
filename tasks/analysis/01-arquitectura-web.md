# 01 — Arquitectura web de Conroma (diagnóstico para escalar)

> Análisis, no cambios. No se ha tocado código de la app. Norma vinculante: `ESTANDAR.md`.
> Fecha: 2026-10-20. Fuente: lectura directa del repo `/Users/sebastian/conroma-web`.

Stack real confirmado: Astro 7 (salida estática) + islas React 19 + Tailwind 4 + GSAP/Motion +
adaptador Cloudflare (`astro.config.mjs`). Locale único `/es/`. 8 pisos de muestra
(`src/data/properties.sample.json`), `site.sampleData = true` → todo el catálogo sale `noindex`.

---

## 1. Diagnóstico de la arquitectura actual

### Fortalezas (buena base, no rehacer)
- **Separación datos / vista limpia.** `src/data/` (site, towns, properties, services, steps, faq,
  testimonials, nav, blog) alimenta páginas y componentes; casi nada está hardcodeado en las vistas.
- **Capa SEO centralizada y testeada.** `src/lib/seo.ts` concentra canonical, hreflang, y schemas
  (`RealEstateAgent`, `BreadcrumbList`, `FAQPage`, `RealEstateListing`, `BlogPosting`) con `@id`
  compartido (`#agencia`). Hay tests (`tests/seo.test.ts`) que ya blindan invariantes útiles:
  no declarar alternates si <2 locales, no auto-declararse rating en el schema, breadcrumbs desde 1.
- **Tokens de color maduros.** `src/styles/tokens.css` ya implementa la regla de `ESTANDAR §0`:
  9 pares fondo/texto (`--color-*` + `--color-on-*`), familia fija `--color-fixed-*` para fotos,
  modo oscuro por `[data-theme]` y por `prefers-color-scheme`, y mapeo de la paleta HeroUI
  (`--accent`, `--default`, `--background`, `--danger`) a tokens Conroma.
- **Honestidad de datos ya codificada.** `agentSchema()` NO inventa `aggregateRating` (test lo
  fuerza); `site.sampleData` pone `noindex` en fichas/listados y muestra aviso "web en construcción".
- **Rutas dinámicas ya existentes:** `venta/[town]`, `inmobiliaria/[town]`, `inmueble/[slug]`,
  `blog/[slug]`, generadas con `getStaticPaths()` desde los datos. El patrón programático ya está.
- **Medición por Click URL preparada.** `data-contact` / `data-origin` en los CTA y `whatsappUrl()`
  / `phoneUrl()` en `src/lib/links.ts` → encaja con la convención HHB (medir por wa.me/tel:, no texto).

### Deudas para escalar (lo que frena el crecimiento por fases)
1. **`src/lib/locales` NO existe.** El plan (`tasks/plan.md §2`, §1.3) y el brief lo dan por hecho,
   pero las constantes `locales` / `publishedLocales` viven inline en `src/lib/seo.ts:7-9`. El
   andamiaje i18n del que habla la Fase 1.3 todavía no está como módulo.
2. **Datos leídos directamente, sin costura CRM.** Las páginas importan `properties` y
   `propertiesIn()` directo desde `src/data/properties.ts` (ej. `index.astro:18`,
   `venta/[town].astro:7`, `inmueble/[slug].astro:9`). No hay interfaz `getListings/getListing`
   (Fase 1.4). El día que entre el feed de Habitatsoft hay que tocar cada página.
3. **Modelo de territorio plano.** `Town` (`src/data/towns.ts`) no tiene `tier` ni `parent`:
   todo cuelga de Malgrat. No soporta la jerarquía local→comarca→provincia→ccaa→país del plan §1.1.
4. **No hay primitivas de UI.** Botones, secciones y tarjetas son clases BEM sueltas
   (`.button--primary/ghost/ink/large/small` en `components.css:287+`; patrón `<section class="section"><div class="wrap">`
   repetido a mano en cada página). 4.080 líneas de CSS en 7 ficheros, sin componentes Astro
   reutilizables (`Section`, `Button`, `MediaCard` del plan §0.2-0.4 no existen todavía).
5. **CSS inline total en cada página.** `astro.config.mjs:18` fuerza `inlineStylesheets: 'always'`.
   Con 4.080 líneas de CSS global, cada HTML embebe el bundle entero. Bien para primera pintura con
   poco CSS; a escala de miles de páginas es peso repetido y no cacheable entre páginas.
6. **Contenido pendiente / incoherencias de marca ya listadas en `ESTANDAR`.** Bio del CEO con
   placeholders `[Pendiente: ...]` (`site.ts:86-90`), y la cifra prohibida **"+500 clientes
   satisfechos"** sigue viva en `index.astro:81` (el propio `ESTANDAR §2` la marca como dato falso;
   el real es 107 reseñas). `site.about[0]` repite el cierre aspiracional "la vivienda que siempre
   has deseado" que `ESTANDAR §2` manda cortar.

---

## 2. Design system: qué falta para que sea reutilizable y escalable

La **esencia** ya está en tokens; falta **envolverla en primitivas** y cerrar huecos de escala.

### Tokens que faltan o conviene formalizar
- **Escala de espaciado por pasos.** Hoy solo hay `--space-gutter` y `--space-section`
  (`tokens.css:63-64`). Falta `--space-1..12` sobre base 4px (plan §0.1). Los paddings intermedios
  de las secciones salen de valores ad hoc en los CSS, no de tokens.
- **Movimiento: completo pero no único.** Están `--ease-out`, `--ease-in-out`, `--duration-fast/base/slow`.
  Bien. Falta documentar que `:hover` no lleva `transform` (ya se cumple: **0 ocurrencias** de
  `transform` en reglas `:hover`, verificado) y centralizar los `0.6/0.7s` hardcodeados de GSAP en
  `src/lib/motion.ts` (hoy literales, no tokens; a 300ms+ reñido con `ESTANDAR §1`).
- **Hex literales fuera de tokens: 21** (prohibido por `ESTANDAR §0`). Reparto real:
  `sections.css` (18), `property.css` (3), más 4 en el array `avatars` de `index.astro:28-31`
  (`#f0e2bd`, `#2b2a26`, `#f4ce4b`, `#d9d5c9`) y las máscaras `#000` de `FamilyShowcase.astro` /
  `ServicesFeature.astro` (éstas últimas son `mask-image`, uso legítimo pero conviene tokenizar).

### Primitivas a extraer (orden por reutilización)
1. **`Button.astro`** — unifica `.button--*` con props `variant` (`primary|ghost|ink`) y `size`
   (`large|small`), radio 10px, hover a amarillo+texto negro sin transform, `scale(0.97)` solo en
   `:active`, mínimo táctil 44×44px. Es la primitiva más repetida del sitio.
2. **`Section.astro`** — reemplaza el patrón manual `<section class="section"><div class="wrap">` +
   cabecera (`eyebrow` + `h2` + `lead`) + variante de fondo (canvas/surface). Visto literalmente en
   `index.astro`, `inmobiliaria/[town].astro`, `venta/[town].astro`, etc.
3. **`MediaCard.astro`** — tarjeta foto-a-sangre + cuerpo, hoy ad hoc en `PropertyCard` y las cards
   de audiencia/alquiler. Slots: imagen, overlay de precio/zona, cuerpo.
4. **Guía viva `/es/estilo/` (`noindex`)** — prueba única de paleta (9 pares con ratio), tipografía,
   radios/sombras y cada primitiva en sus estados. Sirve de regresión visual al refactorizar.

### Cómo mejorar sin cambiar la marca
- Mantener amarillo/negro/gris/blanco y las tres fuentes. La mejora es **sistematizar**, no
  resustituir: todo valor de color/espaciado/duración de componentes nuevos debe salir de token.
- Vigilar la **simetría de plantilla** que `ESTANDAR §2` ya cuantificó (9 H1 iguales, 11 eyebrows en
  pregunta, 4 FAQ clónicos "X: lo que nos preguntan" — este patrón se ve literal en
  `inmobiliaria/[town].astro:117` y `venta/[town].astro`). A escala programática el riesgo se
  multiplica: ver §5.

---

## 3. Modelo de datos geo/locale escalable

### 3.1 Territorios por niveles (evolución de `src/data/towns.ts`)
Hoy `Town` es plano: `{ slug, name, hasCatalog, intro, sellerIntro, buyerIntro? }`. Propuesta de
registro jerárquico (aditivo, no rompe lo existente):

```ts
interface Place {
  slug: string;
  name: string;
  tier: 'local' | 'comarca' | 'provincia' | 'ccaa' | 'pais';
  parent: string | null;      // slug del contenedor (Malgrat → alt-maresme → barcelona → cataluna → es)
  hasCatalog: boolean;
  content?: { intro?: string; sellerIntro?: string; buyerIntro?: string }; // textos solo donde hay dato real
}
```
Malgrat y los pueblos quedan `tier: 'local'`, `parent: 'alt-maresme'`. Crecer = añadir filas, no
reescribir páginas. `publishedSellerTowns` / `publishedCatalogTowns` siguen siendo derivados por
filtro (ya es el patrón actual). `areaServed` de `agentSchema()` (`seo.ts:51`) debería derivarse de
este registro en vez de ser un array literal, para que no se desincronice al añadir territorios.

### 3.2 Taxonomía de URL (fijar antes de escalar)
Rutas actuales reales: `/es/venta/[town]/`, `/es/inmobiliaria/[town]/`, `/es/inmueble/[slug]/`.
Patrón recomendado estable y escalable:
- Listados: `/<locale>/<operación>/<territorio>/` → ya encaja `venta/[town]`. **Hueco:** no existe
  `alquiler/[town]` (hoy solo `/es/alquilar/` genérica) ni nivel ciudad (Barcelona).
- Captación: `/<locale>/inmobiliaria/<territorio>/` → ya existe.
- Ficha: `/<locale>/inmueble/<slug>/`. El slug (`properties.ts:31`) mezcla `tipo-zona-town-ref`; es
  estable pero conviene congelar el formato antes de indexar (cambiarlo luego = redirecciones masivas).
- Si algún día se filtra por tipo, reservar `/<locale>/<operación>/<territorio>/<tipo>/` para no
  colisionar. Decidir ahora si el tipo es segmento o query (`?tipo=`); mezclar ambos canibaliza.

### 3.3 hreflang / locale
`alternates()` (`seo.ts:24-31`) está bien pensada pero **devuelve `[]` si hay <2 locales
publicados** (test lo fija) → hoy, con `publishedLocales = ['es']`, no se emite hreflang, que es
correcto. Para activar `/ca/`, `/en/`, `/fr/` sin reescritura:
- Extraer `locales`/`publishedLocales` a `src/lib/locales.ts` (el módulo que el plan supone y **no
  existe**), y hacer que cada página declare su mapa de traducciones por ruta.
- `BaseLayout.astro` ya pinta `languageLinks` y `<html lang="es">` fijo → parametrizar `lang` por
  locale cuando se publique el segundo idioma. `og:locale` también está hardcodeado `es_ES`.
- Mantener canonical por ruta + `x-default` (ya lo hace `alternates` cuando hay ≥2).

### 3.4 Costura para el feed CRM (Habitatsoft)
Hoy no hay seam: 5+ ficheros importan `properties`/`propertiesIn` directo. Introducir una interfaz
única en `src/data/properties.ts` — `getListings(filter)`, `getListing(slug)`, `getSimilar()` — que
hoy lea el sample JSON y mañana el feed, **sin tocar componentes ni páginas**. Las islas
(`PropertyGrid`, `ListingExplorer`, `PropertyGallery`) deben consumir esa interfaz, no el JSON.
Es la pieza que desbloquea pasar de 8 muestras a inventario real sin reescribir.

---

## 4. Rendimiento y accesibilidad

### Rendimiento / CWV
- **Hidratación.** Islas con `client:load` (coste en TBT/INP): `ListingExplorer`
  (`venta/[town]`), `PropertyGallery` + `FavoriteToggle` (`inmueble/[slug]`), `SearchForm`
  (`comprar`). Las rejillas usan `client:visible` (bien) y chat/cookies `client:idle` (bien).
  Oportunidad: `FavoriteToggle` y la galería podrían bajar a `client:visible`/`idle` salvo el control
  que esté sobre el pliegue. `ListingExplorer` es la interacción principal del listado → `client:load`
  defendible, pero conviene medir su JS.
- **CSS inline en cada página** (`inlineStylesheets: 'always'`, `astro.config.mjs:18`): con 4.080
  líneas globales, el HTML de cada página carga el bundle completo, sin cache entre navegaciones.
  A escala de miles de páginas revisar si conviene `'auto'` + hoja cacheable, o dividir CSS por ruta.
- **Imágenes.** El equipo usa `astro:assets` (`ImageMetadata` en `site.ts`), bien. Pero las fotos de
  piso (`public/img/pisos/M-100x/*.jpg`) son estáticas en `public/` → no pasan por optimización de
  Astro (no hay `srcset`/AVIF/WebP automáticos ni `width/height` garantizados). A escala es el mayor
  riesgo de LCP/CLS. Con feed CRM, definir pipeline de imágenes remotas (Cloudflare Images encaja).
- **GSAP + Motion + HeroUI + React 19** es un payload JS notable para un sitio mayormente estático.
  `HeroGradient` (`client:visible`) es decorativo; validar que no bloquea LCP del hero.
- Positivo: motion bajo `matchMedia('(prefers-color-scheme...no-preference)')` y `prefers-reduced-motion`
  respetado en `src/lib/motion.ts:57`.

### Accesibilidad
- Buenas señales: `skip-link` a `#contenido`, `aria-label`/`aria-hidden` en social-proof y auroras,
  objetivos 44px y "sin scroll horizontal a 390px" como regla de cierre en `ESTANDAR §1`.
- Verificar foco visible en las primitivas nuevas y contraste de chips sobre foto (familia
  `--color-fixed-*` existe para eso). `ESTANDAR` ya exige ≥4,5:1 en ambos temas (medido, no estimado).

---

## 5. Riesgos técnicos de escalar a miles de páginas (programmatic SEO)

1. **Thin content / contenido duplicado.** Varios pueblos tienen `intro`/`sellerIntro` **vacíos**
   (Pineda, Santa Susanna, Palafolls, Calella en `towns.ts:40-43`). Generar páginas de territorio con
   plantilla idéntica y sin dato local real = thin content y canibalización. Mitigación: publicar solo
   territorios con contenido propio real (el repo ya lo hace vía `publishedSellerTowns` filtrando por
   `sellerIntro !== ''`) y exigir dato local (€/m², ventas) antes de indexar — regla global del usuario:
   sin fuente, no se publica el dato (NotFair `getKeywordIdeas` / fuentes reales, no inventados).
2. **Simetría de plantilla detectable** (`ESTANDAR §2`, ya cuantificada). A escala multiplica el patrón
   "cláusula + coma + remate" y "eyebrow en pregunta". Mitigación: variar H1/eyebrow por territorio
   (romper 1 de cada 3) y no derivar todo el copy de la misma función.
3. **Explosión de combinaciones URL** (operación × territorio × tipo × locale). Sin taxonomía fijada
   (§3.2) se generan rutas colisionando o huérfanas. Mitigar fijando el patrón **antes** de abrir tipos.
4. **Sitemap y noindex.** Hoy `astro.config.mjs` excluye del sitemap drafts, privacidad y, con
   `sampleData`, `/es/inmueble/` y `/es/venta/`. Al escalar hay que automatizar qué entra al sitemap
   por `hasCatalog`/tier, o se publican miles de páginas sin señal o con señales contradictorias.
5. **Imágenes de catálogo sin pipeline** (§4): miles de fotos en `public/` sin optimizar hunden CWV.
6. **CSS inline por página** (§4): peso repetido × miles de páginas.
7. **hreflang a 4 idiomas × miles de URLs**: sin el módulo `locales` y mapa de traducción por ruta,
   los `alternate` se desincronizan. Automatizar la generación, no mantenerla a mano.

---

## 6. Recomendaciones priorizadas (accionables sobre ESTE repo)

### Alto impacto
- **A1. Costura CRM (`getListings/getListing`).** Interfaz en `src/data/properties.ts`; migrar
  `index.astro`, `venta/[town].astro`, `inmueble/[slug].astro`, `comprar/index.astro` y las islas a
  consumirla. Desbloquea Habitatsoft sin reescribir. (Plan §1.4.)
- **A2. Modelo de territorio con `tier`/`parent`** en `src/data/towns.ts`, y derivar `areaServed` de
  `seo.ts:51` de ese registro. Es el cimiento de la Fase 4 (Barcelona → Cataluña → internacional).
- **A3. Primitiva `Button.astro`** a partir de `.button--*` (`components.css:287+`): la más repetida,
  máximo retorno en coherencia y en cumplir `ESTANDAR §1` (hover sin transform, 44px) de una vez.
- **A4. Pipeline de imágenes de piso.** Sacar las fotos de `public/img/pisos/` hacia `astro:assets`
  o Cloudflare Images con `width/height`, AVIF/WebP y `srcset`. Mayor palanca de LCP/CLS a escala.

### Medio impacto
- **M1. Módulo `src/lib/locales.ts`** (extraer de `seo.ts`), parametrizar `lang`/`og:locale` en
  `BaseLayout.astro` y mapa de traducción por ruta. Deja listo `/ca//en//fr/` sin reescritura. (§1.3.)
- **M2. Primitivas `Section.astro` y `MediaCard.astro`** + guía viva `/es/estilo/` (`noindex`) como
  regresión visual. (Plan §0.2-0.5.)
- **M3. Tokens de espaciado `--space-1..12`** en `tokens.css` y mover a token los 21 hex fuera de
  `tokens.css` (18 en `sections.css`, 3 en `property.css`) y los 4 de `index.astro:28-31`.
- **M4. Cerrar `alquiler/[town]`** y decidir la plantilla de ciudad (Barcelona) con la taxonomía §3.2.

### Bajo impacto (rápidas / higiene)
- **B1. Quitar "+500 clientes satisfechos"** (`index.astro:81`) → "107 reseñas" real; y suavizar
  `site.about[0]` (cierre aspiracional que `ESTANDAR §2` manda cortar). Rellenar bio CEO
  (`site.ts:86-90`) o dejar la sección oculta mientras `bioPending`.
- **B2. Revisar `client:load` → `client:visible`/`idle`** en `FavoriteToggle`/`PropertyGallery`
  según pliegue; medir JS de `ListingExplorer`.
- **B3. Evaluar `inlineStylesheets: 'auto'`** (`astro.config.mjs:18`) midiendo CWV antes/después.
- **B4. Tokenizar las máscaras `#000`** de `FamilyShowcase.astro` / `ServicesFeature.astro`.

---

### Nota de método
Datos del repo leídos directamente (no estimados): 4.080 líneas CSS en 7 ficheros; 21 hex fuera de
tokens; 0 `transform` en `:hover`; 8 pisos de muestra; `src/lib/locales` inexistente;
`inlineStylesheets: 'always'`. Lo no verificado: no se ha corrido `npm run build` ni Lighthouse real
(este informe es de arquitectura estática), ni se ha abierto el navegador a 390px.
