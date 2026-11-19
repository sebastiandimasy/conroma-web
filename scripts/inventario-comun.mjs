/**
 * Escritura del inventario, común al feed (fetch-inventory.mjs) y al puente del panel
 * (habitatsoft-panel/sync-panel.mjs): apunta el día de alta de cada ref («Nuevo») y
 * reescribe el volcado que importa el build.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { madridDate, mergeFirstSeen, normRef } from '../src/lib/inventory.ts';

export const OUT = 'src/data/properties.real.json';
const SEEN = 'src/data/property-first-seen.json';
const SEEN_PUBLIC = 'public/data/altas.json';

/** Registro de altas: el publicado en la web (el más al día) o, si no hay, el del repo. */
async function previousFirstSeen(site) {
  try {
    const res = await fetch(`${site}/data/altas.json`, { signal: AbortSignal.timeout(10_000) });
    const data = res.ok ? await res.json() : null;
    if (data && typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length) {
      console.log(`[inventario] altas leídas de ${site}/data/altas.json (${Object.keys(data).length}).`);
      return data;
    }
  } catch {
    // Antes del swipe la web en producción es la antigua y no tiene este archivo.
  }
  return existsSync(SEEN) ? JSON.parse(readFileSync(SEEN, 'utf8')) : {};
}

/** Escribe el inventario y el registro de altas. Devuelve cuántas refs son nuevas hoy. */
export async function escribirInventario(pisos, site) {
  const today = madridDate();
  const seen = mergeFirstSeen(await previousFirstSeen(site), pisos.map((p) => p.ref), today);
  for (const piso of pisos) piso.listedAt = seen[normRef(piso.ref)];
  writeFileSync(OUT, JSON.stringify(pisos, null, 1) + '\n');
  writeFileSync(SEEN, JSON.stringify(seen, null, 1) + '\n');
  mkdirSync('public/data', { recursive: true });
  writeFileSync(SEEN_PUBLIC, JSON.stringify(seen));
  return pisos.filter((p) => p.listedAt === today).length;
}
