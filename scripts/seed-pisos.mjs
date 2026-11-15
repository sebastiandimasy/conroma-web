/**
 * Seed de inventario: vuelca los pisos de src/data/properties.real.json a la tabla `property`
 * de Supabase (y sus fotos a `property_photo`), para poder pasar la web a la fuente Supabase.
 *
 * Idempotente: upsert por `ref`; reinserta las fotos (borra las previas de cada piso antes).
 * Las fotos se guardan como URL completa del CDN de Habitatsoft en `storage_key` (la web lo
 * detecta y las usa tal cual; las que suba el CRM a Storage serán claves del bucket).
 *
 * Uso:  node scripts/seed-pisos.mjs      (o  npm run seed:pisos)
 * Necesita .dev.vars (o .env) con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. No se commitea.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

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

const url = process.env.SUPABASE_URL ?? process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en .dev.vars o .env.');
  process.exit(1);
}

const pisos = JSON.parse(readFileSync('src/data/properties.real.json', 'utf8'));
const photoMap = JSON.parse(readFileSync('src/data/property-photos.json', 'utf8'));
const normRef = (ref) => String(ref).toLowerCase().replace(/[^a-z0-9]/g, '');

const rows = pisos.map((p) => ({
  ref: p.ref,
  operation: p.operation,
  type: p.type,
  town: p.town,
  zone: p.zone,
  price: p.price,
  previous_price: p.previousPrice ?? null,
  rooms: p.rooms ?? 0,
  baths: p.baths ?? 0,
  area: p.area ?? 0,
  floor: p.floor ?? null,
  elevator: p.elevator ?? null,
  parking: p.parking ?? null,
  terrace: p.terrace ?? null,
  state: p.state ?? null,
  tag: p.tag ?? null,
  description: p.description ?? null,
  likes: p.likes ?? null,
  watch_out: p.watchOut ?? null,
  geo_lat: p.geo?.latitude ?? null,
  geo_lng: p.geo?.longitude ?? null,
  status: 'publicado',
}));

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const { data: upserted, error: upErr } = await supabase
  .from('property')
  .upsert(rows, { onConflict: 'ref' })
  .select('id, ref');
if (upErr) {
  console.error('Error al volcar property:', upErr.message);
  process.exit(1);
}
console.log(`property: ${upserted.length} pisos.`);

const idByRef = new Map(upserted.map((r) => [r.ref, r.id]));
const ids = upserted.map((r) => r.id);

// Fotos: borra las previas de estos pisos y reinserta desde el mapa (idempotente).
await supabase.from('property_photo').delete().in('property_id', ids);

const photoRows = [];
for (const p of pisos) {
  const urls = photoMap[normRef(p.ref)] ?? [];
  const id = idByRef.get(p.ref);
  if (!id) continue;
  urls.forEach((u, i) => photoRows.push({ property_id: id, storage_key: u, sort_order: i }));
}

for (let i = 0; i < photoRows.length; i += 500) {
  const chunk = photoRows.slice(i, i + 500);
  const { error } = await supabase.from('property_photo').insert(chunk);
  if (error) {
    console.error('Error al insertar fotos:', error.message);
    process.exit(1);
  }
}
console.log(`property_photo: ${photoRows.length} fotos.`);
console.log('Seed completado. La web usará Supabase en el próximo build (si property no está vacío).');
