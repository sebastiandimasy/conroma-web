/* Textos y URLs de un inmueble (título, tipo, datos de tarjeta…). Sin el inventario: lo importan
   las islas del navegador y, si viniera de properties.ts, cada tarjeta cargaría el inventario entero. */
import { findTown } from './towns';
import type { Property } from './properties';
import type { Lang } from '../i18n';

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
export const TYPE_NAMES: Record<string, Record<'en' | 'ca', [string, string]>> = {
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

/** «Piso en venta en …» en cada idioma. `place` ya viene montado (zona y pueblo). */
export function titleFor(property: Property, place: string, lang: Lang): string {
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

export function propertyUrl(property: Property, lang: Lang): string {
  return `/${lang}/inmueble/${propertySlug(property)}/`;
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
