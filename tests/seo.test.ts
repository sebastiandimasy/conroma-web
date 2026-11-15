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
    expect(schema.offers?.price).toBe(properties[0].price);
    expect(schema.offers?.priceCurrency).toBe('EUR');
  });

  it('omits the offer when the price is the "a consultar" placeholder', () => {
    const schema = listingSchema({ ...properties[0], price: 10 });
    expect(schema.offers).toBeUndefined();
  });

  it('does not declare land or commercial units as flats', () => {
    expect(listingSchema({ ...properties[0], type: 'Terreno' }).mainEntity['@type']).toBe('Place');
    expect(listingSchema({ ...properties[0], type: 'Local' }).mainEntity['@type']).toBe('Place');
    expect(listingSchema({ ...properties[0], type: 'Piso' }).mainEntity['@type']).toBe('Apartment');
    expect(listingSchema({ ...properties[0], type: 'Casa adosada' }).mainEntity['@type']).toBe('House');
  });

  it('drops rooms and baths on land and commercial units', () => {
    expect(listingSchema({ ...properties[0], type: 'Terreno' }).mainEntity.numberOfRooms).toBeUndefined();
    expect(listingSchema({ ...properties[0], type: 'Piso' }).mainEntity.numberOfRooms).toBe(properties[0].rooms);
  });

  // Antes esto comprobaba properties[0], así que se rompía cada vez que cambiaba
  // el inventario (y se rompió al retirar los alquileres sin datos de zona tensionada).
  // Lo que se quiere probar es la función, no qué piso ocupa la primera posición.
  it('builds stable slugs and titles', () => {
    const piso = {
      ...properties[0],
      type: 'Chalet',
      operation: 'alquiler' as const,
      zone: 'Mont Lloret',
      town: 'lloret-de-mar',
      ref: 'C-1280-A',
    };
    expect(propertySlug(piso)).toBe('chalet-mont-lloret-lloret-de-mar-c-1280-a');
    expect(propertyTitle(piso)).toBe('Chalet en alquiler en Mont Lloret, Lloret de Mar');
  });
});

describe('URLs de inmueble', () => {
  it('no deja espacios ni símbolos en el slug aunque la referencia los traiga', () => {
    const slug = propertySlug({ ...properties[0], type: 'Local', zone: 'Centre', town: 'malgrat-de-mar', ref: 'L - 1045 - H' });
    expect(slug).toBe('local-centre-malgrat-de-mar-l-1045-h');
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('sanea referencias con palabras sueltas', () => {
    const slug = propertySlug({ ...properties[0], type: 'Bungalow', zone: 'Malgrat de Mar', town: 'malgrat-de-mar', ref: 'B-0045-A PLA' });
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug.endsWith('b-0045-a-pla')).toBe(true);
  });
});
