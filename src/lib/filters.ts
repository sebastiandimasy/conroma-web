import type { Property } from '../data/properties';

export interface Filters {
  maxPrice: number | null;
  minRooms: number | null;
  /** Slug del pueblo. Solo se usa en el listado general: dentro de /es/venta/{pueblo}/ sobra. */
  town: string | null;
  type: string | null;
  terrace: boolean;
  elevator: boolean;
  parking: boolean;
}

export type SortOrder = 'recientes' | 'precio-asc' | 'precio-desc';

export const emptyFilters: Filters = {
  maxPrice: null,
  minRooms: null,
  town: null,
  type: null,
  terrace: false,
  elevator: false,
  parking: false,
};

export function applyFilters(list: Property[], filters: Filters): Property[] {
  return list.filter(
    (property) =>
      (filters.maxPrice === null || property.price <= filters.maxPrice) &&
      (filters.minRooms === null || property.rooms >= filters.minRooms) &&
      (filters.town === null || property.town === filters.town) &&
      (filters.type === null || property.type === filters.type) &&
      (!filters.terrace || property.terrace) &&
      (!filters.elevator || property.elevator) &&
      (!filters.parking || property.parking),
  );
}

export function sortProperties(list: Property[], order: SortOrder): Property[] {
  if (order === 'precio-asc') return [...list].sort((a, b) => a.price - b.price);
  if (order === 'precio-desc') return [...list].sort((a, b) => b.price - a.price);
  return list;
}

export function countActive(filters: Filters): number {
  return [
    filters.maxPrice !== null,
    filters.minRooms !== null,
    filters.town !== null,
    filters.type !== null,
    filters.terrace,
    filters.elevator,
    filters.parking,
  ].filter(Boolean).length;
}

export function filtersFromQuery(query: URLSearchParams): Filters {
  const maxPrice = Number(query.get('precio'));
  const minRooms = Number(query.get('hab'));
  return {
    ...emptyFilters,
    maxPrice: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : null,
    minRooms: Number.isFinite(minRooms) && minRooms > 0 ? minRooms : null,
    town: query.get('pueblo'),
    type: query.get('tipo'),
  };
}
