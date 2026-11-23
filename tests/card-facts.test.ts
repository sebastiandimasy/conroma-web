import { describe, expect, it } from 'vitest';
import { cardFacts, getListings, type Property } from '../src/data/properties';

const base = getListings()[0];
const with_ = (over: Partial<Property>): Property => ({ ...base, ...over });

describe('cardFacts (datos de la ficha en el listado)', () => {
  it('da habitaciones, baños y metros, en singular cuando toca', () => {
    expect(cardFacts(with_({ rooms: 3, baths: 1, area: 87 }), 'es')).toEqual(['3 habitaciones', '1 baño', '87 m²']);
  });

  it('no pinta ceros: un local o un parking no tiene «0 habitaciones»', () => {
    expect(cardFacts(with_({ rooms: 0, baths: 1, area: 237 }), 'es')).toEqual(['1 baño', '237 m²']);
    expect(cardFacts(with_({ rooms: 0, baths: 0, area: 0 }), 'es')).toEqual([]);
  });

  it('en inglés y catalán, con su plural', () => {
    expect(cardFacts(with_({ rooms: 1, baths: 2, area: 87 }), 'en')).toEqual(['1 bedroom', '2 bathrooms', '87 m²']);
    expect(cardFacts(with_({ rooms: 3, baths: 1, area: 87 }), 'ca')).toEqual(['3 habitacions', '1 bany', '87 m²']);
  });
});
