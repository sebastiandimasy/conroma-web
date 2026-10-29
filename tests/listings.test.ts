import { describe, expect, it } from 'vitest';
import { getListings, getListing, propertySlug } from '../src/data/properties';

describe('costura de inventario (getListings/getListing)', () => {
  it('getListings() devuelve el inventario completo', () => {
    expect(getListings().length).toBeGreaterThan(0);
  });

  it('filtra por operación', () => {
    expect(getListings({ operation: 'venta' }).every((p) => p.operation === 'venta')).toBe(true);
  });

  it('filtra por pueblo', () => {
    const malgrat = getListings({ town: 'malgrat-de-mar' });
    expect(malgrat.every((p) => p.town === 'malgrat-de-mar')).toBe(true);
  });

  it('getListing encuentra por slug y devuelve undefined si no existe', () => {
    const first = getListings()[0];
    expect(getListing(propertySlug(first))?.ref).toBe(first.ref);
    expect(getListing('no-existe')).toBeUndefined();
  });
});
