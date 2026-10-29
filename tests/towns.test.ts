import { describe, expect, it } from 'vitest';
import { publishedSellerTowns, publishedCatalogTowns } from '../src/data/towns';

const slugs = (list: { slug: string }[]) => list.map((t) => t.slug);

describe('towns', () => {
  it('publishedSellerTowns incluye los 4 municipios reactivados', () => {
    for (const s of ['pineda-de-mar', 'santa-susanna', 'palafolls', 'calella']) {
      expect(slugs(publishedSellerTowns)).toContain(s);
    }
  });

  it('publishedCatalogTowns = todos los municipios con inventario en venta (datos reales del Excel)', () => {
    expect(publishedCatalogTowns).toHaveLength(25);
    expect(slugs(publishedCatalogTowns)).toContain('malgrat-de-mar');
    expect(slugs(publishedCatalogTowns)).toContain('lloret-de-mar');
  });
});
