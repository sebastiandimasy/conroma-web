/**
 * Pre-build: trae el inventario FRESCO del feed de Habitatsoft "Enlace Web 2.0" y
 * reescribe src/data/properties.real.json (el volcado que importa el build).
 *
 * Por qué aquí y no en el build: el adaptador Cloudflare prohíbe `fetch()` en el
 * scope global del módulo, así que el fetch dentro de loadInventory() SIEMPRE falla y
 * cae al JSON. Haciéndolo antes, en Node puro, no hay esa restricción.
 *
 * Se ejecuta solo con `npm run build` (hook `prebuild`). Sin HABITATSOFT_FEED_URL no
 * hace nada (deja el volcado actual). Nunca rompe el build: si el feed falla, avisa y sale 0.
 *
 * Fuente por ahora: Habitatsoft. Cuando el inventario se gestione en el CRM/Supabase,
 * se añade aquí esa rama (o se cambia la fuente).
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

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
const OUT = 'src/data/properties.real.json';

if (!FEED) {
  console.log('[inventario] sin HABITATSOFT_FEED_URL: uso el volcado actual (' + OUT + ').');
  process.exit(0);
}

// --- Parser del feed Habitatsoft (mismo mapeo que src/lib/habitatsoft.ts) ---
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', trimValues: true });
const text = (v) => (v === null || v === undefined || typeof v === 'object' ? '' : String(v).trim());
const num = (v) => { const n = Number(text(v).replace(',', '.')); return Number.isFinite(n) ? n : 0; };
const bool01 = (v) => text(v) === '1';
const asArray = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
const townSlug = (name) => text(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const operationFrom = (op) => (/alquiler|lloguer|rent|louer|miet/i.test(op) ? 'alquiler' : 'venta');
const spanishBlock = (it) => { const l = asArray(it?.LanguageData?.Language); return l.find((x) => x?.idlanguage === 'es') ?? l[0] ?? {}; };
const photosOf = (it) => asArray(it?.Medias?.Fotos?.Foto).map(text).filter((u) => u.startsWith('http'));

function parse(xml) {
  const data = parser.parse(xml);
  return asArray(data?.WEB?.Inmuebles?.Inmueble).map((it) => {
    const es = spanishBlock(it);
    const rooms = Number(text(it.TotalHab)) || num(it.NumHabDobles) + num(it.NumHabSencillas);
    const lat = num(it.Latitud);
    const lng = num(it.Longitud);
    const images = photosOf(it);
    const piso = {
      ref: text(it.NumeroExpediente) || text(it.IdInmueble),
      operation: operationFrom(text(es.txt_NombreOperacion)),
      type: text(es.txt_NombreTipoInmueble) || 'Inmueble',
      town: townSlug(text(it.NombreMunicipio)),
      zone: text(it.NombreZona) || text(it.NombreMunicipio),
      price: num(it.Precio1Euros),
      previousPrice: null,
      rooms,
      baths: num(it.NumBanos) + num(it.NumAseos),
      area: Math.round(num(it.SuperficieTotal)),
      floor: num(it.AlturaPiso),
      elevator: bool01(it.box_Ascensor),
      parking: bool01(it.box_Garaje),
      terrace: bool01(it.box_Terraza),
      state: text(es.txt_Estado) || 'Consultar',
      tag: '',
      likes: '',
      watchOut: '',
      description: text(es.txt_FrasePublicitaria) || text(es.txt_DetalleAlternativo),
      photos: images.length,
      tone: 1,
      images,
    };
    if (lat && lng) piso.geo = { latitude: lat, longitude: lng };
    return piso;
  });
}

try {
  const res = await fetch(FEED);
  if (!res.ok) { console.warn(`[inventario] feed HTTP ${res.status}: dejo el volcado actual.`); process.exit(0); }
  const pisos = parse(await res.text());
  if (!pisos.length) { console.warn('[inventario] el feed vino vacío: dejo el volcado actual.'); process.exit(0); }
  writeFileSync(OUT, JSON.stringify(pisos, null, 1) + '\n');
  console.log(`[inventario] feed de Habitatsoft OK: ${pisos.length} pisos escritos en ${OUT}.`);
} catch (e) {
  console.warn('[inventario] feed no disponible (' + (e?.message || e) + '): dejo el volcado actual.');
  process.exit(0);
}
