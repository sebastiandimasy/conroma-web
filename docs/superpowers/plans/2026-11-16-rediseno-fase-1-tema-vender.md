# Rediseño · Fase 1 (tema, movimiento, ProofBand y página Vender) · Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objetivo:** dejar el claro/oscuro correcto en toda la web y las cifras reales en el HTML. Sobre esa base, crear las secciones de la librería que necesita Vender y rehacer `/es/vender/` como una página completa con su historia.

**Arquitectura:**
- Componentes Astro nuevos en `src/components/sections/`: sin JS, con tokens de Conroma y con su CSS en `src/styles/sections.css`.
- El movimiento pasa de GSAP a CSS scroll-driven (`animation-timeline: view()`), siempre como mejora progresiva.
- Los textos de Vender viven en `src/data/vender.ts`, y los tests los comprueban: longitudes, recuentos y ningún dato inventado.

**Stack:** Astro 7 estático · React 19 (islas, aquí no se crea ninguna) · HeroUI v3 · Tailwind 4 · Vitest 5.

**Spec:** `docs/superpowers/specs/2026-11-16-rediseno-paginas-design.md` (aprobada por el dueño el 2026-11-16). Este plan cubre los pasos 1 y 2 del «Orden de trabajo» (§6). El resto va en los planes posteriores de la lista del final.

## Restricciones globales

- **Móvil primero:** se verifica a 390 px en claro y en oscuro, sin scroll horizontal. Si `resize_window` no cambia el viewport, se usa un iframe de 390 px.
- **Paleta:** negro `#1A1912` como principal, amarillo `#F3BC16` solo de acento y nunca de fondo de sección, sin azul. Los colores salen siempre de tokens de `tokens.css` (`--color-*`), nunca hex sueltos en componentes.
- **Tipografía:** solo Hanken Grotesk en lo nuevo. Ni Playfair ni Pacifico en componentes nuevos.
- **`no-slop-ui`:**
  - sin eyebrows, sin `glass`, sin degradados decorativos (solo el velo bajo texto sobre foto);
  - sombras ≤ `0 2px 8px`; tarjetas con radio 12 px y botones con 10 px;
  - hover solo de color, fondo o borde, y `:active` con `scale(0.97)`;
  - nada se anima al cargar;
  - el movimiento solo usa opacidad y desplazamiento ≤ 24 px, sin rebote ni escala.
- **`no-ai-slop` en todo texto nuevo:** sin rayas (—) como muletilla, sin «no es X, es Y», sin preguntas retóricas autocontestadas, sin remates ni cierres-resumen, y pasando la prueba de portabilidad. Voz de la familia: `~/.claude/projects/-Users-sebastian/memory/conroma-voz-redaccion.md`. Antes de cada commit con texto se pasa el modo *detectar* de `no-ai-slop` y se corrige lo que marque.
- **Datos reales:**
  - las cifras salen de `src/data/site.ts` y `getListings()`;
  - ningún plazo, porcentaje ni «pisos vendidos» que no esté en el repo;
  - `site.feePercent` es `null`, así que no se publica ningún porcentaje de honorarios;
  - el caso real (CaseStory) no entra en esta fase porque falta el dato del dueño (spec §9.2). Se omite, no se rellena.
- **Contenido sin JS:** H1, cifras, precios y CTA están completos en el HTML. El estado oculto de una animación solo existe dentro de `@supports ((animation-timeline: view()) and (animation-range: entry))` + `@media (prefers-reduced-motion: no-preference)`.
- **LCP:** la imagen del hero lleva `loading="eager"` y `fetchpriority="high"`; el resto de imágenes van con lazy.
- **Medición:** todo CTA de contacto lleva `data-contact` y `data-origin`, y la URL es `wa.me` o `tel:` (GTM mide por Click URL).
- **Comandos:**
  - tipos: `npx astro check`;
  - tests: `npx vitest run`;
  - build: `npx astro build`. **No** `npm run build`, porque su `prebuild` reescribe el inventario.
  - Nunca se compila con el servidor de desarrollo en marcha: primero `npx astro dev stop`.
  - El HTML compilado queda en `dist/client/`.
- **Commits:**
  - solo si el dueño autorizó commits al lanzar la ejecución;
  - nunca entran `.impeccable/hook.cache.json`, `.claude/` ni `.env*`;
  - cada mensaje termina con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
  - rama `feat/crm-leads`, sin push.

## Foco de revisión

1. **Primera visita desde un móvil en modo oscuro sin tema guardado.** Los controles de HeroUI (campos, desplegables, el selector) deben salir oscuros a la vez que la página. Lo cubren el test de tokens y la comprobación en navegador de la Tarea 1.
2. **Navegador sin scroll-driven animations, JS desactivado o `prefers-reduced-motion: reduce`.** Todo el contenido tiene que verse, incluidos los pasos y las fotos de StoryScroll en escritorio. Se comprueba en las Tareas 2 y 6.
3. **Datos vacíos.** Si no hay ficha de Google (`googleRating: null`), si `yearsActive` es `null` o si el inventario está vacío, ProofBand no pinta esa cifra. Nunca un «0». Lo cubren los tests de la Tarea 3.
4. **Categoría del blog sin artículos publicados (o solo borradores).** GuideTeaser no se pinta. Lo cubre el test de la Tarea 4.
5. **Honorarios sin dato.** Mientras `feePercent` sea `null`, ninguna respuesta de la FAQ de Vender contiene un porcentaje. Lo cubre el test de la Tarea 4.

---

### Task 0: Dejar listo el trabajo pendiente

**Archivos:**
- Modificar: `src/assets/lugares/**/*.jpg` (22 fotos, ahora 29 MB)
- Añadir a git: el spec, este plan, `src/data/creditos-fotos.ts`, `src/assets/lugares/` y `src/pages/es/index.astro` (ya sin `data-reveal` en el hero)

- [ ] **Paso 1: reducir las fotos de lugar.** Lado largo máximo de 2000 px y JPEG de calidad 82, con `sharp` (ya instalado), sobrescribiendo cada archivo. Hay que conservar la orientación EXIF (`.rotate()`).
- [ ] **Paso 2: comprobar.** Ejecutar `du -sh src/assets/lugares`. Debe salir ≤ 10 MB. Después, `npx astro check`: 0 errores.
- [ ] **Paso 3: commit.** `git add docs/superpowers src/data/creditos-fotos.ts src/assets/lugares src/pages/es/index.astro` y `git commit -m "docs: spec y plan del rediseño; fotos de lugar con créditos"`.

---

### Task 1: Tema claro/oscuro con una sola fuente de verdad

**Archivos:**
- Modificar: `src/styles/tokens.css:128-147` (el `:root` que mapea HeroUI)
- Modificar: `src/layouts/BaseLayout.astro:68-73` (script de tema en la cabeza)
- Crear: `scripts/auditoria-contraste.js` (copia de la auditoría usada en el spec, para reutilizarla)
- Test: `tests/theme-tokens.test.ts`

**Interfaces:** produce el atributo `data-theme` (`light` o `dark`), que a partir de aquí siempre está en `<html>`. Las tareas posteriores pueden darlo por hecho.

- [ ] **Paso 1: escribir el test que falla**

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/styles/tokens.css', 'utf8');
// El :root de mapeo HeroUI → Conroma es el que contiene --accent: var(--color-accent).
const mapping = css.split(/^:root\s*\{/m).find((block) => block.includes('--accent: var(--color-accent)'))!.split(/^\}/m)[0];

const heroTokens = [
  '--foreground', '--muted', '--surface', '--surface-foreground', '--surface-secondary',
  '--surface-secondary-foreground', '--surface-tertiary', '--surface-tertiary-foreground',
  '--surface-hover', '--overlay', '--overlay-foreground', '--field-background', '--field-foreground',
  '--field-placeholder', '--field-border', '--segment', '--segment-foreground', '--border',
  '--separator', '--focus', '--link', '--success', '--success-foreground', '--warning', '--warning-foreground',
];

describe('tema: HeroUI hereda los tokens de Conroma', () => {
  it.each(heroTokens)('%s apunta a un token --color-*', (token) => {
    expect(mapping).toMatch(new RegExp(`^\\s*${token}:\\s*var\\(--color-`, 'm'));
  });

  it('el mapeo no lleva colores sueltos', () => {
    expect(mapping).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|rgb\(/i);
  });
});
```

- [ ] **Paso 2: ejecutar `npx vitest run tests/theme-tokens.test.ts`.** Debe FALLAR en `--foreground` y en los siguientes.
- [ ] **Paso 3: mapear cada token del test en ese mismo `:root`.**
  - Pares que se fijan:
    - `--foreground`, `--surface-foreground`, `--overlay-foreground` y `--field-foreground` → `--color-on-surface`;
    - `--surface` y `--overlay` → `--color-surface`;
    - `--surface-secondary`, `--surface-tertiary` y `--surface-hover` → `--color-surface-2`, y sus `-foreground` → `--color-on-surface-2`;
    - `--muted` y `--field-placeholder` → `--color-ink-3`;
    - `--field-background` → `--color-canvas`;
    - `--field-border`, `--border` y `--separator` → `--color-line`;
    - `--focus` → `--color-focus`;
    - `--link` → `--color-ink`;
    - `--segment` → `--color-surface` y `--segment-foreground` → `--color-on-surface`;
    - `--success` → `--color-positive` y `--success-foreground` → `--color-on-positive`;
    - `--warning` → `--color-accent` y `--warning-foreground` → `--color-on-accent`.
  - Si algún `--color-*` no existe en los dos temas, se usa el más cercano que sí exista en `:root[data-theme="dark"]` y en el `@media` oscuro.
  - Un solo bloque basta para los dos temas: sigue después de `@heroui/styles` en `global.css` y tiene la misma especificidad que el selector oscuro de HeroUI, así que gana por orden.
- [ ] **Paso 4: ejecutar `npx vitest run tests/theme-tokens.test.ts`.** Debe PASAR.
- [ ] **Paso 5: cambiar el script de cabeza** para que fije siempre `data-theme` y siga los cambios del sistema mientras no haya tema guardado:

```js
(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-color-scheme: dark)');
  const pick = () => {
    let saved = null;
    try { saved = localStorage.getItem('conroma:tema'); } catch {}
    root.dataset.theme = saved === 'dark' || saved === 'light' ? saved : media.matches ? 'dark' : 'light';
  };
  pick();
  media.addEventListener('change', pick);
})();
```

El botón de `SiteHeader.astro` no se toca: ya lee `dataset.theme` y guarda en `conroma:tema`.

- [ ] **Paso 6: copiar la auditoría de contraste.** Copiar `/private/tmp/claude-501/-Users-sebastian--claude-spares-spare-bcV7FH/f5cef8ef-f4d0-4949-af75-8f7a9b54816b/scratchpad/contrast.js` a `scripts/auditoria-contraste.js`, con una línea de cabecera: `// Pegar en la consola o en javascript_tool; desactivar transiciones antes (*{transition:none!important}).` Si el scratchpad ya no existe, se reescribe: mide el contraste WCAG de cada nodo de texto sobre su fondo liso, en los temas `light` y `dark`, y devuelve los fallos por debajo de 4,5:1 (3:1 en texto grande).
- [ ] **Paso 7: comprobar en el navegador.** Con el servidor de desarrollo, emular `colorScheme: dark`, borrar `conroma:tema` y recargar `/es/vender/`.
  - `getComputedStyle(document.documentElement).getPropertyValue('--surface')` tiene que coincidir con `--color-surface` en oscuro.
  - El campo del `ValuationBlock` debe salir oscuro.
  - Ejecutar la auditoría en `/es/`, `/es/venta/` y `/es/vender/`: 0 fallos nuevos frente al spec §4.3.
- [ ] **Paso 8: commit.** `fix(tema): HeroUI hereda todos los tokens de Conroma y data-theme siempre fijado`.

---

### Task 2: Movimiento con CSS, el contenido nunca depende de JS

**Archivos:**
- Modificar: `src/lib/motion.ts` (quitar `initReveals` y su llamada)
- Modificar: `src/styles/base.css:82-84` (mover `@view-transition` dentro de reduced-motion y añadir el reveal en CSS)

**Interfaces:** produce el atributo `data-reveal`, que pasa a ser solo CSS. Cualquier componente puede ponerlo y, sin soporte, el elemento se ve tal cual.

- [ ] **Paso 1: quitar `initReveals`.** Borrar la función y su llamada en `initMotion()` de `src/lib/motion.ts`. `initHeader`, `initActionBar` e `initSplitTitles` se quedan.
- [ ] **Paso 2: sustituir el bloque `@view-transition` de `base.css`.**

```css
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }

  @supports ((animation-timeline: view()) and (animation-range: entry)) {
    [data-reveal] {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
  }
}

@keyframes reveal {
  from { opacity: 0; transform: translateY(24px); }
}
```

  Lo que ya está a la vista al cargar queda en su estado final: con `view()` su progreso de `entry` es del 100 %, así que nada se anima al cargar.
- [ ] **Paso 3: comprobar.**
  - `npx astro check`: 0 errores.
  - En el navegador, `/es/` a 390 px: al hacer scroll las secciones aparecen.
  - Con JS desactivado (o comprobando `document.querySelectorAll('[data-reveal]')` en un HTML compilado sin scripts) todas se ven con `opacity: 1`.
  - `grep -c 'autoAlpha' src/lib/motion.ts` → `0`.
- [ ] **Paso 4: commit.** `refactor(motion): reveals en CSS scroll-driven; el contenido ya no se oculta con JS`.

---

### Task 3: ProofBand, cifras reales en el HTML

**Archivos:**
- Crear: `src/lib/proof.ts`
- Crear: `src/components/sections/ProofBand.astro`
- Modificar: `src/pages/es/index.astro:9,87` (Contador → ProofBand) y `src/pages/es/empresa.astro:5,38` (TrustBand → ProofBand)
- Borrar: `src/components/sections/Contador.astro`, `src/components/sections/TrustBand.astro`, `src/islands/StatCounters.tsx` y sus reglas `.contador*` y `.trust-band*` de `src/styles/sections.css`. `AnimatedNumber.tsx` se queda porque lo usa `ReformSimulator`.
- Test: `tests/proof.test.ts`

**Interfaces:**
- Produce:
  - `interface ProofFigure { value: string; label: string; source?: string; href?: string }`;
  - `proofFigures(input: { rating: { value: number; count: number; checkedOn: string; url: string } | null; yearsActive: number | null; listings: number; builtOn: Date }): ProofFigure[]`;
  - `<ProofBand figures?={ProofFigure[]} bridge?={string} />`.
- Consume: `formatRating` de `src/lib/format.ts`.

- [ ] **Paso 1: escribir el test que falla**

```ts
import { describe, expect, it } from 'vitest';
import { proofFigures } from '../src/lib/proof';

const rating = { value: 4.7, count: 107, checkedOn: '2026-10-12', url: 'https://www.google.com/maps?cid=1' };
const builtOn = new Date('2026-11-16T12:00:00Z');

describe('proofFigures', () => {
  it('da las cifras reales en orden, con su fuente', () => {
    const figures = proofFigures({ rating, yearsActive: 7, listings: 118, builtOn });
    expect(figures.map((f) => f.value)).toEqual(['4,7', '107', '7', '118']);
    expect(figures[0].source).toBe('Google, consultado el 12 oct 2026');
    expect(figures[0].href).toBe(rating.url);
    expect(figures[3].source).toBe('Cartera publicada a 16 nov 2026');
  });

  it('sin ficha de Google no pinta ni nota ni recuento', () => {
    expect(proofFigures({ rating: null, yearsActive: 7, listings: 118, builtOn }).map((f) => f.value)).toEqual(['7', '118']);
  });

  it('nunca pinta un cero', () => {
    expect(proofFigures({ rating: null, yearsActive: null, listings: 0, builtOn })).toEqual([]);
  });
});
```

- [ ] **Paso 2: ejecutar `npx vitest run tests/proof.test.ts`.** Debe FALLAR con «Failed to resolve import».
- [ ] **Paso 3: implementar `proofFigures` en `src/lib/proof.ts`.**
  - Etiquetas: `sobre 5 en Google`, `reseñas en Google`, `años en el Alt Maresme`, `inmuebles publicados`.
  - Fechas con `Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' })`. `checkedOn` se lee como `${checkedOn}T12:00:00Z` para que la zona horaria no la mueva de día.
  - Los años no llevan `source`.
  - Se omite cualquier cifra `null` o `<= 0`.
- [ ] **Paso 4: ejecutar `npx vitest run tests/proof.test.ts`.** Debe PASAR.
- [ ] **Paso 5: crear `ProofBand.astro`.**
  - Por defecto: `proofFigures({ rating: site.googleRating, yearsActive: site.yearsActive, listings: getListings().length, builtOn: new Date() })`.
  - Con lista vacía no se renderiza nada.
  - Marcado: `<section class="proof-band" aria-label="Datos de Conroma">` con un `<dl>` en fila.
  - Cada cifra:
    - `<dd>` con el valor a `--text-h2` y peso 700;
    - `<dt>` con la etiqueta;
    - fuente en `--text-caption` con `--color-ink-2`, enlazada si hay `href` (`rel="noopener" target="_blank"`).
  - Fondo `--color-surface-2`: es la única sección con fondo distinto en la página.
  - Sin tarjetas, sin `glass` y sin `data-reveal`.
  - En móvil, 2 columnas; en escritorio (`min-width: 60rem`), una sola fila.
  - `bridge`, si llega, se pinta como último `<p class="section__bridge">`.
- [ ] **Paso 6: cambiar los componentes en `index.astro` y `empresa.astro`** y borrar los archivos y el CSS de la lista. Después, `grep -rn 'StatCounters\|Contador\|TrustBand\|trust-band\|contador' src`: sin resultados.
- [ ] **Paso 7: comprobar.**
  - `npx astro dev stop; npx astro check && npx vitest run && npx astro build`: pasa.
  - `grep -o '<dd[^>]*>[^<]*' dist/client/es/index.html`: salen `4,7`, `107`, `7` y el número de la cartera. Ningún `0`.
- [ ] **Paso 8: commit.** `feat(proof): cifras reales en el HTML (adiós al contador desde 0)`.

---

### Task 4: Textos de Vender y artículos por categoría

**Archivos:**
- Crear: `src/data/vender.ts`
- Modificar: `src/data/blog.ts` (añadir `postsIn`)
- Copiar: una foto de `public/img/reformas/` a `src/assets/reformas/` (para que Astro la optimice). Se elige una habitación terminada y luminosa, mirándolas antes.
- Test: `tests/vender.test.ts`, `tests/blog.test.ts`

**Interfaces:**
- Produce:
  - `postsIn(category: string, limit?: number): BlogPost[]`: solo artículos publicados (`draft: false`), del más reciente al más antiguo, `limit` 3 por defecto;
  - `interface StoryStep { title: string; text: string; image: ImageMetadata; alt: string }`;
  - `interface CompareRow { aspect: string; withUs: string; alone: string }`;
  - `venderAnswer: string`;
  - `venderSteps: StoryStep[]`;
  - `venderCompare: CompareRow[]`;
  - `venderFaq: FaqItem[]`.
- Consume: `FaqItem` de `src/data/faq.ts` y `site` de `src/data/site.ts`.

- [ ] **Paso 1: escribir los tests que fallan**

```ts
// tests/blog.test.ts
import { describe, expect, it } from 'vitest';
import { posts, postsIn } from '../src/data/blog';

describe('postsIn', () => {
  it('solo publicados de la categoría, del más reciente al más antiguo', () => {
    const list = postsIn('Vender', 10);
    expect(list.length).toBe(posts.filter((p) => p.category === 'Vender' && !p.draft).length);
    expect(list.every((p) => p.category === 'Vender' && !p.draft)).toBe(true);
    expect([...list].sort((a, b) => b.date.localeCompare(a.date))).toEqual(list);
  });

  it('respeta el límite y devuelve [] si no hay artículos', () => {
    expect(postsIn('Vender', 1)).toHaveLength(1);
    expect(postsIn('Categoría que no existe')).toEqual([]);
  });
});
```

```ts
// tests/vender.test.ts
import { describe, expect, it } from 'vitest';
import { venderAnswer, venderCompare, venderFaq, venderSteps } from '../src/data/vender';
import { site } from '../src/data/site';

const words = (s: string) => s.trim().split(/\s+/).length;
const allText = [venderAnswer, ...venderSteps.flatMap((s) => [s.title, s.text, s.alt]),
  ...venderCompare.flatMap((r) => [r.aspect, r.withUs, r.alone]), ...venderFaq.flatMap((f) => [f.question, f.answer])];

describe('textos de Vender', () => {
  it('abre con una respuesta autocontenida de 2 o 3 frases', () => {
    const sentences = venderAnswer.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  it('cuenta el proceso en 5 pasos, cada uno con foto y alt', () => {
    expect(venderSteps).toHaveLength(5);
    expect(venderSteps.every((s) => s.image && s.alt.length > 0)).toBe(true);
  });

  it('compara en tiempo, papeles, precio y seguridad, con celdas cortas', () => {
    expect(venderCompare.map((r) => r.aspect)).toEqual(['Tiempo', 'Papeles', 'Precio', 'Seguridad']);
    expect(venderCompare.every((r) => words(r.withUs) <= 12 && words(r.alone) <= 12)).toBe(true);
  });

  it('FAQ con respuestas de 60 palabras como máximo y los cuatro temas del spec', () => {
    expect(venderFaq.every((f) => words(f.answer) <= 60)).toBe(true);
    const questions = venderFaq.map((f) => f.question.toLowerCase()).join(' ');
    for (const topic of ['honorarios', 'cuánto se tarda', 'exclusiva', 'cédula']) expect(questions).toContain(topic);
  });

  it('no publica un porcentaje de honorarios que no tenemos', () => {
    if (site.feePercent === null) expect(venderFaq.some((f) => /\d+(,\d+)?\s?%/.test(f.answer))).toBe(false);
  });

  it('sin rayas como muletilla', () => {
    expect(allText.some((t) => t.includes('—'))).toBe(false);
  });
});
```

- [ ] **Paso 2: ejecutar `npx vitest run tests/blog.test.ts tests/vender.test.ts`.** Deben FALLAR porque los módulos o exports aún no existen.
- [ ] **Paso 3: implementar `postsIn`** en `src/data/blog.ts`, al lado de `findPost`.
- [ ] **Paso 4: escribir `src/data/vender.ts`**, con la voz de la familia y sin datos que no estén en el repo.
  - `venderAnswer`: 2 o 3 frases que respondan a «¿cómo vendo mi piso en el Maresme con Conroma?». Qué hacéis, valoración gratis y hasta dónde acompañáis.
  - `venderSteps`, en este orden y con estas fotos:
    1. Valoración: `src/assets/equipo/boris-conde-jr.jpg`.
    2. Fotos y reforma ligera: la foto copiada a `src/assets/reformas/`.
    3. Difusión en portales y redes: `src/assets/equipo/conroma-91.jpg`.
    4. Visitas: `src/assets/equipo/conroma-102.jpg`.
    5. Arras y notaría: `src/assets/equipo/conroma-82-vertical.jpg`.
  - El `alt` describe lo que se ve en cada foto; nunca dice que es una venta concreta.
  - `venderCompare`: columnas «Con Conroma» y «Por tu cuenta».
  - `venderFaq`:
    - incluye honorarios («¿Cuánto cobráis de honorarios?»: se responde sin cifra, el porcentaje se da por escrito antes de firmar);
    - «¿Cuánto se tarda en vender un piso?»: sin prometer días;
    - «¿Tengo que firmar en exclusiva?»;
    - «¿Necesito la cédula y el certificado energético?»;
    - y se conservan de la página actual «¿Valorar mi piso me compromete a algo?» y «Es un piso heredado, ¿qué hago?».
- [ ] **Paso 5: ejecutar `npx vitest run`.** Todo PASA.
- [ ] **Paso 6: pasar el modo *detectar* de `no-ai-slop`** sobre todo el texto de `vender.ts` y corregir lo marcado. Volver a ejecutar `npx vitest run`.
- [ ] **Paso 7: commit.** `feat(vender): textos de la página y artículos por categoría`.

---

### Task 5: HeroStory y ClosingCTA

**Archivos:**
- Crear: `src/components/sections/HeroStory.astro` y `src/components/sections/ClosingCTA.astro`
- Modificar: `src/styles/sections.css` (bloques `.hero-story` y `.closing-cta`) y `src/pages/es/estilo.astro` (una muestra de cada uno)

**Interfaces:**
- Produce:
  - `<HeroStory crumbs={Crumb[]} title={string} lead={string} image={ImageMetadata} alt={string} cta={{ label: string; href: string }} />`;
  - `<ClosingCTA title={string} text?={string} origin={string} reason?={ContactReason}>` con un slot por defecto que se pinta bajo las acciones.
- Consume: `Breadcrumbs`, `whatsappUrl` y `phoneUrl` de `src/lib/links.ts`, y `ContactReason`.

- [ ] **Paso 1: crear HeroStory.**
  - Foto a sangre con `<Image>` de `astro:assets`: `widths={[390, 780, 1200, 1800]}`, `sizes="100vw"`, `loading="eager"`, `fetchpriority="high"`.
  - Velo `linear-gradient` de transparente a `rgb(0 0 0 / 0.65)` en la mitad inferior; es el único degradado.
  - Breadcrumbs, H1 a `--text-h1`, `lead` y un botón primario sólido. Texto blanco sobre el velo en los dos temas.
  - Altura `min(88svh, 760px)` y contenido anclado abajo.
  - Sin `data-reveal`, sin animación y sin parallax: el parallax opcional del spec se deja fuera en esta fase.
- [ ] **Paso 2: crear ClosingCTA.**
  - H2, `text` opcional y un único CTA primario: WhatsApp con `href={whatsappUrl({ reason })}`, `data-contact="whatsapp"` y `data-origin={origin}`.
  - Debajo, un enlace de texto para llamar: `href={phoneUrl()}`, `data-contact="llamada"`, `data-origin={origin}`, con `site.phoneDisplay` visible.
  - Después, `<slot />`. Fondo plano y sin tarjeta.
- [ ] **Paso 3: añadir una muestra de cada uno a `/es/estilo/`.** Comprobar en el navegador a 390 px y en escritorio, en claro y en oscuro.
  - Sin scroll horizontal.
  - El texto sobre el velo se lee: medir con el cuentagotas el píxel más claro de la foto bajo el H1 frente a blanco, ≥ 4,5:1.
  - El botón de WhatsApp lleva la URL `wa.me`.
- [ ] **Paso 4: ejecutar `npx astro check`.** 0 errores.
- [ ] **Paso 5: commit.** `feat(secciones): HeroStory y ClosingCTA`.

---

### Task 6: StoryScroll (scrollytelling del proceso)

**Archivos:**
- Crear: `src/components/sections/StoryScroll.astro`
- Modificar: `src/styles/sections.css` (bloque `.story-scroll`) y `src/pages/es/estilo.astro` (muestra con `venderSteps`)

**Interfaces:**
- Produce: `<StoryScroll title={string} steps={StoryStep[]} bridge?={string} id?={string} />`.
- Consume: `StoryStep` de `src/data/vender.ts`.

- [ ] **Paso 1: maquetar la versión sin movimiento**, que es la que ve todo el mundo sin soporte.
  - Un `<ol>` donde cada `<li>` lleva:
    - el contador `01/05` con `String(n).padStart(2, '0')`;
    - su foto `<Image loading="lazy" widths={[390, 780]} sizes="(min-width: 60rem) 50vw, 100vw">`;
    - un `<h3>` y un `<p>`.
  - En móvil la foto va encima del texto de cada paso. Esta es la versión completa por defecto en cualquier ancho.
- [ ] **Paso 2: añadir el escenario fijo de escritorio, solo como mejora.**
  - Cada `<li>` lleva `style="view-timeline-name: --paso-N"`.
  - La sección lleva `style="timeline-scope: --paso-1, …, --paso-T"`.
  - Un `<div class="story-scroll__stage" aria-hidden="true">` apila una copia de cada foto (`alt=""`, `loading="lazy"`) en una columna `position: sticky`.
  - El escenario y la ocultación de las fotos por paso solo se activan dentro de `@media (min-width: 60rem) and (prefers-reduced-motion: no-preference)` + `@supports ((animation-timeline: view()) and (animation-range: entry))`.
  - Dentro de ese bloque:
    - la foto N del escenario anima su opacidad de 0 a 1 y de vuelta a 0 con `animation-timeline: --paso-N`;
    - el texto de cada paso pasa de opacidad 0,4 a 1 mientras está centrado (es el paso activo).
  - Los rangos exactos los decide quien construye (spec §10). En móvil el escenario lleva `display: none`, así que sus imágenes lazy no se descargan.
- [ ] **Paso 3: comprobar en `/es/estilo/`.**
  - A 390 px: 5 pasos, cada uno con su foto. Sin scroll horizontal.
  - En escritorio con Chrome: la foto fija cambia con el paso activo.
  - Forzando `prefers-reduced-motion: reduce`, o en un navegador sin `animation-timeline`: se ve la versión del paso 1 completa.
  - `npx astro check`: 0 errores.
- [ ] **Paso 4: commit.** `feat(secciones): StoryScroll con scroll-driven y versión estática completa`.

---

### Task 7: Compare y GuideTeaser

**Archivos:**
- Crear: `src/components/sections/Compare.astro` y `src/components/sections/GuideTeaser.astro`
- Modificar: `src/styles/sections.css` (`.compare` y `.guide-teaser`) y `src/pages/es/estilo.astro` (muestras)

**Interfaces:**
- Produce:
  - `<Compare title={string} columns={[string, string]} rows={CompareRow[]} bridge?={string} />`;
  - `<GuideTeaser title={string} category={string} limit?={number} />`.
- Consume: `CompareRow` de `src/data/vender.ts` y `postsIn` de `src/data/blog.ts`.

- [ ] **Paso 1: crear Compare.**
  - Una `<table>` real con `aria-labelledby` apuntando a su H2.
  - `<th scope="col">` en las dos columnas y `<th scope="row">` en el aspecto.
  - La columna «Con Conroma» se distingue con un borde izquierdo de 2 px `--color-accent`; sin fondo amarillo.
  - Tiene que caber a 390 px sin scroll horizontal; la columna de aspectos va estrecha.
- [ ] **Paso 2: crear GuideTeaser.**
  - Si `postsIn(category, limit)` devuelve `[]`, no renderiza nada.
  - Si hay artículos, una lista de enlaces a `/es/blog/{slug}/`. Cada uno con `<time datetime={date}>` en formato largo es-ES, el título y la `description`.
  - Tarjetas de radio 12 px, borde de 1 px `--color-line` y hover solo de borde.
- [ ] **Paso 3: comprobar en `/es/estilo/` a 390 px** en los dos temas. `GuideTeaser category="No existe"` no deja HTML. `npx astro check`: 0 errores.
- [ ] **Paso 4: commit.** `feat(secciones): Compare y GuideTeaser`.

---

### Task 8: Limpiar FaqSection y ValuationBlock (no-slop)

**Archivos:**
- Modificar: `src/components/sections/FaqSection.astro` (quitar el envoltorio `.card` y el `data-reveal` de la cabecera, y alinear el H2 a la izquierda) y `src/components/sections/ValuationBlock.astro` (quitar el eyebrow «Para propietarios» y cambiar `glass` por una tarjeta sólida `card`)

- Modificar: `ESTANDAR.md` §4 Botón y la regla de vidrio (~línea 252). Se retira la excepción de vidrio sobre foto: los CTA son sólidos también sobre foto (spec §3.1).

Afecta también a las demás páginas que usan estos dos componentes (home, hubs y otras). Es intencionado: así quedan iguales en todo el sitio.

- [ ] **Paso 1: aplicar los cambios.** Después, `grep -n 'eyebrow\|glass' src/components/sections/FaqSection.astro src/components/sections/ValuationBlock.astro`: sin resultados. En `ESTANDAR.md` ya no queda ninguna regla que permita vidrio en botones.
- [ ] **Paso 2: comprobar** `/es/` y `/es/inmobiliaria/malgrat-de-mar/` a 390 px en los dos temas. El formulario de valoración funciona: envía a `/es/valoracion/?…`.
- [ ] **Paso 3: commit.** `refactor(secciones): FAQ y valoración sin eyebrow ni vidrio`.

---

### Task 9: Montar `/es/vender/`

**Archivos:**
- Modificar: `src/pages/es/vender.astro` (se reescribe entera)
- Modificar: `docs/KEYWORDS.md:17` (la fila de Vender pasa a la intención regional, como en el spec §7.0)

**Interfaces:** consume todo lo anterior.
- De `src/data/vender.ts`: `venderAnswer`, `venderSteps`, `venderCompare` y `venderFaq`.
- De `src/data/towns.ts`: `publishedSellerTowns`.
- De `src/lib/seo.ts`: `breadcrumbSchema`, `faqSchema` y `serviceSchema`.

- [ ] **Paso 1: SEO de la página.**
  - Título: `Vender piso o casa en el Maresme`.
  - Descripción de ≤ 155 caracteres con la valoración gratis y el acompañamiento hasta notaría.
  - H1: `Vender tu piso en el Maresme`.
  - Schemas: `breadcrumbSchema(crumbs)`, `faqSchema(venderFaq)` y `serviceSchema('Venta de viviendas', <descripción>, '/es/vender/')`.
  - «Vender piso en {pueblo}» se queda para los hubs: no aparece en el título ni en el H1.
- [ ] **Paso 2: secciones, en este orden.** Cada `bridge` es una frase que anuncia la siguiente sección y pasa por `no-ai-slop`.
  1. `HeroStory`, con `lead={venderAnswer}`, la imagen `src/assets/equipo/conroma-74.jpg` (con el alt de `site.teamPhotos`) y `cta={{ label: '¿Cuánto vale mi piso?', href: '#valoracion' }}`.
  2. `ProofBand`.
  3. `StoryScroll` con `title="Cómo vendemos tu piso"` y `steps={venderSteps}`.
  4. `Compare` con `columns={['Con Conroma', 'Por tu cuenta']}` y `rows={venderCompare}`.
  5. `ValuationBlock`.
  6. `GuideTeaser` con `category="Vender"`.
  7. `FaqSection` con `title="Dudas al vender tu piso"` e `items={venderFaq}`.
  8. `ClosingCTA` con `origin="vender-cierre"` y `reason="valoracion"`. En su slot va un `<nav aria-label="Vender en tu pueblo">` con un enlace `Vender piso en {town.name}` → `/es/inmobiliaria/{town.slug}/` por cada `publishedSellerTowns`.
  - CaseStory no entra (falta el dato del dueño, spec §9.2).
  - `Steps`, `Trust`, `Testimonials` y `ContactSection` salen de la página.
- [ ] **Paso 3: actualizar `docs/KEYWORDS.md:17`.**
  - Principal: `vender piso Maresme`.
  - Secundarias: `vender casa Maresme`, `cómo vender mi piso`, `inmobiliaria para vender`.
  - Nota: «vender piso {pueblo}» → hub.
- [ ] **Paso 4: compilar.** `npx astro dev stop; npx astro check && npx vitest run && npx astro build`: pasa.
- [ ] **Paso 5: comprobar el HTML sin JS** en `dist/client/es/vender/index.html`.
  - `grep -c 'fetchpriority="high"'` → `1`.
  - `grep -c '<h1'` → `1`.
  - `grep -o '/es/inmobiliaria/[a-z-]*/' | sort -u | wc -l` → igual a `publishedSellerTowns.length` (comprobar con `node -e` sobre `towns.ts`, o contando los hubs de `dist/client/es/inmobiliaria/`).
  - `grep -c 'class="eyebrow\|glass'` → `0`.
  - La primera frase de `venderAnswer` y el `107` aparecen en el HTML.
  - Hay un JSON-LD `FAQPage` con tantas preguntas como `venderFaq`.
- [ ] **Paso 6: comprobar en el navegador**, a 390 px y en escritorio, en claro y en oscuro.
  - Sin scroll horizontal.
  - La auditoría de contraste (`scripts/auditoria-contraste.js`) da 0 fallos.
  - Ninguna sección sale dos veces seguida con la misma forma.
  - Hay un solo fondo distinto (ProofBand).
  - Revisar a ojo contra la lista vetada de `no-slop-ui`.
  - Captura de pantalla de cada tema a 390 px como prueba.
- [ ] **Paso 7: commit.** `feat(vender): página completa con historia, cifras reales y enlaces a los hubs`.

---

## Planes siguientes (fuera de este)

Cada uno se escribe cuando le toque, con la librería ya hecha:
1. **Hubs de pueblo:**
   - HeroStory local con las fotos de `src/assets/lugares/`;
   - sección «Cuánto vale un piso en {pueblo}» (recuentos y precio *desde*, con «a fecha de»);
   - StoryScroll corto, QuoteFeature y FAQ local;
   - **créditos de foto visibles** (pie de foto o página `/es/creditos/` enlazada desde el footer), obligatorios desde que se use la primera foto CC BY-SA.
2. **Comprar y Pisos:** HeroSplit, MapTowns y QuoteFeature; el selector Comprar/Alquilar pasa a subrayado.
3. **Alquilar:** bloqueado hasta que el dueño confirme el enfoque al propietario (spec §9.3).
4. **Empresa y Equipo:** las piezas que dependen de los datos de personas e historia (spec §9.6) se omiten mientras falten.
5. **Blog:** plantilla de artículo, índice y clúster Vender (pilar y 4 artículos). Cuando haya volúmenes reales, el resto.
6. **Home:**
   - quitar `--gradient-hero` y el vidrio de `ContactBand` y del hero;
   - revisar Playfair;
   - componer con la librería.
7. **CaseStory**, en cuanto el dueño pase un caso real (spec §9.2).
