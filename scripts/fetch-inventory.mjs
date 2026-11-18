/**
 * Pre-build: trae el inventario FRESCO del feed de Habitatsoft "Enlace Web 2.0" y
 * reescribe src/data/properties.real.json (el volcado que importa el build).
 *
 * Por qué aquí y no en el build: el adaptador Cloudflare prohíbe `fetch()` en el
 * scope global del módulo. Haciéndolo antes, en Node puro, no hay esa restricción.
 *
 * Se ejecuta con `npm run build` (hook `prebuild`). Sin HABITATSOFT_FEED_URL no hace nada
 * (deja el volcado actual). Nunca rompe el build: si el feed falla, avisa y sale 0.
 *
 * Además apunta el día en que cada referencia aparece por primera vez (etiqueta «Nuevo»).
 * Ese registro se publica en /data/altas.json y el siguiente build lo lee de la web en
 * producción, así sobrevive aunque el build se haga en una máquina limpia (GitHub Actions).
 *
 * Usa el mismo parser que la web (src/lib/habitatsoft.ts): Node ≥ 22.18 ejecuta TypeScript.
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseHabitatsoftXml } from '../src/lib/habitatsoft.ts';
import { feedLooksComplete, madridDate, mergeFirstSeen, normRef } from '../src/lib/inventory.ts';

function cargarEnv() {
  for (const archivo of ['.dev.vars', '.env', '.env.local']) {
    if (!existsSync(archivo)) continue;
    for (const linea of readFileSync(archivo, 'utf8').split('\n')) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) continue;
      const i = limpia.indexOf('=');
      if (i < 0) continue;
      const clave = limpia.slice(0, i).trim();
      const valor = limpia.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[clave]) process.env[clave] = valor;
    }
  }
}
cargarEnv();

const FEED = process.env.HABITATSOFT_FEED_URL;
const SITE = process.env.SITE_URL || 'https://conromaasesores.com';
const OUT = 'src/data/properties.real.json';
const SEEN = 'src/data/property-first-seen.json';
const SEEN_PUBLIC = 'public/data/altas.json';

if (!FEED) {
  console.log('[inventario] sin HABITATSOFT_FEED_URL: uso el volcado actual (' + OUT + ').');
  process.exit(0);
}

/** Registro de altas: el publicado en la web (el más al día) o, si no hay, el del repo. */
async function previousFirstSeen() {
  try {
    const res = await fetch(`${SITE}/data/altas.json`, { signal: AbortSignal.timeout(10_000) });
    const data = res.ok ? await res.json() : null;
    if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length) {
      console.log(`[inventario] altas leídas de ${SITE}/data/altas.json (${Object.keys(data).length}).`);
      return data;
    }
  } catch {
    // Antes del swipe la web en producción es la antigua y no tiene este archivo.
  }
  return existsSync(SEEN) ? JSON.parse(readFileSync(SEEN, 'utf8')) : {};
}

/** Lista los campos del feed que podrían ser certificado energético o fecha, para mapearlos. */
function reportCandidateFields(xml) {
  const tags = new Set(xml.match(/<([A-Za-z_][\w]*)[\s>]/g)?.map((t) => t.slice(1, -1)) ?? []);
  const candidates = [...tags].filter((t) => /energ|emisi|consum|certif|calif|fecha|alta|date/i.test(t));
  if (candidates.length) console.log('[inventario] campos a revisar en el feed: ' + candidates.join(', '));
}

try {
  const res = await fetch(FEED, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) {
    console.warn(`[inventario] feed HTTP ${res.status}: dejo el volcado actual.`);
    process.exit(0);
  }
  const xml = await res.text();
  const pisos = parseHabitatsoftXml(xml).filter((p) => p.ref);
  const actuales = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).length : 0;
  if (!feedLooksComplete(pisos.length, actuales)) {
    console.warn(`[inventario] el feed trae ${pisos.length} pisos y hay ${actuales} publicados: parece incompleto, dejo el volcado actual.`);
    process.exit(0);
  }
  reportCandidateFields(xml);

  const today = madridDate();
  const seen = mergeFirstSeen(await previousFirstSeen(), pisos.map((p) => p.ref), today);
  for (const piso of pisos) piso.listedAt = seen[normRef(piso.ref)];

  writeFileSync(OUT, JSON.stringify(pisos, null, 1) + '\n');
  writeFileSync(SEEN, JSON.stringify(seen, null, 1) + '\n');
  mkdirSync('public/data', { recursive: true });
  writeFileSync(SEEN_PUBLIC, JSON.stringify(seen));
  const nuevos = pisos.filter((p) => p.listedAt === today).length;
  console.log(`[inventario] feed de Habitatsoft OK: ${pisos.length} pisos (${nuevos} nuevos hoy) en ${OUT}.`);
} catch (e) {
  console.warn('[inventario] feed no disponible (' + (e?.message || e) + '): dejo el volcado actual.');
  process.exit(0);
}
