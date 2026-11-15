import { describe, expect, it } from 'vitest';
import { publishedSellerTowns, publishedCatalogTowns } from '../src/data/towns';

const slugs = (list: { slug: string }[]) => list.map((t) => t.slug);

describe('towns', () => {
  it('publishedSellerTowns incluye los 4 municipios reactivados', () => {
    for (const s of ['pineda-de-mar', 'santa-susanna', 'palafolls', 'calella']) {
      expect(slugs(publishedSellerTowns)).toContain(s);
    }
  });

  it('publishedCatalogTowns = municipios con intro (indexables; los pueblos finos quedan fuera)', () => {
    // Solo se indexan los municipios con intro escrita (8 del Maresme + 5 de La Selva con
    // inventario real). Los pueblos con 1 piso suelto o que son zonas quedan fuera del índice.
    expect(publishedCatalogTowns).toHaveLength(13);
    expect(slugs(publishedCatalogTowns)).toContain('malgrat-de-mar');
    expect(slugs(publishedCatalogTowns)).toContain('lloret-de-mar');
    expect(slugs(publishedCatalogTowns)).toContain('macanet-de-la-selva');
    expect(slugs(publishedCatalogTowns)).not.toContain('besalu'); // 1 piso, sin intro → fuera
  });
});
