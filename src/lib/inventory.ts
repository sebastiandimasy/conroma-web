import type { Property } from '../data/properties';

/** Días que un inmueble lleva la etiqueta «Nuevo» desde que aparece por primera vez. */
export const NEW_DAYS = 7;

export const normRef = (ref: string): string => ref.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Fecha YYYY-MM-DD en Madrid (el build de GitHub Actions corre en UTC). */
export function madridDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(date);
}

type LegacyEntry = Partial<Property> & { published?: boolean };

/** Une un inmueble del inventario con lo leído de la web antigua y el mapa de fotos.
    Lo que trae el inventario (el feed) manda; lo antiguo solo rellena huecos. */
export function mergeInventoryItem(item: Property, legacy: LegacyEntry | undefined, photos: string[] | undefined): Property {
  const { published: _published, ...fromOldSite } = legacy ?? {};
  const merged = { ...fromOldSite, ...item } as Property;
  if (!merged.images?.length && photos?.length) return { ...merged, images: photos, photos: photos.length };
  return merged;
}

/** Fecha de primera aparición por ref normalizada. Las refs nuevas toman `today`. */
export function mergeFirstSeen(previous: Record<string, string>, refs: string[], today: string): Record<string, string> {
  const seen = { ...previous };
  for (const ref of refs) seen[normRef(ref)] ??= today;
  return seen;
}

export function isNewListing(property: Pick<Property, 'listedAt'>, today: Date = new Date()): boolean {
  if (!property.listedAt) return false;
  const days = (Date.parse(madridDate(today)) - Date.parse(property.listedAt)) / 86_400_000;
  return days >= 0 && days < NEW_DAYS;
}

/** Un feed que trae menos de la mitad de lo que hay publicado se toma por roto. */
export function feedLooksComplete(feedCount: number, currentCount: number): boolean {
  return feedCount > 0 && feedCount >= currentCount / 2;
}
