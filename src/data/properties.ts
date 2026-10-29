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

export function propertySlug(property: Property): string {
  const base = `${property.type}-${property.zone}-${property.town}`
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${property.ref.toLowerCase()}`;
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
