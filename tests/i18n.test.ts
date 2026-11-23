import { describe, expect, it } from 'vitest';
import { getLang, localizePath } from '../src/i18n';

describe('i18n', () => {
  it('saca el idioma del primer tramo de la ruta', () => {
    expect(getLang('/en/venta/')).toBe('en');
    expect(getLang(new URL('https://conromaasesores.com/ca/'))).toBe('ca');
    expect(getLang('/404/')).toBe('es');
    expect(getLang('/english/')).toBe('es');
  });

  it('lleva una ruta a otro idioma sin tocar el resto', () => {
    expect(localizePath('/es/venta/malgrat-de-mar/', 'en')).toBe('/en/venta/malgrat-de-mar/');
    expect(localizePath('/ca/', 'es')).toBe('/es/');
    expect(localizePath('/es/contacto/#formulario', 'ca')).toBe('/ca/contacto/#formulario');
    expect(localizePath('/img/og.jpg', 'en')).toBe('/img/og.jpg');
    expect(localizePath('/estilo/', 'en')).toBe('/estilo/');
  });
});
