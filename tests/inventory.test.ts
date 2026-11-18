import { describe, expect, it } from 'vitest';
import { feedLooksComplete, isNewListing, mergeFirstSeen, mergeInventoryItem, NEW_DAYS } from '../src/lib/inventory';
import type { Property } from '../src/data/properties';

const base = { ref: 'P-1', images: undefined } as unknown as Property;

describe('el feed manda sobre los datos de la web antigua', () => {
  it('fotos del feed antes que las del mapa de fotos', () => {
    const item = { ...base, images: ['feed.jpg'], fromFeed: true } as Property;
    expect(mergeInventoryItem(item, undefined, ['viejo.jpg']).images).toEqual(['feed.jpg']);
  });

  it('sin fotos en el feed, usa el mapa de fotos', () => {
    const merged = mergeInventoryItem(base, undefined, ['viejo.jpg']);
    expect(merged.images).toEqual(['viejo.jpg']);
    expect(merged.photos).toBe(1);
  });

  it('el certificado del feed gana al de la web antigua; si falta, se usa el antiguo', () => {
    const viejo = { energyRating: 'D', legacyId: '1.527526', published: true } as const;
    expect(mergeInventoryItem({ ...base, energyRating: 'B' } as Property, viejo, undefined).energyRating).toBe('B');
    const merged = mergeInventoryItem(base, viejo, undefined);
    expect(merged.energyRating).toBe('D');
    expect(merged.legacyId).toBe('1.527526');
    expect('published' in merged).toBe(false);
  });
});

describe('fecha de alta y etiqueta Nuevo', () => {
  it('una referencia nueva toma la fecha de hoy; las conocidas conservan la suya', () => {
    const seen = mergeFirstSeen({ p1: '2026-10-29' }, ['P-1', 'C-2 B'], '2026-11-19');
    expect(seen).toEqual({ p1: '2026-10-29', c2b: '2026-11-19' });
  });

  it(`es nuevo durante ${NEW_DAYS} días desde el alta`, () => {
    const today = new Date('2026-11-25T10:00:00+01:00');
    expect(isNewListing({ listedAt: '2026-11-19' } as Property, today)).toBe(true);
    expect(isNewListing({ listedAt: '2026-11-18' } as Property, today)).toBe(false);
    expect(isNewListing({} as Property, today)).toBe(false);
  });
});

describe('protección contra un feed incompleto', () => {
  it('rechaza un feed con menos de la mitad de los pisos actuales', () => {
    expect(feedLooksComplete(5, 125)).toBe(false);
    expect(feedLooksComplete(100, 125)).toBe(true);
    expect(feedLooksComplete(3, 0)).toBe(true);
  });
});
