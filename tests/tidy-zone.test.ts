import { describe, expect, it } from 'vitest';
import { getListings, propertySlug, tidyZone } from '../src/data/properties';

describe('tidyZone (zonas del feed escritas en mayúsculas)', () => {
  it('pasa las mayúsculas a nombre propio, con las partículas en minúscula', () => {
    expect(tidyZone('SANT LLOP')).toBe('Sant Llop');
    expect(tidyZone('URBANIZACION LAS FERRERAS')).toBe('Urbanización las Ferreras');
    expect(tidyZone('NUCLEO URBANO')).toBe('Núcleo Urbano');
    expect(tidyZone('CARRETERA NACIONAL')).toBe('Carretera Nacional');
  });

  it('no toca lo que ya viene bien escrito', () => {
    expect(tidyZone('Maçanet de la Selva')).toBe('Maçanet de la Selva');
    expect(tidyZone('Mas Baell-Can Carbó-El Molí')).toBe('Mas Baell-Can Carbó-El Molí');
  });

  it('cambia el acento agudo usado como apóstrofo («d´Onyar») por un apóstrofo', () => {
    expect(tidyZone('Vilobí d´Onyar')).toBe('Vilobí d’Onyar');
  });

  it('ninguna ficha publicada sale con la zona en mayúsculas', () => {
    const shouting = getListings().filter((p) => /[A-ZÁÉÍÓÚÑÇ]{4,}/.test(p.zone) && p.zone === p.zone.toUpperCase());
    expect(shouting.map((p) => p.zone)).toEqual([]);
  });

  it('las URLs de las fichas no cambian (el slug ignora mayúsculas y acentos)', () => {
    const property = { ...getListings()[0], zone: 'URBANIZACION LAS FERRERAS' };
    expect(propertySlug({ ...property, zone: tidyZone(property.zone) })).toBe(propertySlug(property));
  });
});
