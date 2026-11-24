/**
 * Pre-build (después de fetch-inventory.mjs): baja las fotos de Habitatsoft y las deja en
 * public/fotos/ en WebP a varios anchos, para servirlas desde nuestro dominio. La foto
 * principal de la ficha y de las tarjetas es el LCP en móvil, y el JPG de 1280 px de su
 * servidor pesaba ~110 KB (PageSpeed de Venta y fichas por debajo de la home).
 *
 * Solo convierte las que faltan: lo ya hecho se queda (los nombres son únicos por foto).
 * Borra las de inmuebles que ya no están. Escribe src/data/fotos-locales.json con las fotos
 * que tienen todos sus tamaños; properties.ts solo cambia esas a la URL propia, así que una
 * foto que no baje sigue saliendo de Habitatsoft. Nunca rompe el build: si algo falla, avisa y sale 0.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { LOCAL_WIDTHS, localPhotoName } from '../src/lib/photos.ts';
import { normRef } from '../src/lib/inventory.ts';

const DIR = 'public/fotos';
const LIST = 'src/data/fotos-locales.json';
const PARALLEL = 8;
const file = (name, width) => `${DIR}/${name}-${width}.webp`;

function photoUrls() {
  // Las mismas que usa properties.ts: las del inventario o, si un inmueble no trae, las del mapa de fotos.
  const map = JSON.parse(readFileSync('src/data/property-photos.json', 'utf8'));
  const urls = [];
  for (const item of JSON.parse(readFileSync('src/data/properties.real.json', 'utf8'))) {
    urls.push(...(item.images?.length ? item.images : (map[normRef(item.ref)] ?? [])));
  }
  const byName = new Map();
  for (const url of urls) {
    const name = localPhotoName(url);
    if (name) byName.set(name, url);
  }
  return byName;
}

async function convert(sharp, name, url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const original = Buffer.from(await res.arrayBuffer());
  for (const width of LOCAL_WIDTHS) {
    await sharp(original)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 200 ? 60 : 72 })
      .toFile(file(name, width));
  }
}

try {
  const sharp = (await import('sharp')).default;
  mkdirSync(DIR, { recursive: true });
  const photos = photoUrls();
  const done = (name) => LOCAL_WIDTHS.every((width) => existsSync(file(name, width)));
  const pending = [...photos].filter(([name]) => !done(name));
  let failed = 0;

  for (let i = 0; i < pending.length; i += PARALLEL) {
    await Promise.all(
      pending.slice(i, i + PARALLEL).map(([name, url]) =>
        convert(sharp, name, url).catch((error) => {
          failed += 1;
          for (const width of LOCAL_WIDTHS) if (existsSync(file(name, width))) unlinkSync(file(name, width));
          console.warn(`[fotos] ${name}: ${error?.message || error}`);
        }),
      ),
    );
    if (pending.length > 50 && (i / PARALLEL) % 10 === 0) console.log(`[fotos] ${Math.min(i + PARALLEL, pending.length)}/${pending.length}`);
  }

  let removed = 0;
  for (const entry of readdirSync(DIR)) {
    const name = entry.replace(/-\d+\.webp$/, '');
    if (!photos.has(name)) {
      unlinkSync(`${DIR}/${entry}`);
      removed += 1;
    }
  }

  const ready = [...photos.keys()].filter(done).sort();
  writeFileSync(LIST, JSON.stringify(ready) + '\n');
  console.log(`[fotos] ${ready.length}/${photos.size} fotos en WebP (${pending.length - failed} nuevas, ${failed} fallos, ${removed} archivos retirados).`);
} catch (error) {
  console.warn('[fotos] no se han podido preparar las fotos propias (' + (error?.message || error) + '): se usan las de Habitatsoft.');
  if (!existsSync(LIST)) writeFileSync(LIST, '[]\n');
}
