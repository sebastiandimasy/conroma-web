# Animaciones con GSAP en toda la web — diseño

**Fecha:** 23-nov-2026 · **Rama:** `feat/crm-leads` · **Estado:** aprobado por el dueño el 23-nov-2026
**Alcance:** solo animaciones. El panel para editar textos va en un documento aparte.

---

## 1. Qué se quiere y por qué

El dueño quiere una web **totalmente dinámica y fluida**, no una página quieta:

- **Cada componente** tiene animación de **entrada** al aparecer en pantalla y de **salida** al
  irse con el scroll. Si se vuelve a subir, vuelve a entrar.
- **Tablas, carruseles, galerías, slides y bloques que se despliegan** reaccionan **al pasar el
  ratón en ordenador** y **al tocarlos en el móvil**.

Esto **sustituye la regla anterior** de `ESTANDAR.md` («sin JS para el movimiento salvo el
revelado del cierre», duraciones de 100–250 ms, cero `transform` en hover, cifras estáticas).
Decisión del dueño, 23-nov-2026.

## 2. Objetivos, no objetivos y antiobjetivos

**Objetivos**
- Toda sección con entrada y salida, coherente en toda la web (mismo vocabulario de movimiento).
- Respuesta al hover (ordenador) y al toque (móvil) en galerías, carruseles, tablas/filas,
  slides y desplegables.
- Igual en todos los móviles, iPhone con iOS < 26 incluidos (hoy las animaciones de scroll en
  CSS, `animation-timeline: view()`, no se ven allí).

**No objetivos**
- Transiciones entre páginas (la «salida» es al salir de pantalla con el scroll, no al navegar).
- Reescribir en GSAP las islas de React que ya animan cambios de estado con `motion`
  (`ValuationWizard`, `FilterSheet`, `ThemeSwitch`, `TestimonialCarousel`,
  `AffordabilitySimulator`): se quedan como están.
- Cambiar textos, colores, maquetación o componentes.

**Antiobjetivos (sería un fracaso aunque «funcione»)**
- Que algún contenido dependa de la animación para verse: si el JS falla, todo debe verse y
  Google debe leerlo entero.
- Empeorar el LCP, provocar saltos de maquetación (CLS) o hacer que el scroll vaya a tirones en
  un móvil de gama media.
- Marear: con «reducir movimiento» activado no hay desplazamientos.
- Meter colores fuera de marca en hovers o estados (negro `#1A1912`, amarillo solo acento, nada
  de azul; pares fondo/texto de `ESTANDAR.md` §0).

## 3. Restricciones

- **Móvil = 97 % del tráfico.** Todo se verifica a 390 px.
- **GSAP 3.15 ya está instalado y se carga en todas las páginas** (`src/lib/motion.ts`, ~70 KB sin
  comprimir, con ScrollTrigger y SplitText). No se añade ninguna dependencia.
- Web estática (Astro) servida por Hostinger; el JS de movimiento corre en el navegador.
- Solo se animan `transform` y `opacity` (nada de `clip-path` ni propiedades de maquetación), salvo
  el color de las palabras de `Statement` y de los velos de fila. `will-change` solo en lo que se
  está animando.
- Hay un esqueleto de carga (`html.is-loading`, `BaseLayout.astro` + `components.css`) que deja el
  texto transparente hasta `load` (3 s como mucho). Se queda; el movimiento arranca cuando se va
  (§5.5).
- Tres idiomas: no hay cambios de texto, pero SplitText debe partir bien titulares de distinta
  longitud en es/en/ca.

## 4. Enfoques considerados

| | Enfoque | A favor | En contra |
|---|---|---|---|
| **A** | **Sistema central con marcas en el HTML** (`data-reveal="…"`) y un solo módulo que las anima con `ScrollTrigger.batch` | Poco código, todo igual, se ajusta en un sitio, un componente nuevo se anima con solo marcarlo | Los efectos singulares siguen necesitando un script corto propio |
| B | Un script por componente (como `FamilyShowcase`) | Control total por pieza | ~30 scripts, muchos más ScrollTriggers, cada pieza se mueve a su manera |
| C | CSS + IntersectionObserver, GSAP solo para lo complejo | Lo más ligero | Dos sistemas de movimiento; el dueño pidió GSAP |

**Elegido: A** (dueño, 23-nov-2026), porque es lo que hace que toda la web se sienta igual de
fluida.

## 5. Diseño

### 5.1 Arquitectura

- **Un único módulo**, `src/lib/motion.ts` (ya existe y ya se inicializa en `BaseLayout.astro`),
  pasa a tener cuatro bloques: `entradas` (scroll), `cifras`, `efectos` (los singulares) y
  `toque` (hover/tap que necesitan JS).
- **La marca ya existe:** 62 elementos de la web llevan hoy `data-reveal` (secciones, filas,
  fichas). Se reutiliza con un valor: `data-reveal="subir"` (por defecto si va vacío),
  `"escalonado"`, `"foto"`, `"titulo"`, `"cifra"`. Así no hay que tocar cada componente; solo los
  que necesitan otro tipo.
- **Los hovers simples van en CSS**, en un archivo nuevo `src/styles/motion.css`, con atributos
  `data-hover="zoom" | "fila" | "lift"`. *Llamada mía:* en la conversación se dijo «en el mismo
  archivo que las entradas»; lo cambio porque un hover es un estado (entra y sale con el ratón) y
  CSS lo interrumpe y revierte solo, sin coste de JS. GSAP solo entra en los hovers con secuencia
  (galerías, §5.4).
- `motion` (Framer) sigue dentro de las islas React donde ya está.

### 5.2 Vocabulario de entradas y salidas

Curva de entrada `power3.out` (equivale a `--ease-out` de `tokens.css`); salida `power2.in`
**solo en salidas**, que son más cortas. Nunca rebote ni elástico.

| Marca | Entrada | Salida (al irse por arriba) | Uso |
|---|---|---|---|
| `subir` | `y: 32 → 0`, `opacity: 0 → 1`, 0,6 s | `y: 0 → -16`, `opacity → 0`, 0,35 s | Por defecto: secciones, bloques de texto, formularios |
| `escalonado` | Los hijos directos como `subir`, con `stagger` 0,06 s y tope total 0,4 s | Todos a la vez, 0,3 s | Listas y filas: `ServiceIndex`, `TownList`, `GuideTeaser`, `ContentGuide`, rejilla de fichas, FAQ, equipo |
| `foto` | Contenedor con `overflow: hidden`; la imagen entra de `scale: 1.12 → 1` y `opacity 0 → 1`, 0,8 s | `scale → 1.04`, `opacity → 0`, 0,35 s | Fotos de `SplitFeature`, `CeoSection`, `TeamMembers`, pueblos, mapa |
| `titulo` | SplitText por líneas con máscara, `yPercent: 110 → 0`, `stagger` 0,08 s, 0,7 s (el efecto actual de `[data-split]`, extendido a los `.section__title`) | Líneas a `yPercent: -60`, `opacity → 0`, 0,3 s | Títulos de sección y cabeceras de página |
| `cifra` | Cuenta de 0 al valor real en 1,2 s, `tabular-nums`, con el formato de cada idioma (`intlLocale`). Conserva los decimales del dato (la nota de Google cuenta de 0,0 a 4,9) y el prefijo o sufijo («+», «años») queda fijo, sin contar | Vuelve a 0 sin animar; al volver a entrar cuenta otra vez | **Todas** las `ProofBand` de las 6 páginas y `.stats`. La opción `count` de `ProofBand` (hoy en Inicio, Servicios y Gestión de patrimonio, con un contador propio en el `<script>` del componente que solo cuenta enteros) desaparece: cuenta siempre y lo hace `motion.ts` |

**Al volver por abajo** (scroll hacia arriba, el componente sale por el borde inferior): vuelve a
su estado inicial sin animación visible, listo para entrar otra vez. La salida animada es solo
por arriba, que es la que se ve.

**Disparo:** `start: "top 88%"`, `end: "bottom 12%"`. `ScrollTrigger.batch` con `interval: 0.1`
agrupa lo que entra a la vez para escalonarlo junto.

### 5.3 Efectos singulares (scripts cortos dentro de `motion.ts`)

Hoy van en CSS con `animation-timeline: view()` y no se ven en iOS < 26. Pasan a GSAP con
`scrub`, mismo dibujo, para que se vean igual en todos los móviles:

| Componente | Hoy (CSS) | Con GSAP |
|---|---|---|
| `HeroStory` | Foto se asienta al cargar; al salir, foto baja (parallax) y texto sube y se funde | Igual, con `scrub: true`. La foto **nunca** cambia de opacidad (es el LCP) |
| `HeroCenter` (Inicio) | Entrada escalonada al cargar (`hero-center-in`: opacidad y 16 px) | La misma entrada, con timeline al cargar; al salir, texto sube y se funde con `scrub`. La foto (el LCP) no cambia de opacidad; el texto sí puede fundirse, como hoy |
| `Statement` | Palabra a palabra pasa de opacidad 0,18 a 1 al cruzar la pantalla | Mismo dibujo (0,18 → 1) con `scrub`. Las palabras ya van en su `<span class="statement__word">` en el HTML: **sin SplitText** |
| `StoryScroll` (escritorio) | Foto fija con `position: sticky` y pasos que pasan; la maqueta de dos columnas solo existe dentro de `@supports (animation-timeline…)` | La maqueta de dos columnas sale del `@supports` (vale para todos los navegadores) y la foto sigue con `sticky`, **sin `pin`**. GSAP solo anima los pasos y el cambio de foto con `scrub`. En móvil, los pasos usan `escalonado` |
| `ProofBand` | Cifras estáticas que pasan de gris a tinta | `cifra` (cuentan desde 0) |
| `ClosingCTA` | Orbe que revela la píldora de WhatsApp (0,7 s) | Se queda como está; deja de ser «el único momento firmado» |
| `.property-grid__item` | `card-rise` en CSS | `escalonado` en la rejilla |

Se borran las reglas CSS sustituidas (`[data-reveal]` con `view()`, `card-rise`, `hero-drift`,
`hero-lift`, `photo-settle`, `figure-focus`, `statement-word`, `story-step`, `story-photo`) para
que no haya dos sistemas animando lo mismo.

### 5.4 Hover (ordenador) y toque (móvil)

Hover solo dentro de `@media (hover: hover) and (pointer: fine)`. En táctil, el equivalente es
**una respuesta corta al dedo (~120 ms) y luego la acción**, nunca un estado que se queda puesto.

| Pieza | Ordenador (hover) | Móvil (toque) |
|---|---|---|
| Galerías (`PropertyGallery`, `ReformCarousel`, fotos de pueblos) | La foto crece a `scale: 1.04` dentro de su marco, 0,4 s | Pulsación `scale: 0.97` y abre el visor / pasa la foto |
| Carruseles (`ReformCarousel`, `StoryVideos`) | La diapositiva activa sube 4 px y las vecinas se atenúan al 70 % | Al deslizar, la nueva entra con `subir` corto (0,3 s); al tocar un punto, pulsación |
| `TestimonialCarousel` | La isla React no se toca: su paso de reseña sigue con `motion`. Solo CSS sobre su marcado: puntos con velo en hover | Pulsación en los puntos (`:active`) |
| Tablas y filas (`ServiceIndex`, `TownList`, características de la ficha, `Compare`) | Fondo `--color-on-canvas` al 4 % y la flecha se desplaza 4 px a la derecha | Pulsación con el mismo velo durante el toque |
| Desplegables (`FaqSection`, acordeón de `ServiceIndex`, `TownList fold`) | Velo al 4 % en la fila | Abren con altura animada por `grid-template-rows: 0fr → 1fr` (CSS) y el contenido entra con `subir` corto |
| Fichas de inmueble (`PropertyCard`) | Foto `scale: 1.04` | Pulsación `scale: 0.97` |
| Botones | Se mantiene el FlipButton actual | Se mantiene `:active scale(0.97)` |

iOS Safari solo aplica `:active` si hay un `touchstart` registrado: el bloque `toque` registra
uno pasivo en `document`.

### 5.5 Contenido siempre visible y LCP

1. El HTML sale **con todo visible**. **Nada se oculta en CSS**: ni clase en el `<head>` ni
   temporizador propio. Si el JS falla, la web se ve como hoy sin animaciones.
2. `initMotion()` arranca cuando se va el esqueleto de carga (`is-loading`), no antes; así las
   entradas de la primera pantalla y los conteos no corren escondidos. Se reutiliza el final del
   esqueleto como señal (no un segundo temporizador).
3. Al arrancar, GSAP pone el estado inicial (`gsap.set`) **solo a los `[data-reveal]` que están
   por debajo de la pantalla**. Lo que ya se ve al arrancar (p. ej. el formulario de
   `/es/comprar/puedo-comprar/` o la caja de `reformas/simulador` a 390 px) hace una entrada
   corta solo con `transform`, sin pasar por `opacity: 0`.
4. **La foto del héroe nunca cambia de opacidad** (es el LCP); solo escala y se desplaza.
5. SplitText respeta la accesibilidad por defecto (`aria-label` con el texto completo); se
   comprueba en los tres idiomas.

### 5.6 «Reducir movimiento»

Con `prefers-reduced-motion: reduce` el bloque de entradas no se registra, así que nada se oculta.
Se conserva solo lo que no desplaza: cambios de color en hover y velos de filas. Sin parallax,
sin `pin`, sin conteo (la cifra se ve en su valor final), carruseles sin rotación automática
(como hoy). Se usa `gsap.matchMedia()`, que ya está en `motion.ts`, para que todo se revierta
solo si el usuario cambia la preferencia.

### 5.7 Rendimiento (presupuesto)

- Cero dependencias nuevas.
- Un solo `ScrollTrigger.batch` para todas las entradas; ningún `pin` (lo fijo sigue con
  `position: sticky`).
- `will-change: transform` solo durante la animación (lo pone y quita GSAP).
- `ScrollTrigger.refresh()` tras `document.fonts.ready` y `load`, no en cada `resize`.
- **Medido, no supuesto**, en la home, `/es/venta/`, una ficha y `/es/vender/`, a 390 px con CPU
  ralentizada 4×: CLS = 0, INP < 200 ms, LCP igual o mejor que antes de tocar nada (medir antes
  para tener la base), y scroll sin tirones en el panel de rendimiento.

### 5.8 Interruptor de emergencia

Una constante al principio de `motion.ts` (`MOTION_ON`) apaga las entradas, efectos y conteos:
con ella en `false`, la web queda toda visible y quieta sin desmontar nada más. Los hovers de
`motion.css` no dependen de ella.

### 5.9 Decisiones del diseñador tras la revisión (para que el dueño las compruebe)

- Las cifras cuentan **en todas las páginas**, también la nota de Google con su decimal; «+» y
  «años» no cuentan.
- `HeroCenter` mantiene su fundido de texto actual; solo la foto queda protegida.
- `Statement` conserva su dibujo actual (0,18 → 1), solo cambia el motor.
- Nada se oculta antes de que arranque GSAP; lo que se ve al cargar entra solo con desplazamiento.
- `TestimonialCarousel` queda fuera salvo hovers en CSS.

## 6. Cambios en `ESTANDAR.md`

Se reescriben, en la misma entrega:
- §1 tabla de movimiento: fuera «cero transform en hover» y el tope de 250 ms; dentro el
  vocabulario de §5.2 y las reglas de §5.4.
- §4 «Contador / Stat»: las cifras cuentan desde 0 (`cifra`).
- §4 «Movimiento (todos)» y §5 «Movimiento»: GSAP como motor único de entradas/salidas; CSS
  solo para hovers simples; `motion` dentro de islas React.
- Filas de `HeroCenter`, `Statement`, `StoryScroll`, `ProofBand` y `ClosingCTA` de la tabla de §5.

## 7. Lo que queda al constructor

- Ajuste fino de distancias y tiempos dentro de los rangos de §5.2, mirándolo a 390 px.
- Qué componentes llevan `escalonado`, `foto` o `titulo` en vez del `subir` por defecto, siguiendo
  la columna «Uso» de §5.2.
- Cómo se organiza internamente `motion.ts` (siempre un único punto de entrada `initMotion()`).
- Si hace falta un test automático: al menos uno que compruebe que, sin JS, ningún `[data-reveal]`
  tiene `opacity: 0` en el CSS compilado.

## 8. Fuera de alcance (posibles tareas aparte)

- `FamilyShowcase.astro` tiene un carrusel con ScrollTrigger que ninguna página usa: decidir si se
  borra.
- El panel para editar textos (documento aparte).
