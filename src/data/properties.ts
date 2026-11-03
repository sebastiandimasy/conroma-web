import raw from './properties.real.json';
import photoMap from './property-photos.json';
import { findTown } from './towns';

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
const normRef = (ref: string): string => ref.toLowerCase().replace(/[^a-z0-9]/g, '');

const source: Property[] = (raw as Property[]).map((property) => {
  const images = photos[normRef(property.ref)];
  return images && images.length ? { ...property, images, photos: images.length } : property;
});

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
  return `${property.type} en ${property.operation} en ${property.zone}, ${town}`;
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
