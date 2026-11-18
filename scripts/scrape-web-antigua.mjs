#!/usr/bin/env node
/**
 * Lee la web antigua (www.conromaasesores.com, la genera Habitatsoft) y guarda por referencia:
 *  - el id de la ficha antigua, para redirigir /detalle/.../<id> a la ficha nueva 1:1;
 *  - el certificado energético, que el Excel de inventario no trae;
 *  - si sigue publicada (sale en el buscador), para detectar inventario desfasado.
 *
 * El id sale de las URLs de las fotos (fotoshs.imghs.net/.../527526/<id>/...).
 * Es un puente hasta tener el feed de Habitatsoft; deja de servir cuando se apague la web antigua.
 *
 *   node scripts/scrape-web-antigua.mjs [carpeta-cache]
 *
 * Escribe src/data/property-legacy.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = 'https://www.conromaasesores.com';
const AGENCY = '527526';
const cache = process.argv[2] ?? null;
if (cache) mkdirSync(cache, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, cacheName) {
  const file = cache && cacheName ? join(cache, cacheName) : null;
  if (file && existsSync(file)) return readFileSync(file, 'utf8');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = res.ok ? await res.text() : '';
  if (file) writeFileSync(file, html);
  await sleep(400);
  return html;
}

const photos = JSON.parse(readFileSync('src/data/property-photos.json', 'utf8'));
const idPattern = new RegExp(`/${AGENCY}/(\\d+\\.${AGENCY})/`);
const ids = Object.fromEntries(
  Object.entries(photos)
    .map(([ref, urls]) => [ref, (urls[0] ?? '').match(idPattern)?.[1]])
    .filter(([, id]) => id),
);

// Lo que está publicado hoy: todas las páginas del buscador de venta y alquiler.
const live = new Set();
const idsIn = (html) => html.match(new RegExp(`\\d{8,}\\.${AGENCY}`, 'g')) ?? [];
for (const op of ['en_venta', 'en_alquiler']) {
  for (let page = 0; page < 30; page++) {
    const before = live.size;
    idsIn(await get(`${ORIGIN}/buscador/${op}/?Pagina=${page}`)).forEach((id) => live.add(id));
    if (live.size === before) break;
  }
}

const out = {};
for (const [ref, id] of Object.entries(ids)) {
  const html = await get(`${ORIGIN}/detalle/inmueble/${id}`, `${id}.html`);
  const block = html.match(/<li class="contCert">([\s\S]*?)<\/li>/)?.[1] ?? '';
  const status = block.match(/<div class="emisiones">\s*<div>([^<]*)<\/div>/)?.[1]?.trim() ?? '';
  const consumption = block.match(/arrowCE consumo ([A-G])[\s\S]*?<div class="content">\s*([\d.,]+)/);
  const emissions = block.match(/arrowCE emision ([A-G])[\s\S]*?<div class="content">\s*([\d.,]+)/);
  const number = (m) => (m ? Number(m[2].replace(',', '.')) : undefined);
  const entry = { legacyId: id, published: live.has(id) && Boolean(html) };
  if (status === 'Disponible' && emissions) {
    entry.energyRating = emissions[1];
    entry.energyEmissions = number(emissions);
    if (consumption) {
      entry.energyConsumptionRating = consumption[1];
      entry.energyConsumption = number(consumption);
    }
  } else if (status === 'Exento') entry.energyExempt = true;
  else if (/tr[aá]mite/i.test(status)) entry.energyPending = true;
  out[ref] = entry;
}

writeFileSync('src/data/property-legacy.json', JSON.stringify(out, null, 1) + '\n');
const v = Object.values(out);
console.log(
  `[web antigua] ${v.length} fichas con id · publicadas ${v.filter((x) => x.published).length} · ` +
    `letra ${v.filter((x) => x.energyRating).length} · exentas ${v.filter((x) => x.energyExempt).length} · ` +
    `en trámite ${v.filter((x) => x.energyPending).length} · publicadas allí y no aquí ${[...live].filter((id) => !Object.values(ids).includes(id)).length}`,
);
