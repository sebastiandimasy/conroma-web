import { describe, expect, it } from 'vitest';
import { absoluteUrl, agentSchema, alternates, breadcrumbSchema, collectionPageSchema, listingSchema, pageTitle } from '../src/lib/seo';
import { properties, propertySlug, propertyTitle } from '../src/data/properties';

describe('seo', () => {
  it('builds absolute urls on the site domain', () => {
    expect(absoluteUrl('/es/venta/malgrat-de-mar/')).toBe('https://conromaasesores.com/es/venta/malgrat-de-mar/');
  });

  it('appends the brand to titles once', () => {
    expect(pageTitle('Pisos en venta en Malgrat de Mar')).toBe('Pisos en venta en Malgrat de Mar | Conroma');
    expect(pageTitle('Conroma')).toBe('Conroma');
  });

  it('does not declare alternates for unpublished languages', () => {
    expect(alternates('/es/', { ca: '/ca/' })).toEqual([]);
  });

  it('numbers breadcrumbs from one', () => {
    const schema = breadcrumbSchema([
      { name: 'Inicio', path: '/es/' },
      { name: 'Malgrat de Mar', path: '/es/venta/malgrat-de-mar/' },
    ]);
    expect(schema.itemListElement.map((item) => item.position)).toEqual([1, 2]);
  });

  it('construye un CollectionPage con url absoluta', () => {
    const schema = collectionPageSchema('Pisos en venta en Malgrat de Mar', '/es/venta/malgrat-de-mar/');
    expect(schema['@type']).toBe('CollectionPage');
    expect(schema.name).toBe('Pisos en venta en Malgrat de Mar');
    expect(schema.url).toBe('https://conromaasesores.com/es/venta/malgrat-de-mar/');
  });

  it('does not self-declare a rating in the agency schema', () => {
    expect(agentSchema().aggregateRating).toBeUndefined();
  });

  it('describes a listing with its price', () => {
    const schema = listingSchema(properties[0]);
    expect(schema.offers.price).toBe(properties[0].price);
    expect(schema.offers.priceCurrency).toBe('EUR');
  });

  it('builds stable slugs and titles', () => {
    expect(propertySlug(properties[0])).toBe('chalet-mont-lloret-lloret-de-mar-c-1280-a');
    expect(propertyTitle(properties[0])).toBe('Chalet en alquiler en Mont Lloret, Lloret de Mar');
  });
});
