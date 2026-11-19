import { describe, expect, it } from 'vitest';
import { absoluteUrl, agentSchema, alternates, breadcrumbSchema, collectionPageSchema, listingSchema, pageTitle } from '../src/lib/seo';
import { properties, propertyDocTitle, propertySlug, propertyTitle } from '../src/data/properties';

describe('seo', () => {
  it('builds absolute urls on the site domain', () => {
    expect(absoluteUrl('/es/venta/malgrat-de-mar/')).toBe('https://conromaasesores.com/es/venta/malgrat-de-mar/');
  });

  it('appends the brand to titles once', () => {
    expect(pageTitle('Pisos en venta en Malgrat de Mar')).toBe('Pisos en venta en Malgrat de Mar | Conroma');
    expect(pageTitle('Conroma')).toBe('Conroma');
    const long = 'Casa adosada en venta en Urbanització Mas Pla, Lloret de Mar — 245.000 €';
    expect(pageTitle(long)).toBe(long);
  });

  it('declara hreflang recíprocos es/en/ca y x-default en español', () => {
    const expected = [
      { hreflang: 'es', href: 'https://conromaasesores.com/es/venta/' },
      { hreflang: 'en', href: 'https://conromaasesores.com/en/venta/' },
      { hreflang: 'ca', href: 'https://conromaasesores.com/ca/venta/' },
      { hreflang: 'x-default', href: 'https://conromaasesores.com/es/venta/' },
    ];
    expect(alternates('/es/venta/')).toEqual(expected);
    expect(alternates('/ca/venta/')).toEqual(expected);
    expect(alternates('/404/')).toEqual([]);
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

  it('no repite el pueblo cuando la zona es el propio pueblo o viene vacía', () => {
    const base = { ...properties[0], type: 'Parcela', operation: 'venta' as const, town: 'lloret-de-mar' };
    expect(propertyTitle({ ...base, zone: 'Lloret de Mar' })).toBe('Parcela en venta en Lloret de Mar');
    expect(propertyTitle({ ...base, zone: 'LLORET DE MAR' })).toBe('Parcela en venta en Lloret de Mar');
    expect(propertyTitle({ ...base, zone: '' })).toBe('Parcela en venta en Lloret de Mar');
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

  it('el <title> de la ficha no pasa de 65 caracteres: si la zona es larga, se queda el pueblo', () => {
    const base = { ...properties[0], type: 'Chalet unifamiliar', operation: 'venta' as const, town: 'tordera', price: 260000, ref: 'X-1' };
    const larga = { ...base, zone: 'Urbanitzacions Niàgara Parc-Àgora Parc-Roca-Rossa' };
    expect(propertyDocTitle(larga, [larga])).toBe('Chalet unifamiliar en venta en Tordera — 260.000 €');
    const corta = { ...base, zone: 'Centre' };
    expect(propertyDocTitle(corta, [corta])).toBe('Chalet unifamiliar en venta en Centre, Tordera — 260.000 €');
  });

  it('dos fichas con el mismo <title> se distinguen por la referencia', () => {
    const a = { ...properties[0], type: 'Terreno', operation: 'venta' as const, town: 'tordera', zone: 'Urbanitzacions El Mas Móra-Sant Daniel-Blanes Mar', price: 58000, ref: 'T-1' };
    const b = { ...a, ref: 'T-2' };
    expect(propertyDocTitle(a, [a, b])).toBe('Terreno en venta en Tordera — 58.000 € · Ref. T-1');
  });

  it('el título con la referencia tampoco pasa de 65 caracteres', () => {
    const a = { ...properties[0], type: 'Local', operation: 'venta' as const, town: 'lloret-de-mar', zone: 'Fenals-Santa Clotilde', price: 0, ref: 'L-1095' };
    const b = { ...a, ref: 'L-1094' };
    const t = propertyDocTitle(a, [a, b]);
    expect(t.length).toBeLessThanOrEqual(65);
    expect(t).toContain('Ref. L-1095');
  });

  it('no repite el pueblo si zona y pueblo solo difieren en el apóstrofo', () => {
    const base = { ...properties[0], type: 'Terreno', operation: 'venta' as const, town: "Vilobí d'Onyar", zone: 'Vilobí d’Onyar' };
    expect(propertyTitle(base)).toBe("Terreno en venta en Vilobí d'Onyar");
  });
});
