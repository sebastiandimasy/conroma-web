import raw from './properties.real.json';
import photoMap from './property-photos.json';
import legacyMap from './property-legacy.json';
import { mergeInventoryItem, normRef } from '../lib/inventory';
import { findTown } from './towns';
import { formatPrice } from '../lib/format';
import type { Lang } from '../i18n';

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
  /** Descripción de Habitatsoft, en español. */
  description: string;
  /** La misma descripción en inglés y catalán si el feed la trae (bloques <Language idlanguage="en|ca">). */
  descriptions?: Partial<Record<'en' | 'ca', string>>;
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

/** Lo que viaja al navegador en un listado: la tarjeta solo pinta la primera foto y ningún
 * texto largo. Pasar el piso entero metía ~435 KB en el HTML de /venta/ (PageSpeed móvil). */
export function forCard(property: Property): Property {
  const { descriptions: _descriptions, ...rest } = property;
  return { ...rest, description: '', images: property.images?.slice(0, 1) };
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

/**
 * Tipos de Habitatsoft (en español) en inglés y catalán, en singular y plural.
 * Un tipo que no esté aquí sale en español: mejor «Torre» que inventar.
 */
const TYPE_NAMES: Record<string, Record<'en' | 'ca', [string, string]>> = {
  piso: { en: ['apartment', 'apartments'], ca: ['pis', 'pisos'] },
  apartamento: { en: ['apartment', 'apartments'], ca: ['apartament', 'apartaments'] },
  estudio: { en: ['studio', 'studios'], ca: ['estudi', 'estudis'] },
  loft: { en: ['loft', 'lofts'], ca: ['loft', 'lofts'] },
  ático: { en: ['penthouse', 'penthouses'], ca: ['àtic', 'àtics'] },
  dúplex: { en: ['duplex', 'duplexes'], ca: ['dúplex', 'dúplexs'] },
  'planta baja': { en: ['ground-floor flat', 'ground-floor flats'], ca: ['planta baixa', 'plantes baixes'] },
  casa: { en: ['house', 'houses'], ca: ['casa', 'cases'] },
  'casa adosada': { en: ['terraced house', 'terraced houses'], ca: ['casa adossada', 'cases adossades'] },
  'casa pareada': { en: ['semi-detached house', 'semi-detached houses'], ca: ['casa aparellada', 'cases aparellades'] },
  'casa unifamiliar': { en: ['detached house', 'detached houses'], ca: ['casa unifamiliar', 'cases unifamiliars'] },
  'casa de campo': { en: ['country house', 'country houses'], ca: ['casa de camp', 'cases de camp'] },
  'casa cueva': { en: ['cave house', 'cave houses'], ca: ['casa cova', 'cases cova'] },
  chalet: { en: ['villa', 'villas'], ca: ['xalet', 'xalets'] },
  'chalet unifamiliar': { en: ['detached villa', 'detached villas'], ca: ['xalet unifamiliar', 'xalets unifamiliars'] },
  bungalow: { en: ['bungalow', 'bungalows'], ca: ['bungalou', 'bungalous'] },
  masia: { en: ['farmhouse', 'farmhouses'], ca: ['masia', 'masies'] },
  'finca rústica': { en: ['rural estate', 'rural estates'], ca: ['finca rústica', 'finques rústiques'] },
  terreno: { en: ['plot', 'plots'], ca: ['terreny', 'terrenys'] },
  parcela: { en: ['plot', 'plots'], ca: ['parcel·la', 'parcel·les'] },
  solar: { en: ['building plot', 'building plots'], ca: ['solar', 'solars'] },
  local: { en: ['commercial premises', 'commercial premises'], ca: ['local', 'locals'] },
  oficina: { en: ['office', 'offices'], ca: ['oficina', 'oficines'] },
  'nave industrial': { en: ['industrial unit', 'industrial units'], ca: ['nau industrial', 'naus industrials'] },
  edificio: { en: ['building', 'buildings'], ca: ['edifici', 'edificis'] },
  restaurante: { en: ['restaurant', 'restaurants'], ca: ['restaurant', 'restaurants'] },
  hotel: { en: ['hotel', 'hotels'], ca: ['hotel', 'hotels'] },
  garaje: { en: ['garage', 'garages'], ca: ['garatge', 'garatges'] },
  parking: { en: ['parking space', 'parking spaces'], ca: ['plaça de pàrquing', 'places de pàrquing'] },
  trastero: { en: ['storage room', 'storage rooms'], ca: ['traster', 'trasters'] },
  inmueble: { en: ['property', 'properties'], ca: ['immoble', 'immobles'] },
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Tipo de inmueble en el idioma de la página, con mayúscula: «Piso» → «Apartment» / «Pis». */
export function typeLabel(type: string, lang: Lang): string {
  if (lang === 'es') return type;
  const names = TYPE_NAMES[type.toLowerCase()]?.[lang];
  return names ? capitalize(names[0]) : type;
}

/** Estados de Habitatsoft («2ª mano», «Buen estado»…) en inglés y catalán. */
const STATE_NAMES: Record<string, Record<'en' | 'ca', string>> = {
  '2ª mano': { en: 'Resale', ca: 'Segona mà' },
  'segunda mano': { en: 'Resale', ca: 'Segona mà' },
  'a estrenar': { en: 'Brand new', ca: 'Per estrenar' },
  'obra nueva': { en: 'New build', ca: 'Obra nova' },
  'en construcción': { en: 'Under construction', ca: 'En construcció' },
  'semi nuevo': { en: 'Nearly new', ca: 'Gairebé nou' },
  'muy buen estado': { en: 'Very good condition', ca: 'Molt bon estat' },
  'buen estado': { en: 'Good condition', ca: 'Bon estat' },
  reformado: { en: 'Renovated', ca: 'Reformat' },
  'a reformar': { en: 'Needs renovating', ca: 'Per reformar' },
  'para reformar': { en: 'Needs renovating', ca: 'Per reformar' },
  consultar: { en: 'Ask us', ca: "Pregunta'ns" },
};

/** Estado del inmueble en el idioma de la página. Lo que no esté en el mapa, en español. */
export function stateLabel(state: string, lang: Lang): string {
  if (lang === 'es') return state;
  return STATE_NAMES[state.trim().toLowerCase().replace(/^de /, '')]?.[lang] ?? state;
}

/** «Piso en venta en …» en cada idioma. `place` ya viene montado (zona y pueblo). */
function titleFor(property: Property, place: string, lang: Lang): string {
  const type = typeLabel(property.type, lang);
  const rent = property.operation === 'alquiler';
  if (lang === 'en') return `${type} ${rent ? 'to rent' : 'for sale'} in ${place}`;
  if (lang === 'ca') return `${type} ${rent ? 'de lloguer' : 'en venda'} a ${place}`;
  return `${property.type} en ${property.operation} en ${place}`;
}

export function propertyTitle(property: Property, lang: Lang): string {
  const town = findTown(property.town)?.name ?? property.town;
  // Zona igual al pueblo (o vacía) salía repetida: «…en Maçanet de la Selva, Maçanet de la Selva».
  // Y «Vilobí d’Onyar, Vilobí d'Onyar»: el apóstrofo tipográfico no cuenta como diferencia.
  const norm = (value: string) => value.trim().toLowerCase().replace(/[’‘`´]/g, "'");
  const place = property.zone && norm(property.zone) !== norm(town) ? `${property.zone}, ${town}` : town;
  return titleFor(property, place, lang);
}

const DOC_TITLE_MAX = 65;

/** <title> de la ficha. Google corta hacia los 65 caracteres: si la zona es larga, se queda el pueblo.
 *  Si otra ficha acaba con el mismo título, se añade la referencia para distinguirlas. */
export function propertyDocTitle(property: Property, listings: Property[], lang: Lang): string {
  const price = (item: Property) => (hasPublicPrice(item) ? ` — ${formatPrice(item.price, lang)}` : '');
  const full = (item: Property) => `${propertyTitle(item, lang)}${price(item)}`;
  const short = (item: Property) => `${titleFor(item, findTown(item.town)?.name ?? item.town, lang)}${price(item)}`;
  const base = (item: Property) => (full(item).length <= DOC_TITLE_MAX ? full(item) : short(item));
  const own = base(property);
  const hasTwin = listings.some((item) => item.ref !== property.ref && base(item) === own);
  if (!hasTwin) return own;
  const suffix = ` · Ref. ${property.ref}`;
  return `${own}${suffix}`.length <= DOC_TITLE_MAX ? `${own}${suffix}` : `${short(property)}${suffix}`;
}

export function propertyUrl(property: Property, lang: Lang): string {
  return `/${lang}/inmueble/${propertySlug(property)}/`;
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

const UNITS = {
  es: { room: ['habitación', 'habitaciones'], bath: ['baño', 'baños'] },
  en: { room: ['bedroom', 'bedrooms'], bath: ['bathroom', 'bathrooms'] },
  ca: { room: ['habitació', 'habitacions'], bath: ['bany', 'banys'] },
} satisfies Record<Lang, Record<'room' | 'bath', [string, string]>>;

/** «3 habitaciones», «1 baño»… en el idioma de la página. */
export function countLabel(count: number, unit: 'room' | 'bath', lang: Lang): string {
  return `${count} ${UNITS[lang][unit][count === 1 ? 0 : 1]}`;
}

/** Datos cortos de la ficha del listado. Sin ceros: un local no tiene «0 habitaciones». */
export function cardFacts(property: Property, lang: Lang): string[] {
  const facts: string[] = [];
  if (property.rooms > 0) facts.push(countLabel(property.rooms, 'room', lang));
  if (property.baths > 0) facts.push(countLabel(property.baths, 'bath', lang));
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

function typeCount(type: string, count: number, lang: Lang): string {
  const names = lang === 'es' ? undefined : TYPE_NAMES[type.toLowerCase()]?.[lang];
  return `${count} ${names ? names[count === 1 ? 0 : 1] : pluralize(type, count)}`;
}

/** Desglose "11 locales · 5 bungalows · 3 parkings" para no prometer lo que no hay. */
export function typeBreakdown(list: Property[], lang: Lang, limit = 3): string {
  const counts = new Map<string, number>();
  for (const property of list) counts.set(property.type, (counts.get(property.type) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([type, count]) => typeCount(type, count, lang))
    .join(' · ');
}
