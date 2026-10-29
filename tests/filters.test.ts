import { describe, expect, it } from 'vitest';
import { applyFilters, countActive, emptyFilters, filtersFromQuery, sortProperties } from '../src/lib/filters';
import { properties } from '../src/data/properties';

describe('filters', () => {
  it('returns everything with no filters', () => {
    expect(applyFilters(properties, emptyFilters)).toHaveLength(properties.length);
  });

  it('filters by maximum price and rooms', () => {
    const result = applyFilters(properties, { ...emptyFilters, maxPrice: 250000, minRooms: 3 });
    expect(result.every((property) => property.price <= 250000 && property.rooms >= 3)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('sorts by price without mutating the source', () => {
    const first = properties[0].ref;
    const sorted = sortProperties(properties, 'precio-asc');
    expect(sorted[0].price).toBe(Math.min(...properties.map((property) => property.price)));
    expect(properties[0].ref).toBe(first);
  });

  it('counts active filters', () => {
    expect(countActive({ ...emptyFilters, terrace: true, maxPrice: 200000 })).toBe(2);
  });

  it('reads filters from the query string and ignores junk', () => {
    expect(filtersFromQuery(new URLSearchParams('precio=250000&hab=abc')).maxPrice).toBe(250000);
    expect(filtersFromQuery(new URLSearchParams('precio=250000&hab=abc')).minRooms).toBeNull();
  });
});
