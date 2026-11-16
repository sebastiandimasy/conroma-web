import { describe, expect, it } from 'vitest';
import { proofFigures } from '../src/lib/proof';

const rating = { value: 4.7, count: 107, checkedOn: '2026-10-12', url: 'https://www.google.com/maps?cid=1' };
const builtOn = new Date('2026-11-16T12:00:00Z');

describe('proofFigures', () => {
  it('da las cifras reales en orden, con su fuente', () => {
    const figures = proofFigures({ rating, yearsActive: 7, listings: 118, builtOn });
    expect(figures.map((f) => f.value)).toEqual(['4,7', '107', '7', '118']);
    expect(figures[0].source).toBe('Google, consultado el 12 oct 2026');
    expect(figures[0].href).toBe(rating.url);
    expect(figures[3].source).toBe('Cartera publicada a 16 nov 2026');
  });

  it('sin ficha de Google no pinta ni nota ni recuento', () => {
    expect(proofFigures({ rating: null, yearsActive: 7, listings: 118, builtOn }).map((f) => f.value)).toEqual(['7', '118']);
  });

  it('nunca pinta un cero', () => {
    expect(proofFigures({ rating: null, yearsActive: null, listings: 0, builtOn })).toEqual([]);
  });
});
