# Plan Conroma — Design System escalable + arquitectura geográfica + auditoría por wireframes

> Estado: **BORRADOR para revisión humana**. No se ha tocado código de la app al redactarlo.
> Documento vivo. La norma vinculante de marca es `ESTANDAR.md` (color, forma, movimiento, voz).
> El concepto de producto es `conroma-prototipo/docs/superpowers/specs/2026-10-12-conroma-web-concepto3-design.md`.

## 1. Objetivo

Tres entregas que se apoyan una en otra:

1. **Design system escalable** extraído del prototipo actual, documentado y aplicable a cualquier
   elemento sin reinventar CSS cada vez.
2. **Arquitectura interna escalable** que crezca por fases de negocio sin reescrituras:
   **local (Malgrat + Alt Maresme) → Barcelona → Cataluña / España → internacional**.
3. **Auditoría de conversión sección por sección** mediante wireframes de baja fidelidad, con
   criterio de éxito medible por página.

Lo que NO es este plan: un rediseño visual desde cero. La marca (amarillo, negro, gris, blanco;
Hanken Grotesk, Playfair, Pacifico) y la voz de pueblo se conservan. Se extrae su esencia y se
sistematiza; no se sustituye.

## 2. Punto de partida (lo que ya existe)

- **Tokens**: `src/styles/tokens.css` ya tiene pares fondo/texto (`--color-*` + `--color-on-*`),
  pares fijos (`--color-fixed-*`), escala de radios, sombras y mapeo a HeroUI. Es la semilla del
  design system; falta formalizar escala de espaciado y de movimiento, e inventario de componentes.
- **Páginas**: home, comprar, vender, alquilar, valoración, gestión-de-patrimonio, reformas,
  empresa, equipo, contacto, blog, guardados, privacidad + plantillas `venta/[town]`,
  `inmobiliaria/[town]`, `inmueble/[slug]`, `blog/[slug]`.
- **Datos**: `src/data/` (site, towns×10, properties.sample, services, steps, faq, testimonials,
  nav, blog). Geo hoy anclado a Malgrat.
- **Islas React**: PropertyGrid/Card/Gallery, ValuationWizard, simuladores, ChatDemo, StoryVideos…
- **Stack**: Astro (estático) + islas React + Tailwind 4 + GSAP/Motion + Cloudflare. Locale único
  `/es/`; `publishedLocales` ya contempla varios idiomas en `src/lib/locales`.

## 3. Grafo de dependencias

```
                 ┌─────────────────────────────┐
                 │  FASE 0  Design System       │  (visual)
                 │  tokens → primitivas → guía  │
                 └───────────────┬──────────────┘
                                 │ bloquea
            ┌────────────────────┴───────────────────┐
            ▼                                         ▼
 ┌───────────────────────┐              ┌──────────────────────────┐
 │ FASE 2  Wireframes +  │   informa    │ FASE 3  Aplicar el DS a  │
 │ auditoría conversión  │─────────────▶│ cada sección (refactor)  │
 └───────────┬───────────┘              └──────────────────────────┘
             │
             │           ┌─────────────────────────────┐
             │           │  FASE 1  Modelo geo/locale   │  (datos)
             │           │  escalable + taxonomía URL   │
             │           └───────────────┬──────────────┘
             │                           │ bloquea
             └──────────────┐            ▼
                            ▼  ┌──────────────────────────┐
                               │ FASE 4  Escalado por     │
                               │ fases de negocio         │
                               └──────────────────────────┘
```

- **FASE 0** (design system) y **FASE 1** (modelo geo) son independientes: se pueden hacer en paralelo.
- **FASE 0** bloquea **FASE 3** (no se puede aplicar lo que no está definido).
- **FASE 1** bloquea **FASE 4** (no se escala sin el modelo).
- **FASE 2** (wireframes) solo necesita leer; informa a 3 y 4. Puede empezar ya.

## 4. Rebanado vertical

Cada tarea entrega **un camino completo**, no una capa horizontal. Ejemplo del principio aplicado:
la primitiva `Button` no es "escribir el componente" sino **token → componente Astro → aplicado en
un sitio real → entrada en la guía de estilo → verificado a 390px y contraste**. Así cada tarea es
desplegable y revisable sola.

---

## FASE 0 — Design System escalable (extraer la esencia y optimizarla)

Meta: una fuente única de verdad visual, documentada en una **guía de estilo navegable** (`/es/estilo/`,
`noindex`) que sirva de prueba viva. Cada primitiva se aplica al menos en una página real.

### 0.1 Formalizar los tokens que faltan
- **Entregable**: añadir a `tokens.css` escala de espaciado (`--space-1..12` sobre base 4px) y
  tokens de movimiento (`--ease-out`, `--duration-fast/base/slow`) si no están completos; documentar
  los pares de color ya existentes.
- **Aceptación**: todo valor de espaciado/duración usado en componentes nuevos sale de un token.
  Cero hex literal fuera de la definición de tokens (regla de `ESTANDAR.md §0`).
- **Verificación**: `grep` de hex `#` en `src/styles/*.css` fuera de `tokens.css` = 0 nuevos;
  `npm run build` pasa.

### 0.2 Primitiva `Section` (envoltura de sección)
- **Entregable**: componente Astro `Section.astro` que estandariza `padding` vertical, `wrap`,
  cabecera opcional (eyebrow + h2 + lead) y variante de fondo (canvas/surface). Reemplaza el patrón
  `<section class="section"><div class="wrap">…` repetido hoy a mano.
- **Aceptación**: una sección de la home migrada a `Section` se ve idéntica (diff visual nulo).
- **Verificación**: captura a 390px y 1280px antes/después iguales; `build` pasa.

### 0.3 Primitiva `Button` / enlace de acción
- **Entregable**: unificar los botones (`button button--primary/ghost/ink/large/small`) en un único
  componente con props `variant` y `size`, respetando radio 10px, hover a amarillo con texto negro
  (sin `transform`), y `scale(0.97)` solo en `:active` (`ESTANDAR.md §1`).
- **Aceptación**: los tres CTAs principales (valorar, WhatsApp, ghost) salen del componente y
  cumplen 44×44px táctil.
- **Verificación**: contraste ≥4,5:1 en claro y oscuro; cero `transform` en `:hover`.

### 0.4 Primitiva `MediaCard` (tarjeta con imagen)
- **Entregable**: tarjeta con foto a sangre arriba + cuerpo, que ya se usa ad hoc en `audience__card`
  y `property-card`. Una sola definición con slots (imagen, overlay opcional de precio/zona, cuerpo).
- **Aceptación**: `PropertyCard` y las cards de alquiler se expresan con la misma primitiva.
- **Verificación**: ambas páginas intactas visualmente; imágenes reales cargan (200).

### 0.5 Guía de estilo viva `/es/estilo/`
- **Entregable**: página `noindex` que muestra paleta (pares fondo/texto con ratio), tipografía,
  radios/sombras, y cada primitiva en sus variantes y estados (reposo/hover/activo/foco/disabled).
- **Aceptación**: abre sin errores, enseña los 9 pares de color y las primitivas 0.2–0.4.
- **Verificación**: `build` pasa; `noindex` presente; revisada a 390px sin scroll horizontal.

**▶ CHECKPOINT A** — Revisión humana del design system antes de refactorizar el sitio con él.

---

## FASE 1 — Arquitectura interna escalable (modelo geo/locale)

Meta: que crecer de pueblo a ciudad, comunidad o país sea **añadir datos**, no reescribir páginas.

### 1.1 Modelo de territorio con niveles
- **Entregable**: extender `src/data/towns.ts` a un registro de territorios con `tier`
  (`local | comarca | provincia | ccaa | pais`), `parent`, `slug`, `name`, `hasCatalog`, textos.
  Malgrat y el Alt Maresme quedan `tier: local`.
- **Aceptación**: el tipo `Town`/`Place` soporta jerarquía; las páginas actuales siguen funcionando.
- **Verificación**: `build` + tests (`npm test`) pasan sin cambios de ruta existentes.

### 1.2 Taxonomía de URL estable y escalable
- **Entregable**: documentar y fijar el patrón de rutas: `/<locale>/<operación>/<territorio>/[tipo]/`
  para listados y `/<locale>/inmueble/<slug>/` para fichas, con `inmobiliaria/<territorio>` como
  landing de captación. Confirmar que `venta/[town]` e `inmobiliaria/[town]` ya encajan y nombrar el
  hueco de `alquiler/[town]` y de ciudad (Barcelona).
- **Aceptación**: una ruta nueva de territorio se genera solo con añadir el dato (probado con un
  territorio ficticio en local, luego revertido).
- **Verificación**: sitemap incluye la ruta nueva; `build` pasa.

### 1.3 Semilla de localización (hreflang-ready)
- **Entregable**: dejar listo el andamiaje de `src/lib/locales` + `seo.ts` para publicar `/ca/`,
  `/en/`, `/fr/` sin reescribir (hoy `publishedLocales` ya existe). NO se traduce contenido todavía;
  solo se verifica que el hreflang y el canonical se emitirían bien.
- **Aceptación**: activar un locale de prueba genera `hreflang` coherente; se revierte.
- **Verificación**: `tests/seo.test.ts` cubre el caso o se amplía; `build` pasa.

### 1.4 Costura de inventario real (feed CRM)
- **Entregable**: aislar `src/data/properties.ts` tras una interfaz única (`getListings`,
  `getListing`) para que el día de mañana el feed de Habitatsoft sustituya el JSON de muestra sin
  tocar componentes. Hoy sigue leyendo el sample.
- **Aceptación**: PropertyGrid/Gallery consumen la interfaz, no el JSON directo.
- **Verificación**: `build` + tests pasan; la home y las fichas muestran lo mismo.

**▶ CHECKPOINT B** — Revisión humana del modelo de datos antes de escalar territorios.

---

## FASE 2 — Auditoría de conversión sección por sección (wireframes)

Meta: verificar que **cada página tiene un trabajo de conversión claro** y lo cumple. Entrega
documental (no cambia código): un wireframe de baja fidelidad por página + criterio de éxito.

Para cada página (Home, Comprar, Vender, Alquilar, Valoración, Listado, Ficha, Pueblo):

- **Entregable**: en `tasks/wireframes/<pagina>.md`, un esquema ASCII sección a sección que anote
  para cada sección: su **trabajo** (informar / dar confianza / convertir), el **CTA** y su destino
  de embudo, y la **medición** (Click URL `wa.me`/`tel:`).
- **Criterio de éxito por página** (checklist):
  - Un único CTA primario por pantalla (`ESTANDAR`/no-slop).
  - Coherencia de embudo: comprar→comprar, vender→vender, alquilar→alquilar (inquilino vs propietario),
    valorar→valoración.
  - Contenido rastreable con intención local (H1/H2 con Malgrat/Maresme/pueblos).
  - Móvil 390px sin scroll horizontal; objetivos táctiles 44px.
  - Jerarquía visual: el embudo primario domina el pliegue.
- **Verificación**: contrastar el wireframe con la página construida y listar desajustes como
  tareas de la Fase 3.

**▶ CHECKPOINT C** — Revisión humana de los wireframes y la lista de desajustes antes de refactorizar.

---

## FASE 3 — Aplicar el design system a cada sección (refactor guiado por Fase 2)

Meta: migrar las secciones reales a las primitivas de la Fase 0 y corregir los desajustes de la
Fase 2. Una tarea vertical **por página**, no por componente.

- **Entregable por página**: secciones expresadas con `Section`/`Button`/`MediaCard`; CSS ad hoc
  sustituido por tokens; copy que rompe la simetría de plantilla señalada en `ESTANDAR.md §2`
  (9 H1 iguales, 11 eyebrows en pregunta, 4 FAQ clónicos → romper 1 de cada 3).
- **Aceptación por página**: cumple el checklist de éxito de la Fase 2; sin regresión visual no
  intencionada.
- **Verificación**: `build` + tests; revisión a 390px; detector de diseño (`impeccable detect`) limpio.

Orden sugerido (por impacto de conversión): Home → Valoración → Comprar → Vender → Alquilar →
Ficha → Listado → Pueblo.

**▶ CHECKPOINT D** — Revisión humana tras Home + Valoración antes de seguir con el resto.

---

## FASE 4 — Escalado por fases de negocio

Cada fase es una rebanada vertical que **reutiliza** la plantilla de territorio de la Fase 1.

### 4.1 Local (Alt Maresme) — completar
- Páginas de pueblo con **datos locales reales** (precio €/m², ventas recientes) en vez de texto
  genérico, para Malgrat, Palafolls, Santa Susanna, Pineda, Blanes, Tordera, Lloret, Calella.
- **Éxito**: cada pueblo resuelve la intención "inmobiliaria en <pueblo>" con contenido propio.

### 4.2 Barcelona (ciudad)
- Landing de ciudad que enlaza los pueblos del Maresme; taxonomía `tier: provincia/ciudad`.
- **Éxito**: la ciudad se añade como dato y genera su página + sitemap sin tocar componentes.

### 4.3 Cataluña / España
- Hub por comunidad y páginas de costa; empieza el `/ca/` real (contenido catalán).
- **Éxito**: hreflang `es`/`ca` correcto; sin contenido duplicado sin canonical.

### 4.4 Internacional
- `/en/` y `/fr/` con contenido traducido de las páginas núcleo; hreflang de 4 idiomas.
- **Éxito**: Search Console sin errores de hreflang; páginas núcleo indexables por idioma.

**▶ CHECKPOINT E** — Revisión humana al cierre de cada subfase de negocio (son hitos comerciales).

---

## 5. Definición de "hecho" (global, de `ESTANDAR.md §3`)

1. `npm run build` pasa. 2. Ningún par fondo/texto <4,5:1 en ambos temas. 3. Cero `transform` en
`:hover`. 4. Ningún texto <13px. 5. Revisado a 390px sin scroll horizontal. 6. Ningún hex fuera de
tokens. 7. Titulares nuevos no repiten la forma del de al lado. 8. `npm test` verde.

## 6. Riesgos

- **Regresión visual al refactorizar** a primitivas: mitigar con captura antes/después por sección.
- **Datos inventados**: los €/m² y ventas recientes deben ser reales (CRM/fuentes), no estimados
  (regla global del usuario). Sin fuente, no se publica el dato.
- **Feed CRM no disponible aún**: la costura 1.4 permite seguir con sample sin bloquear.
- **Coste de traducción**: Fase 4.3–4.4 depende de contenido humano real por idioma.

## 7. Qué necesito del humano para arrancar

- Confirmar el orden de fases (¿design system primero, o auditoría de wireframes primero?).
- ¿Hay acceso al feed de Habitatsoft para la costura 1.4, o seguimos con sample por ahora?
- Fuente de datos reales de precio €/m² por pueblo para la Fase 4.1.
