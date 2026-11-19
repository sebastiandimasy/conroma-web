import raw from './properties.real.json';
import photoMap from './property-photos.json';
import legacyMap from './property-legacy.json';
import { mergeInventoryItem, normRef } from '../lib/inventory';
import { findTown } from './towns';
import { formatPrice } from '../lib/format';

export interface Property {
  ref: string;
  operation: 'venta' | 'alquiler';
  type: string;
  town: string;
  zone: string;
  price: number;
  previousPrice: number | null;
  rooms: number;
  baths: number;
  area: number;
  floor: number;
  elevator: boolean;
  parking: boolean;
  terrace: boolean;
  state: string;
  tag: string;
  likes: string;
  watchOut: string;
  description: string;
  photos: number;
  tone: number;
  images?: string[];
  /** Coordenadas reales del piso (del feed). Si faltan, el mapa usa el centro del pueblo. */
  geo?: { latitude: number; longitude: number };

  /* --- Datos exigidos por ley en la publicidad. Ver docs/LEGAL-ANUNCIOS.md --- */

  /** Letra A-G del certificado de eficiencia energética.
   *  Obligatoria en TODA publicidad de venta y alquiler: RD 390/2021, arts. 15.2 y 17.3.
   *  Omitirla son 300-600 € (estatal) y otra leve de 3.000-9.000 € en Cataluña
   *  (art. 125.2.c Ley 18/2007). El dato está en Habitatsoft: hay que traerlo al feed. */
  energyRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  /** Consumo kWh/m²·año y emisiones kgCO2/m²·año, si se conocen. energyRating es la letra de emisiones. */
  energyConsumption?: number;
  energyConsumptionRating?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  energyEmissions?: number;
  /** Inmuebles legalmente exentos de certificado (p. ej. parkings o trasteros sueltos). */
  energyExempt?: boolean;
  /** Certificado encargado y aún sin emitir (así lo publica la agencia en Habitatsoft). */
  energyPending?: boolean;
  /** Id de la ficha en la web antigua (/detalle/inmueble/<id>), para la 301 a la ficha nueva. */
  legacyId?: string;
  /** Viene del feed de Habitatsoft (y no del Excel): el feed es la verdad de lo publicado. */
  fromFeed?: boolean;
  /** Día (YYYY-MM-DD) en que apareció por primera vez en el feed. Da la etiqueta «Nuevo». */
  listedAt?: string;

  /** Solo alquiler de VIVIENDA en zona de mercado residencial tensionado.
   *  Art. 59.g y 61.2.f de la Ley 18/2007: hay que publicar el precio máximo que
   *  resulta del índice de referencia, o la última renta de los últimos 5 años.
   *  No hacerlo es infracción GRAVE: 9.001-90.000 € (art. 124.2.n). */
  rentIndexMax?: number;
  /** Art. 59.h: condición de gran tenedor del propietario, también solo en alquiler
   *  en zona tensionada. En Malgrat el umbral son 5+ inmuebles residenciales. */
  largeHolder?: boolean;
}

export type Operation = Property['operation'];

/**
 * Costura de inventario: TODA lectura de pisos pasa por getListings/getListing.
 * La fuente es properties.real.json (volcado del Excel de inventario, sin fotos aún);
 * el día que llegue el feed de Habitatsoft, solo cambia esta constante `source`
 * (y un parser XML→Property), sin tocar páginas.
 */
// Fotos reales por referencia (galerías del CDN de Habitatsoft, por ref normalizada).
const photos = photoMap as Record<string, string[]>;

/**
 * Fuente del inventario: `properties.real.json`, que el script de pre-build
 * `scripts/fetch-inventory.mjs` reescribe con el feed de Habitatsoft ANTES de cada build
 * (hook `prebuild` en package.json). Se hace antes a propósito: el adaptador Cloudflare
 * prohíbe `fetch()` en el scope global de un módulo, así que leer el feed aquí fallaría
 * siempre y caería al volcado. Para pasar a Supabase/CRM como fuente, esa rama va en el
 * script, no aquí.
 */
const inventory = raw as Property[];

// Partículas que van en minúscula dentro de un nombre propio, y palabras que el feed escribe sin tilde.
const SMALL_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'els', 'les', 'i', 'y']);
const ACCENTED: Record<string, string> = { urbanizacion: 'urbanización', nucleo: 'núcleo' };

/** Zona tal y como se lee: el feed trae algunas en mayúsculas («SANT LLOP») y el
    acento agudo como apóstrofo («d´Onyar»). Lo que ya viene bien escrito no se toca. */
export function tidyZone(zone: string): string {
  const fixed = zone.replace(/´/g, '’');
  if (fixed !== fixed.toUpperCase()) return fixed;
  return fixed
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      const accented = ACCENTED[word] ?? word;
      return index > 0 && SMALL_WORDS.has(word) ? word : accented.charAt(0).toUpperCase() + accented.slice(1);
    })
    .join(' ');
}

// Certificado energético e id antiguo por referencia, leídos de la web antigua
// (scripts/scrape-web-antigua.mjs) hasta que el feed de Habitatsoft los traiga.
const legacy = legacyMap as Record<string, Partial<Property> & { published?: boolean }>;

const withPhotos: Property[] = inventory.map((item) => {
  const key = normRef(item.ref);
  return { ...mergeInventoryItem(item, legacy[key], photos[key]), zone: tidyZone(item.zone) };
});

/**
 * Filtro legal de publicación.
 *
 * Malgrat de Mar, Lloret y Blanes están declarados ZONA DE MERCADO RESIDENCIAL
 * TENSIONADO (Resolución TER/800/2024; BOE-A-2024-5214), vigente hasta el
 * 16-03-2027. Publicitar allí el ALQUILER de una vivienda obliga a indicar
 * (art. 59.g y 59.h de la Ley 18/2007):
 *   · el precio máximo que resulta del índice de referencia, o la última renta
 *     de los últimos cinco años, y
 *   · si el propietario es gran tenedor (umbral en la zona: 5+ viviendas).
 *
 * Omitirlo es infracción GRAVE: 9.001-90.000 € (art. 124.2.n).
 *
 * Hoy no tenemos ninguno de los dos datos, así que una vivienda en alquiler sin
 * ellos NO sale publicada. Son 2 fichas de 126 y ninguna tiene fotos, de modo
 * que el coste comercial es nulo frente a la multa. En cuanto el dato esté en
 * el feed, estas fichas vuelven solas.
 *
 * Los locales, parkings y trasteros no son vivienda: no les aplica.
 */
const VIVIENDA = new Set(['Piso', 'Ático', 'Dúplex', 'Casa', 'Chalet', 'Bungalow', 'Masia', 'Casa de campo', 'Casa adosada', 'Chalet unifamiliar', 'Casa unifamiliar', 'Casa cueva']);

export function faltanDatosDeAlquilerTensionado(property: Property): boolean {
  if (property.operation !== 'alquiler') return false;
  if (!VIVIENDA.has(property.type)) return false;
  return property.rentIndexMax == null || property.largeHolder == null;
}

/**
 * La única fuente de inmuebles de todo el sitio.
 *
 * Hoy es el volcado del inventario. Cuando la Fase 1 del CRM esté entera se
 * cambia `site.inventarioDesde` a `'supabase'` y esta constante pasa a leer la
 * tabla `property` con `web_visibility = 'publicado'`. Si algo va mal, se
 * vuelve a `'json'` y la web sigue sirviendo fichas: el catálogo público no
 * depende de que el CRM funcione.
 */
// El Excel de inventario está desfasado: lo que Habitatsoft ya no publica en la web antigua
// (vendido, retirado o reservado) tampoco sale aquí. Los que no tienen id antiguo se quedan.
// Si el inventario viene del feed, el feed ya es lo publicado y este filtro no aplica.
const retirada = (property: Property): boolean => !property.fromFeed && legacy[normRef(property.ref)]?.published === false;

/** Fuera porque Habitatsoft ya no las publica (ver scripts/scrape-web-antigua.mjs). */
export const retiradasEnHabitatsoft: Property[] = withPhotos.filter(retirada);

const source: Property[] = withPhotos.filter((property) => !faltanDatosDeAlquilerTensionado(property) && !retirada(property));

/** Las que se quedan fuera por el filtro de arriba, para poder avisar en el panel. */
export const retenidasPorLey: Property[] = withPhotos.filter(faltanDatosDeAlquilerTensionado);

/** @deprecated Usa getListings(). Se mantiene por el tipo/compatibilidad. */
export const properties = source;

export interface ListingFilter {
  town?: string;
  operation?: Operation;
}

export function getListings(filter: ListingFilter = {}): Property[] {
  return source.filter(
    (property) =>
      (filter.town === undefined || property.town === filter.town) &&
      (filter.operation === undefined || property.operation === filter.operation),
  );
}

export function getListing(slug: string): Property | undefined {
  return source.find((property) => propertySlug(property) === slug);
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function propertySlug(property: Property): string {
  // La referencia también se sanea: el inventario trae valores con espacios
  // ("L - 1045 - H", "B-0045-A PLA") que antes salían tal cual en la URL.
  const base = slugify(`${property.type}-${property.zone}-${property.town}`);
  return `${base}-${slugify(property.ref)}`;
}

export function propertyTitle(property: Property): string {
  const town = findTown(property.town)?.name ?? property.town;
  // Zona igual al pueblo (o vacía) salía repetida: «…en Maçanet de la Selva, Maçanet de la Selva».
  // Y «Vilobí d’Onyar, Vilobí d'Onyar»: el apóstrofo tipográfico no cuenta como diferencia.
  const norm = (value: string) => value.trim().toLowerCase().replace(/[’‘`´]/g, "'");
  const place = property.zone && norm(property.zone) !== norm(town) ? `${property.zone}, ${town}` : town;
  return `${property.type} en ${property.operation} en ${place}`;
}

const DOC_TITLE_MAX = 65;

/** <title> de la ficha. Google corta hacia los 65 caracteres: si la zona es larga, se queda el pueblo.
 *  Si otra ficha acaba con el mismo título, se añade la referencia para distinguirlas. */
export function propertyDocTitle(property: Property, listings: Property[]): string {
  const price = (item: Property) => (hasPublicPrice(item) ? ` — ${formatPrice(item.price)}` : '');
  const full = (item: Property) => `${propertyTitle(item)}${price(item)}`;
  const short = (item: Property) => `${item.type} en ${item.operation} en ${findTown(item.town)?.name ?? item.town}${price(item)}`;
  const base = (item: Property) => (full(item).length <= DOC_TITLE_MAX ? full(item) : short(item));
  const own = base(property);
  const hasTwin = listings.some((item) => item.ref !== property.ref && base(item) === own);
  if (!hasTwin) return own;
  const suffix = ` · Ref. ${property.ref}`;
  return `${own}${suffix}`.length <= DOC_TITLE_MAX ? `${own}${suffix}` : `${short(property)}${suffix}`;
}

export function propertyUrl(property: Property): string {
  return `/es/inmueble/${propertySlug(property)}/`;
}

export function propertiesIn(town: string, operation: Operation): Property[] {
  return getListings({ town, operation });
}

/**
 * Tipos que una persona entiende por "vivienda". El resto de la cartera (locales,
 * terrenos, parkings, garajes, restaurantes) es real y se publica, pero no se puede
 * contar como piso: en Malgrat hay 23 inmuebles y solo 1 es un piso.
 */
const HOME_TYPES = new Set([
  'Piso',
  'Ático',
  'Dúplex',
  'Casa',
  'Casa adosada',
  'Casa unifamiliar',
  'Casa de campo',
  'Casa cueva',
  'Chalet',
  'Chalet unifamiliar',
  'Bungalow',
  'Masia',
]);

export function isHome(property: Property): boolean {
  return HOME_TYPES.has(property.type);
}

export function homesIn(town: string, operation: Operation): Property[] {
  return propertiesIn(town, operation).filter(isHome);
}

/**
 * El inventario trae algún inmueble con precio simbólico (10 €) para decir
 * "precio a consultar". Mostrarlo tal cual sale como "10 €" en la tarjeta y
 * hunde cualquier "desde X €".
 */
const MIN_REAL_PRICE = 1000;

export function hasPublicPrice(property: Property): boolean {
  return property.price >= MIN_REAL_PRICE;
}

/** Datos cortos de la ficha del listado. Sin ceros: un local no tiene «0 habitaciones». */
export function cardFacts(property: Property): string[] {
  const facts: string[] = [];
  if (property.rooms > 0) facts.push(`${property.rooms} ${property.rooms === 1 ? 'habitación' : 'habitaciones'}`);
  if (property.baths > 0) facts.push(`${property.baths} ${property.baths === 1 ? 'baño' : 'baños'}`);
  if (property.area > 0) facts.push(`${property.area} m²`);
  return facts;
}

/** Precio más bajo real de una lista. `null` si ninguno tiene precio público. */
export function cheapestPrice(list: Property[]): number | null {
  const prices = list.filter(hasPublicPrice).map((property) => property.price);
  return prices.length ? Math.min(...prices) : null;
}

/** Plural de una palabra suelta: casa→casas, local→locales, parking→parkings, dúplex→dúplex. */
function pluralWord(word: string): string {
  if (/[xs]$/.test(word)) return word; // dúplex, lunes: invariables
  if (/[aeiouáéíóú]$/.test(word)) return `${word}s`;
  if (/z$/.test(word)) return word.replace(/z$/, 'ces');
  // -l, -n, -r, -d, -j hacen -es; el resto suelen ser extranjerismos (parking, chalet).
  if (/[lnrdj]$/.test(word)) return `${word}es`;
  return `${word}s`;
}

const PREPOSITIONS = new Set(['de', 'del', 'en', 'la', 'el', 'para', 'con']);

/**
 * Plural de un tipo que puede traer adjetivo: "casa adosada"→"casas adosadas",
 * "chalet unifamiliar"→"chalets unifamiliares", "casa de campo"→"casas de campo".
 */
function pluralize(type: string, count: number): string {
  const words = type.toLowerCase().split(/\s+/);
  if (count === 1) return words.join(' ');
  const out: string[] = [];
  let stop = false;
  for (const word of words) {
    if (PREPOSITIONS.has(word)) stop = true;
    out.push(stop ? word : pluralWord(word));
  }
  return out.join(' ');
}

/** Desglose "11 locales · 5 bungalows · 3 parkings" para no prometer lo que no hay. */
export function typeBreakdown(list: Property[], limit = 3): string {
  const counts = new Map<string, number>();
  for (const property of list) counts.set(property.type, (counts.get(property.type) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([type, count]) => `${count} ${pluralize(type, count)}`)
    .join(' · ');
}
