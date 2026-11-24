import { describe, expect, it } from 'vitest';
import { forCard, getListings, getListing, properties, propertySlug } from '../src/data/properties';

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

describe('forCard', () => {
  const full = properties.find((p) => (p.images?.length ?? 0) > 1 && p.description)!;

  it('quita lo que la tarjeta no pinta: descripciones y fotos más allá de la primera', () => {
    const card = forCard(full);
    expect(card.description).toBe('');
    expect(card.descriptions).toBeUndefined();
    expect(card.images).toEqual([full.images![0]]);
  });

  it('conserva los campos con los que se filtra y se ordena', () => {
    const { description, descriptions, images, ...rest } = full;
    const { description: _d, descriptions: _ds, images: _i, ...cardRest } = forCard(full);
    expect(cardRest).toEqual(rest);
  });
});
