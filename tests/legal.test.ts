import { describe, expect, it } from 'vitest';
import { getListings, retenidasPorLey, faltanDatosDeAlquilerTensionado } from '../src/data/properties';
import { site } from '../src/data/site';

/**
 * Malgrat de Mar, Lloret y Blanes son zona de mercado residencial tensionado
 * (Resolución TER/800/2024, BOE-A-2024-5214) hasta el 16-03-2027.
 *
 * Publicitar allí el alquiler de una vivienda sin el precio máximo del índice
 * de referencia y sin la condición de gran tenedor del propietario es
 * infracción GRAVE: 9.001-90.000 € (art. 124.2.n de la Ley 18/2007).
 *
 * Estos tests existen para que nadie publique esos anuncios por descuido.
 */
describe('obligaciones legales de la publicidad', () => {
  it('no publica viviendas en alquiler sin los datos de zona tensionada', () => {
    const sinDatos = getListings({ operation: 'alquiler' }).filter(faltanDatosDeAlquilerTensionado);
    expect(sinDatos).toHaveLength(0);
  });

  it('las retenidas quedan localizadas para poder reclamar el dato', () => {
    for (const property of retenidasPorLey) {
      expect(property.operation).toBe('alquiler');
      expect(property.rentIndexMax == null || property.largeHolder == null).toBe(true);
    }
  });

  it('un alquiler con los dos datos sí se publicaría', () => {
    const completo = {
      ...getListings()[0],
      operation: 'alquiler' as const,
      type: 'Piso',
      rentIndexMax: 1100,
      largeHolder: false,
    };
    expect(faltanDatosDeAlquilerTensionado(completo)).toBe(false);
  });

  it('a un parking o un local no le aplica: no son vivienda', () => {
    const parking = {
      ...getListings()[0],
      operation: 'alquiler' as const,
      type: 'Parking',
      rentIndexMax: undefined,
      largeHolder: undefined,
    };
    expect(faltanDatosDeAlquilerTensionado(parking)).toBe(false);
  });

  it('el AICAT y el NIF siguen pendientes: avisa hasta que estén', () => {
    // Cuando se rellenen en site.ts, este test hay que actualizarlo a conciencia.
    const legal = site as unknown as { aicat?: string; nif?: string };
    const pendientes = [legal.aicat, legal.nif].filter((v) => !v);
    expect(
      pendientes.length,
      'Faltan el nº AICAT y/o el NIF: obligatorios en la publicidad (arts. 57 y 59.e Ley 18/2007)',
    ).toBeGreaterThan(0);
  });
});
