# Animaciones con GSAP en toda la web — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada componente de la web entre al aparecer con el scroll y salga al irse, y que
galerías, carruseles, filas y desplegables respondan al hover (ordenador) y al toque (móvil).

**Architecture:** Un único punto de entrada, `initMotion()` en `src/lib/motion.ts`, ya llamado
desde `BaseLayout.astro`. Las entradas leen la marca `data-reveal="<tipo>"` que ya llevan 62
elementos y se animan con un solo `ScrollTrigger.batch`. Los efectos singulares (héroes,
`Statement`, `StoryScroll`) pasan de CSS `animation-timeline` a GSAP con `scrub`. Los hovers
sencillos van en `src/styles/motion.css`. La lógica pura (tipos, valores, cifras, posición) va en
módulos sin DOM con tests de Vitest.

**Tech Stack:** Astro 7, GSAP 3.15 (ScrollTrigger, SplitText; ya instalado), Tailwind 4, Vitest 5
(entorno node, sin DOM).

**Spec:** `docs/superpowers/specs/2026-11-23-animaciones-gsap-design.md` (aprobado 23-nov-2026).
Léelo entero antes de empezar; este plan no repite sus tablas.

## Global Constraints

- Cero dependencias nuevas (ni `jsdom`: los tests son de lógica pura y de archivos fuente).
- Solo se anima `transform` y `opacity`; excepción: el color/opacidad de `.statement__word` y los
  velos de fila. Nada de `clip-path`, `width`, `height`, `top`, `left`, márgenes.
- **Nada se oculta en CSS.** El estado inicial lo pone GSAP con `gsap.set`, y solo a elementos
  por debajo de la pantalla al arrancar.
- La foto del héroe (`.hero-story__photo`, `.hero-center__photo`) nunca cambia de opacidad.
- Hover solo dentro de `@media (hover: hover) and (pointer: fine)`.
- Con `prefers-reduced-motion: reduce`: sin entradas, sin parallax, sin conteo (valor final),
  sin `scrub`; se conservan cambios de color y velos. Todo bajo `gsap.matchMedia()`.
- Ningún `pin`; lo fijo sigue con `position: sticky`.
- Curvas: entradas `power3.out`, salidas `power2.in`. Nunca `elastic` ni `bounce` en código nuevo.
- Colores solo por tokens (`--color-*`); ningún hex en `motion.css`. Nada de azul.
- Sin cambios de texto (no hay que traducir nada). Si aparece alguno, va en es/en/ca.
- `npm run build` (incluye `astro check`) y `npx vitest run` pasan antes de cada commit.
- Verificar a 390 px antes de dar una tarea visual por buena.

## Review Focus

1. **Llegar a mitad de página** (ancla `#servicios` desde la flecha del héroe, volver atrás con
   el scroll restaurado, recargar a media página): lo que queda por encima de la pantalla al
   arrancar debe verse, no quedarse oculto. → test de `placement()` en la tarea 2.
2. **Separadores de miles frente a decimales por idioma**: «1.200» en es es mil doscientos;
   «4,9» en es y «4.9» en en son decimales; «+300» y «7 años» conservan prefijo y sufijo. → tests
   de `parseFigure()` en la tarea 2.
3. **Contenido que React pinta después** (la rejilla de `PropertyGrid` al filtrar, islas
   `client:visible`): los elementos nuevos nunca deben quedar invisibles. Como nada se oculta en
   CSS y solo se ocultan los que GSAP tocó al arrancar, se ven. → comprobación manual en la tarea 7
   (filtrar en `/es/venta/` y ver que las fichas nuevas aparecen).
4. **Cambiar «reducir movimiento» con la página abierta**: todo vuelve a su sitio y queda visible.
   → comprobación manual en la tarea 7 (emular la preferencia en DevTools y alternarla).
5. **Girar el móvil o redimensionar** con titulares partidos por SplitText en en/ca: las líneas se
   recalculan (`autoSplit: true`) y nada queda a medio animar. → comprobación manual en la tarea 7.

---

### Task 1: Medir la base antes de tocar nada

**Files:**
- Create: `docs/superpowers/plans/2026-11-23-animaciones-gsap-base.md`

- [ ] **Paso 1:** `npm run build` y `npx astro preview` (o servir `dist/client/`).
- [ ] **Paso 2:** En `/es/`, `/es/venta/`, una ficha `/es/inmueble/<slug>/` y `/es/vender/`, a
  390 px con CPU 4× más lenta en el panel de rendimiento: anotar LCP, CLS e INP (interactuar con
  un filtro o el menú) de cada una.
- [ ] **Paso 3:** Guardar la tabla en el archivo de base y hacer commit
  (`docs: base de rendimiento antes de las animaciones GSAP`).

### Task 2: Lógica pura de movimiento (con tests)

**Files:**
- Create: `src/lib/motion/kinds.ts`, `src/lib/motion/figures.ts`
- Test: `tests/motion-kinds.test.ts`, `tests/motion-figures.test.ts`

**Interfaces:**
- Produces (`kinds.ts`):
  - `type RevealKind = 'subir' | 'escalonado' | 'foto' | 'titulo' | 'cifra'`
  - `revealKind(attr: string | null | undefined): RevealKind` — vacío, `"true"` o desconocido → `'subir'`.
  - `REVEAL: Record<RevealKind, { from: gsap.TweenVars; enter: gsap.TweenVars; exit: gsap.TweenVars }>` con los valores de la tabla §5.2 del spec.
  - `TRIGGER = { start: 'top 88%', end: 'bottom 12%', interval: 0.1 } as const`
  - `STAGGER = { each: 0.06, max: 0.4 } as const` y `staggerEach(count: number): number` = `min(0.06, 0.4 / count)`.
  - `placement(top: number, bottom: number, viewport: number): 'arriba' | 'visible' | 'abajo'` — `abajo` si `top >= viewport * 0.88`; `arriba` si `bottom <= 0`; si no, `visible`.
- Produces (`figures.ts`):
  - `type Figure = { before: string; value: number; decimals: number; after: string; decimalSep: ',' | '.' }`
  - `parseFigure(text: string, lang: Lang): Figure | null` — separador decimal `','` en es/ca y `'.'` en en; el de miles se ignora.
  - `formatFigure(f: Figure, current: number, lang: Lang): string` — usa `Intl.NumberFormat(intlLocale[lang], { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals })` y recompone `before + número + after`.

- [ ] **Paso 1: tests que fallan.**

```ts
// tests/motion-kinds.test.ts
expect(revealKind(null)).toBe('subir');
expect(revealKind('')).toBe('subir');
expect(revealKind('true')).toBe('subir');
expect(revealKind('foto')).toBe('foto');
expect(revealKind('otra')).toBe('subir');
expect(REVEAL.subir.from).toMatchObject({ y: 32, opacity: 0 });
expect(REVEAL.subir.enter).toMatchObject({ y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
expect(REVEAL.subir.exit).toMatchObject({ y: -16, opacity: 0, duration: 0.35, ease: 'power2.in' });
expect(REVEAL.foto.from).toMatchObject({ scale: 1.12, opacity: 0 });
expect(REVEAL.foto.enter).toMatchObject({ scale: 1, duration: 0.8 });
expect(REVEAL.titulo.enter).toMatchObject({ duration: 0.7 });
expect(staggerEach(3)).toBe(0.06);
expect(staggerEach(20)).toBeCloseTo(0.02);
expect(placement(900, 1300, 800)).toBe('abajo');   // 900 >= 704
expect(placement(100, 500, 800)).toBe('visible');
expect(placement(-600, -10, 800)).toBe('arriba'); // llegada por ancla a media página
expect(Object.values(REVEAL).flatMap((r) => [r.enter.ease, r.exit.ease]).join()).not.toMatch(/elastic|bounce/);

// tests/motion-figures.test.ts
expect(parseFigure('+300', 'es')).toEqual({ before: '+', value: 300, decimals: 0, after: '', decimalSep: ',' });
expect(parseFigure('4,9', 'es')).toMatchObject({ value: 4.9, decimals: 1 });
expect(parseFigure('4.9', 'en')).toMatchObject({ value: 4.9, decimals: 1 });
expect(parseFigure('1.200', 'es')).toMatchObject({ value: 1200, decimals: 0 });
expect(parseFigure('7 años', 'es')).toMatchObject({ value: 7, after: ' años' });
expect(parseFigure('Google', 'es')).toBeNull();
const f = parseFigure('4,9', 'es')!;
expect(formatFigure(f, 0, 'es')).toBe('0,0');
expect(formatFigure(f, 4.9, 'es')).toBe('4,9');
expect(formatFigure(parseFigure('+300', 'ca')!, 150, 'ca')).toBe('+150');
```

- [ ] **Paso 2:** `npx vitest run tests/motion-kinds.test.ts tests/motion-figures.test.ts` → FAIL (módulos no existen).
- [ ] **Paso 3:** Implementar ambos módulos (sin tocar el DOM; `Lang` e `intlLocale` de `src/i18n`).
- [ ] **Paso 4:** Mismo comando → PASS.
- [ ] **Paso 5:** Commit `feat(motion): tipos, valores y cifras de las animaciones`.

### Task 3: Entradas, salidas y cifras con `ScrollTrigger.batch`

**Files:**
- Create: `src/lib/motion/reveal.ts`
- Modify: `src/lib/motion.ts` (todo el archivo), `src/components/Section.astro:25` (marca
  `data-reveal="titulo"` en el `.section__title`, el `section__head` sigue con `subir`),
  `src/components/sections/ProofBand.astro` (quitar prop `count`, `data-count` y el `<script>`
  de las líneas 66-110; marcar cada `.proof-band__value` con `data-reveal="cifra"`),
  `src/pages/[lang]/index.astro:158`, `servicios.astro:315`, `gestion-de-patrimonio.astro:318`
  (quitar `count`), y los `data-split` de las 8 páginas que lo usan pasan a `data-reveal="titulo"`.
- Test: `tests/motion-source.test.ts`

**Interfaces:**
- Consumes: todo lo de la tarea 2.
- Produces:
  - `export const MOTION_ON = true` en `src/lib/motion.ts` (interruptor de §5.8).
  - `waitForSkeleton(): Promise<void>` en `motion.ts` — resuelve cuando `<html>` no tiene
    `is-loading` (ya o al quitarse; `MutationObserver` sobre `class`). No crea temporizador propio.
  - `initReveals(): () => void` en `reveal.ts` — registra el batch y devuelve la limpieza.
  - `initMotion()` queda: registra plugins, `initHeader()` (igual que hoy), y si `MOTION_ON`,
    tras `waitForSkeleton()` y `document.fonts.ready`, dentro de
    `gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', …)`: `initActionBar()`
    (igual que hoy), `initReveals()`, `initEffects()` (tarea 4).

Comportamiento de `initReveals()` (lo que el test no puede ver; seguir al pie de la letra):
- Recorre `[data-reveal]`. Por cada uno, `placement()` con su `getBoundingClientRect()`:
  `abajo` → `gsap.set(REVEAL[kind].from)`; `visible` → entrada solo con `y`/`scale` desde `from`
  sin `opacity`; `arriba` → nada.
- `escalonado` anima sus hijos directos con `stagger: staggerEach(n)`; `titulo` usa
  `SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit })` como hoy
  `initSplitTitles`; `cifra` usa `parseFigure`/`formatFigure` con `lang = document.documentElement.lang`
  y un tween de un objeto `{ n }` de 0 al valor en 1,2 s. Si `parseFigure` da `null`, se trata
  como `subir`.
- `ScrollTrigger.batch('[data-reveal]', { ...TRIGGER, onEnter: entrar, onEnterBack: entrar,
  onLeave: salir, onLeaveBack: (els) => gsap.set(els, from) })`. Salir a la cifra = volver a 0
  con `gsap.set`.
- `ScrollTrigger.refresh()` tras `load` una vez.

- [ ] **Paso 1: test que falla** (`tests/motion-source.test.ts`, lee archivos con `readFileSync`):

```ts
const pages = globSync('src/**/*.astro');
expect(pages.filter((p) => readFileSync(p, 'utf8').includes('data-split'))).toEqual([]);
expect(readFileSync('src/components/sections/ProofBand.astro', 'utf8')).not.toMatch(/data-count|requestAnimationFrame/);
expect(globSync('src/pages/**/*.astro').filter((p) => /<ProofBand[^>]*\bcount\b/.test(readFileSync(p, 'utf8')))).toEqual([]);
const motion = readFileSync('src/lib/motion.ts', 'utf8');
expect(motion).toMatch(/export const MOTION_ON = true/);
expect(motion).toMatch(/prefers-reduced-motion: no-preference/);
expect(motion + readFileSync('src/lib/motion/reveal.ts', 'utf8')).not.toMatch(/\bpin:\s*true|markers:\s*true/);
```

(`globSync` de `node:fs`; el Mac tiene Node 26.)

- [ ] **Paso 2:** `npx vitest run tests/motion-source.test.ts` → FAIL.
- [ ] **Paso 3:** Implementar según el comportamiento de arriba.
- [ ] **Paso 4:** `npx vitest run` → PASS todo (incluido `tests/proof.test.ts`, que no cambia).
- [ ] **Paso 5:** `npm run dev`, `/es/` a 390 px: las secciones entran al bajar, salen al irse por
  arriba y vuelven al subir; las cifras de la banda cuentan (4,9 con decimal en `/es/vender/`).
- [ ] **Paso 6:** Commit `feat(motion): entradas y salidas con ScrollTrigger.batch y cifras que cuentan`.

### Task 4: Efectos singulares en GSAP y retirada del CSS `animation-timeline`

**Files:**
- Create: `src/lib/motion/effects.ts`
- Modify: `src/styles/base.css:85-175` (quitar el bloque `@supports (animation-timeline…)` de
  `[data-reveal]`, `.hero-story__photo` parallax, `.hero-story__content`, `.story-scroll__inline img`,
  `.proof-band__value` y los `@keyframes` `reveal`, `figure-focus`, `hero-drift`, `hero-lift`,
  `photo-settle`; `hero-settle` al cargar se queda), `src/styles/sections.css` (bloques de
  `hero-center-in` ~925-950, `statement-word` ~968-985 y 1023, `story-step`/`story-photo`
  ~1700-1760: la maqueta de dos columnas de `StoryScroll` sale del `@supports` y queda bajo
  `@media (min-width: 60rem)`), `src/styles/property.css:26-40` (`card-rise`),
  `src/islands/PropertyGrid.tsx:14` (`data-reveal="escalonado"` en el `<ul>`).
- Test: añadir a `tests/motion-source.test.ts`

**Interfaces:**
- Consumes: `REVEAL`, `TRIGGER` (tarea 2).
- Produces: `initEffects(): () => void` en `effects.ts`, llamada desde `initMotion()` (tarea 3).

Qué hace `initEffects()`, una función interna por pieza, cada una sale si no encuentra su nodo:
- `heroStory()`: `.hero-story__photo` `y: '10%'` y `.hero-story__content` `y: -48, opacity: 0`,
  ambos con `scrollTrigger: { trigger: '.hero-story', start: 'top top', end: 'bottom top', scrub: true }`.
- `heroCenter()`: timeline al arrancar con `.hero-center__title`, `__lead`, `__actions` desde
  `y: 16, opacity: 0`, 0,6 s, `stagger: 0.08`, `power3.out`; y al salir el `.hero-center__content`
  sube y se funde con `scrub`. La foto no se toca.
- `statement()`: por cada `.statement__text`, timeline con `scrub: true`
  (`start: 'top 80%'`, `end: 'bottom 40%'`) que lleva cada `.statement__word` de `opacity: 0.18` a 1
  en secuencia. Sin SplitText.
- `storyScroll()`: solo `min-width: 60rem` (dentro del `matchMedia`). Hoy cada foto del stage se
  empareja con su paso por índice mediante timelines con nombre (`style="animation-timeline: …"` en
  `StoryScroll.astro:51` y `view-timeline` en los pasos). Se sustituye por: cada
  `.story-scroll__step` i con `ScrollTrigger` (`start: 'top center'`, `end: 'bottom center'`,
  `toggleClass: 'is-active'`) y, en `onToggle` activo, la `.story-scroll__stage-photo` i a
  `opacity: 1` y las demás a 0 con `gsap.to` de 0,4 s. Paso inactivo `opacity: 0.6`, activo 1, en
  CSS por `is-active` (los valores de `story-step` de hoy). Quitar el `style` y los nombres de
  timeline de `StoryScroll.astro`.

- [ ] **Paso 1: test que falla** (añadir):

```ts
const styles = globSync('src/styles/*.css').map((p) => readFileSync(p, 'utf8')).join('\n');
expect(styles).not.toMatch(/animation-timeline/);
expect(styles).not.toMatch(/@keyframes (reveal|figure-focus|hero-drift|hero-lift|photo-settle|statement-word|story-step|story-photo|card-rise|hero-center-in)\b/);
expect(styles).not.toMatch(/\[data-reveal\][^{]*\{[^}]*opacity:\s*0/);
```

- [ ] **Paso 2:** `npx vitest run tests/motion-source.test.ts` → FAIL.
- [ ] **Paso 3:** Implementar `effects.ts` y retirar el CSS listado.
- [ ] **Paso 4:** `npx vitest run` → PASS; `npm run build` → OK.
- [ ] **Paso 5:** A 390 px y a 1280 px: héroe de `/es/vender/` con parallax al salir; portada con
  entrada del titular; `Statement` se enciende palabra a palabra; `StoryScroll` en escritorio con
  la foto fija y el paso activo marcado; en Safari/iOS (o WebKit en Playwright) se ve igual.
- [ ] **Paso 6:** Commit `feat(motion): héroes, Statement y StoryScroll con GSAP; fuera animation-timeline`.

### Task 5: Hover y toque

**Files:**
- Create: `src/styles/motion.css` (y `@import "./motion.css";` al final de `src/styles/global.css`),
  `src/lib/motion/touch.ts`
- Modify: marcar con `data-hover` los componentes de la tabla §5.4 del spec:
  `zoom` → fotos de `PropertyGallery.tsx`, `PropertyCard.tsx`, `ReformCarousel.tsx`, fotos de
  pueblos (`TownList`/índice de zonas); `fila` → filas de `ServiceIndex`, `TownList`,
  características de la ficha, `Compare`, `FaqSection`, puntos de `TestimonialCarousel` (solo
  CSS sobre su marcado; la isla no se toca); `lift` → diapositiva activa de `ReformCarousel`.
  `StoryVideos` ya tiene su propio hover con GSAP y no se marca. `src/islands/ReformCarousel.tsx` (en `onSlideChange` de
  `<Swiper>`, la diapositiva nueva entra con `REVEAL.subir` acortado a 0,3 s, solo sin reduced-motion).
- Test: añadir a `tests/motion-source.test.ts`

**Interfaces:**
- Consumes: `REVEAL` (tarea 2).
- Produces: `initTouch(): void` en `touch.ts` — un `touchstart` pasivo vacío en `document` para
  que iOS aplique `:active`. Se llama en `initMotion()` fuera del `matchMedia` (la pulsación es
  respuesta, no movimiento decorativo, y no desplaza nada visible más allá de `scale(0.97)`).

Valores de `motion.css` (de §5.4): `zoom` → la imagen interior `scale(1.04)` en 0,4 s
`var(--ease-out)`, marco con `overflow: hidden`; `fila` → fondo
`color-mix(in oklch, var(--color-on-canvas) 4%, transparent)` y la flecha `translateX(4px)`;
`lift` → `translateY(-4px)` y vecinas `opacity: 0.7`. Táctil: `[data-hover]:active` con
`scale(0.97)` (filas: el velo, sin escala) en 120 ms. Transiciones con propiedades concretas,
nunca `all`. Dentro de `prefers-reduced-motion: reduce`, sin `transform` (se quedan los velos).

- [ ] **Paso 1: test que falla** (añadir):

```ts
const motionCss = readFileSync('src/styles/motion.css', 'utf8');
expect(readFileSync('src/styles/global.css', 'utf8')).toMatch(/@import "\.\/motion\.css";/);
expect(motionCss).not.toMatch(/#[0-9a-f]{3,8}\b|transition:\s*all/i);
// todo :hover vive dentro del media de puntero fino
const outsideHoverMedia = motionCss.replace(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[\s\S]*?\n\}/g, '');
expect(outsideHoverMedia).not.toMatch(/:hover/);
expect(motionCss).toMatch(/prefers-reduced-motion: reduce/);
```

- [ ] **Paso 2:** `npx vitest run tests/motion-source.test.ts` → FAIL.
- [ ] **Paso 3:** Implementar CSS, `touch.ts` y las marcas.
- [ ] **Paso 4:** `npx vitest run` → PASS; `npm run build` → OK.
- [ ] **Paso 5:** A 1280 px, pasar el ratón por una ficha, una fila de servicios y el carrusel de
  obras; a 390 px (emulación táctil), tocarlos: pulsación visible y luego la acción. Contraste de
  los velos en claro y oscuro (pares de §0 de `ESTANDAR.md`).
- [ ] **Paso 6:** Commit `feat(motion): hover en ordenador y pulsación en móvil`.

### Task 6: Actualizar `ESTANDAR.md`

**Files:**
- Modify: `ESTANDAR.md` §1 (tabla de movimiento, ~líneas 160-175), §4 «Contador / Stat» y
  «Movimiento (todos)» (~325-335), §5 filas `HeroCenter`, `Statement`, `StoryScroll`, `ProofBand`,
  `ClosingCTA` y «Movimiento» (~401-422).

- [ ] **Paso 1:** Sustituir las reglas viejas por las del spec §6: vocabulario de §5.2, hover y
  toque de §5.4, GSAP motor único de entradas/salidas, CSS para hovers, `motion` en islas,
  cifras que cuentan, nada se oculta en CSS, la foto del héroe sin opacidad. Fechar «dueño,
  2026-11-23».
- [ ] **Paso 2:** `grep -n "Sin JS para el movimiento\|Cero transform\|estáticas" ESTANDAR.md` → sin
  resultados que contradigan lo nuevo.
- [ ] **Paso 3:** Commit `docs(estandar): nuevas reglas de movimiento con GSAP`.

### Task 7: Verificación final en móvil y rendimiento

**Files:**
- Modify: `docs/superpowers/plans/2026-11-23-animaciones-gsap-base.md` (añadir columna «después»),
  `ESTADO.md` §3 (una línea con lo hecho).

- [ ] **Paso 1:** `npm run build && npx vitest run` → todo verde.
- [ ] **Paso 2:** Repetir las medidas de la tarea 1 en las mismas 4 páginas, 390 px, CPU 4×.
  Criterio: CLS = 0, INP < 200 ms, LCP igual o mejor que la base. Si no se cumple, no se cierra.
- [ ] **Paso 3:** Review Focus 1: abrir `/es/#servicios` y `/es/vender/` recargando a media
  página → lo de arriba se ve. Review Focus 3: filtrar en `/es/venta/` → las fichas nuevas se ven.
  Review Focus 4: alternar «reducir movimiento» en DevTools con la página abierta → todo visible y
  quieto. Review Focus 5: girar 390×844 ↔ 844×390 en `/en/` y `/ca/` → titulares bien partidos.
- [ ] **Paso 4:** JavaScript desactivado en `/es/`: la página entera se ve.
- [ ] **Paso 5:** `MOTION_ON = false` en local: todo visible y quieto; volver a `true`.
- [ ] **Paso 6:** Detector de Impeccable sobre lo cambiado:
  `node ~/.claude/skills/impeccable/scripts/detect.mjs --json src/styles/motion.css src/lib/motion.ts src/lib/motion`.
- [ ] **Paso 7:** Commit `chore(motion): verificación y estado`. La subida a Hostinger sigue el
  procedimiento habitual (copia con `scripts/guardar-version.sh`, FTP, `scripts/smoke.mjs`) y
  **la decide el dueño**; no forma parte de este plan.
