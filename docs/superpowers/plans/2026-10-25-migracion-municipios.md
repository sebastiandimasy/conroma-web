# Reactivación de municipios SEO (migración sin feed) — Implementation Plan

> **ESTADO: COMPLETO (2026-10-27).** Tareas 1–3 hechas y con tests verdes (towns, redirects, seo).
> Commits omitidos: el repo no es git. Fuera de alcance (bloqueado por el feed): venta por pueblo con inventario real.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada municipio que rankeaba en la web antigua tenga una página propia que trate su intención local, en vez de caer al genérico `/es/comprar/`, sin inventar inventario.

**Architecture:** Los 4 municipios con presencia SEO que hoy no publican página (Pineda de Mar, Calella, Santa Susanna, Palafolls) ya existen en `src/data/towns.ts` pero con copy vacío, así que `publishedSellerTowns` los excluye. Rellenando su copy real entran en `/es/inmobiliaria/<town>/` (captación, no necesita inventario). Luego sus redirecciones antiguas apuntan a esa página, y los listados ganan schema `CollectionPage`.

**Tech Stack:** Astro (estático), TypeScript, Vitest, Cloudflare Pages `_redirects`.

**Spec:** `tasks/analysis/06-migracion.md` (con `ESTANDAR.md` como norma de marca).

## Global Constraints

- Copy en **español**, voz Conroma: familiar, de pueblo, directa; sin cola aspiracional ni cifras sin fuente (`ESTANDAR §2`).
- **Dato real siempre.** Estas páginas describen el servicio en el pueblo, no datos de mercado; no se inventan €/m², nº de pisos ni estadísticas.
- `trailingSlash: 'always'` — toda regla de redirección cubre la variante con y sin `/`.
- En `_redirects` (Cloudflare) **gana la primera regla que coincide**: lo específico va antes que el comodín.
- `npm run build` y `npm test` pasan al cerrar cada tarea.
- Sin hex fuera de `tokens.css`; verificado a 390px si se toca UI (aquí no se toca).

## Review Focus

- **Slug antiguo con `_` sin regla propia** (p.ej. `macanet_de_la_selva`): debe seguir cayendo al comodín de respaldo, nunca 404. → test en Tarea 2 que el comodín `/buscador/*` y `/detalle/*` sigue presente y último.
- **Municipio reactivado sin inventario**: su `/es/venta/<town>/` NO debe generarse (quedaría vacío); solo `/es/inmobiliaria/<town>/`. → test en Tarea 1 que `publishedCatalogTowns` no cambia.
- **Orden de reglas**: la regla específica del pueblo debe preceder al comodín, o Cloudflare sirve el comodín. → test en Tarea 2 del índice de línea.
- **Doble redirección**: el destino `/es/inmobiliaria/<town>/` debe existir (200), no ser a su vez otra redirección. → verificado en build de Tarea 1.
- **`collectionPageSchema` no debe romper el JSON-LD existente** (agentSchema/breadcrumb en la misma página). → test en Tarea 3 de forma del objeto.

---

### Task 1: Reactivar los 4 municipios con copy real

**Files:**
- Modify: `src/data/towns.ts` (las 4 entradas de línea ~40–43)
- Test: `tests/towns.test.ts` (crear)

**Interfaces:**
- Consumes: `towns`, `publishedSellerTowns`, `publishedCatalogTowns` de `src/data/towns.ts`.
- Produces: `publishedSellerTowns` ahora incluye `pineda-de-mar`, `santa-susanna`, `palafolls`, `calella`.

- [x] **Step 1: Escribir el test que falla** en `tests/towns.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { publishedSellerTowns, publishedCatalogTowns } from '../src/data/towns';

const slugs = (list: { slug: string }[]) => list.map((t) => t.slug);

it('publishedSellerTowns incluye los 4 municipios reactivados', () => {
  for (const s of ['pineda-de-mar', 'santa-susanna', 'palafolls', 'calella']) {
    expect(slugs(publishedSellerTowns)).toContain(s);
  }
});

it('publishedCatalogTowns no cambia (solo malgrat tiene inventario)', () => {
  expect(slugs(publishedCatalogTowns)).toEqual(['malgrat-de-mar']);
});
```

- [x] **Step 2: Correr y ver que falla** — RED confirmado (1 test falló: los 4 slugs no estaban en publishedSellerTowns).

- [x] **Step 3: Rellenar `intro`, `sellerIntro` y `buyerIntro`** de las 4 entradas en `src/data/towns.ts` — copy real de servicio en voz Conroma, geografía del Alt Maresme, sin cifras de mercado, variando la forma (no misma plantilla).

- [x] **Step 4: Correr y ver que pasa** — `towns.test.ts` 2/2 verde; suite 26/26; `npm run build` genera las 4 páginas en `dist/client/es/inmobiliaria/` (37 páginas totales).

- [~] **Step 5: Commit** — N/A: este repo **no es git**. Pendiente de `git init` si el usuario lo quiere.

---

### Task 2: Redirecciones precisas para los 4 municipios

**Files:**
- Modify: `public/_redirects` (añadir reglas antes del comodín `/buscador/*` y `/detalle/*`)
- Test: `tests/redirects.test.ts` (crear)

**Interfaces:**
- Consumes: `public/_redirects` como texto.
- Produces: reglas `/detalle/:op/:tipo/:prov/<slug>/*` y `/buscador/:op/:tipo/:prov/<slug>/*` → `/es/inmobiliaria/<slug-guiones>/` para los 4 municipios (slug antiguo con `_`).

- [ ] **Step 1: Escribir el test que falla** en `tests/redirects.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const file = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
const lines = file.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
const idx = (needle: string) => lines.findIndex((l) => l.includes(needle));

const casos = [
  ['pineda_de_mar', '/es/inmobiliaria/pineda-de-mar/'],
  ['calella', '/es/inmobiliaria/calella/'],
  ['santa_susanna', '/es/inmobiliaria/santa-susanna/'],
  ['palafolls', '/es/inmobiliaria/palafolls/'],
] as const;

it('cada municipio reactivado redirige a su página de captación', () => {
  for (const [slug, dest] of casos) {
    const r = lines.find((l) => l.includes('/detalle/') && l.includes(slug));
    expect(r, slug).toContain(dest);
  }
});

it('la regla específica precede al comodín de respaldo', () => {
  for (const [slug] of casos) {
    expect(idx(`/detalle/:op/:tipo/:prov/${slug}/`)).toBeLessThan(idx('/detalle/*'));
  }
});

it('el comodín de respaldo sigue existiendo (no 404 para municipios sin regla)', () => {
  expect(idx('/detalle/*')).toBeGreaterThan(-1);
  expect(idx('/buscador/*')).toBeGreaterThan(-1);
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run tests/redirects.test.ts`
Expected: FAIL (no hay reglas para pineda/calella/santa_susanna/palafolls).

- [ ] **Step 3: Añadir las 8 reglas** en `public/_redirects`

En la sección de fichas (antes de `/detalle/*`) y en la de buscador (antes de `/buscador/*`), una pareja `detalle`+`buscador` por municipio, siguiendo el formato de las reglas de blanes/tordera/lloret ya presentes. Destino: `/es/inmobiliaria/<slug-con-guiones>/`.

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run tests/redirects.test.ts` → PASS

- [ ] **Step 5: Commit**

```bash
git add public/_redirects tests/redirects.test.ts
git commit -m "feat(seo): redirigir municipios reactivados a su captación en vez del genérico"
```

---

### Task 3: Schema CollectionPage en los listados de pueblo

**Files:**
- Modify: `src/lib/seo.ts` (añadir `collectionPageSchema`)
- Modify: `src/pages/es/venta/[town].astro` (pasar el schema a `BaseLayout`)
- Test: `tests/seo.test.ts` (añadir casos)

**Interfaces:**
- Consumes: `absoluteUrl` de `src/lib/seo.ts`.
- Produces: `collectionPageSchema(name: string, path: string) => { '@context', '@type': 'CollectionPage', name, url }`.

- [ ] **Step 1: Escribir el test que falla** en `tests/seo.test.ts`

```ts
it('construye un CollectionPage con url absoluta', () => {
  const s = collectionPageSchema('Pisos en venta en Malgrat de Mar', '/es/venta/malgrat-de-mar/');
  expect(s['@type']).toBe('CollectionPage');
  expect(s.url).toBe('https://conromaasesores.com/es/venta/malgrat-de-mar/');
});
```
(añadir `collectionPageSchema` al import de la cabecera del test).

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run tests/seo.test.ts`
Expected: FAIL ("collectionPageSchema is not a function").

- [ ] **Step 3: Implementar `collectionPageSchema(name, path)`** en `src/lib/seo.ts`

Devuelve `{ '@context': 'https://schema.org', '@type': 'CollectionPage', name, url: absoluteUrl(path) }`.

- [ ] **Step 4: Emitir el schema** en `src/pages/es/venta/[town].astro`

En el array `schemas` del `BaseLayout` de esa página, añadir `collectionPageSchema(\`Pisos en venta en ${town.name}\`, path)` junto a los `breadcrumbSchema`/`faqSchema` ya presentes.

- [ ] **Step 5: Correr y ver que pasa**

Run: `npx vitest run tests/seo.test.ts` → PASS
Run: `npm run build` → PASS; `curl` del html de un listado contiene `"@type":"CollectionPage"`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/pages/es/venta/[town].astro tests/seo.test.ts
git commit -m "feat(seo): CollectionPage schema en los listados de pueblo"
```

---

## Notas de cierre

- **Fuera de alcance (bloqueado por el feed Habitatsoft):** páginas de *venta* por pueblo con inventario real, facetas por tipo (`/es/venta/<town>/<tipo>/`), fichas vivas y €/m². Van en un plan posterior cuando haya feed (ver `tasks/analysis/06-migracion.md §8`).
- **Ya correcto, no se toca:** canonical autoreferente (`BaseLayout` usa `absoluteUrl(path)`), red anti-404 del `_redirects`, `sameAs` en `agentSchema`.
