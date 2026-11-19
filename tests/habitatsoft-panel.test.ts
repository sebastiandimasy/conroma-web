import { describe, expect, it } from 'vitest';
import type { Property } from '../src/data/properties';
import { cleanDescription, panelInventory, panelToProperty, type PanelRecord } from '../src/lib/habitatsoft-panel';

/** Datos reales de P-990-H tal como los lee el extractor del panel (sin calle ni propietario). */
const piso = (over: Partial<PanelRecord> = {}): PanelRecord => ({
  ref: 'P-990-H',
  id: '69206622437.527526',
  operation: 'Venta',
  type: 'Piso',
  price: 189000,
  previousPrice: null,
  place: { zone: 'Fenals-Santa Clotilde', town: 'Lloret de Mar' },
  info: { 'Superficie total': '50 m2', 'Altura piso': '2º', Conservación: 'buen estado' },
  hidden: {
    Precio1Euros: '189000',
    SuperficieTotal: '50',
    SuperficieSolar: '0',
    NumBanos: '1',
    NumAseos: '0',
    NumHabDobles: '1',
    NumHabSencillas: '1',
    Latitud: '41.693916',
    Longitud: '2.813757',
  },
  features: ['Ascensor', 'Balcón', 'Piscina', 'Jardín', 'Calefacción', 'Orientación'],
  images: ['https://fotoshs.imghs.net/3xl//527526/a.jpg', 'https://fotoshs.imghs.net/3xl//527526/b.jpg'],
  description:
    'Presentamos este encantador piso de 50 m².\n\nEl piso dispone de calefacción eléctrica.\n\n' +
    'CONROMA es una empresa innovadora con un ambiente familiar muy competitivo.\n\n' +
    'Con una inversión permanente en tecnología, nos colocamos entre las inmobiliarias más eficientes.\n\n' +
    'En cumplimiento de la ley 3/2917 del 13 de febrero de 2018 del Código civil de Cataluña, precio sin gastos.',
  energy: {
    CertificacionEnergeticaEnTramite: '550',
    CertificacionEnergetica: 'E',
    CertificacionEmisiones: 'E',
    PrestacionEnergetica: '188',
    PrestacionEmisiones: '35',
  },
  ...over,
});

describe('panelToProperty', () => {
  it('convierte un inmueble nuevo del panel en un Property publicable', () => {
    const p = panelToProperty(piso());
    expect(p).toMatchObject({
      ref: 'P-990-H',
      operation: 'venta',
      type: 'Piso',
      town: 'lloret-de-mar',
      zone: 'Fenals-Santa Clotilde',
      price: 189000,
      previousPrice: null,
      rooms: 2,
      baths: 1,
      area: 50,
      floor: 2,
      elevator: true,
      parking: false,
      terrace: false,
      state: '2ª mano',
      photos: 2,
      geo: { latitude: 41.693916, longitude: 2.813757 },
      fromFeed: true,
      energyRating: 'E',
      energyConsumptionRating: 'E',
      energyConsumption: 188,
      energyEmissions: 35,
    });
    expect(p.images).toHaveLength(2);
    expect(p.description).toBe('Presentamos este encantador piso de 50 m².\n\nEl piso dispone de calefacción eléctrica.');
  });

  it('un inmueble que ya estaba conserva pueblo, zona y lo editorial, y toma precio y bajada del panel', () => {
    const before = {
      ...panelToProperty(piso()),
      town: 'lloret-de-mar',
      zone: 'Fenals',
      tag: 'Destacado',
      likes: 'Luz',
      legacyId: '1.527526',
      price: 199000,
    } as Property;
    const p = panelToProperty(piso({ price: 179000, previousPrice: 189000 }), before);
    expect(panelToProperty(piso({ ref: 'P-990-H ' }), { ...before, ref: 'P-990-H' }).ref).toBe('P-990-H');
    expect(p).toMatchObject({ zone: 'Fenals', tag: 'Destacado', likes: 'Luz', legacyId: '1.527526', price: 179000, previousPrice: 189000 });
  });

  it('el precio anterior solo cuenta si es una bajada', () => {
    expect(panelToProperty(piso({ previousPrice: 150000 })).previousPrice).toBeNull();
  });

  it('marca alquiler y usa la superficie de solar si no hay total (terrenos)', () => {
    const p = panelToProperty(
      piso({ operation: 'Alquiler', type: 'Terreno', hidden: { ...piso().hidden, SuperficieTotal: '0', SuperficieSolar: '1200' } }),
    );
    expect(p.operation).toBe('alquiler');
    expect(p.area).toBe(1200);
  });

  it('exento (552) se marca como exento y sin letra', () => {
    const p = panelToProperty(piso({ energy: { CertificacionEnergeticaEnTramite: '552', CertificacionEnergetica: '' } }));
    expect(p.energyExempt).toBe(true);
    expect(p.energyRating).toBeUndefined();
  });

  it('en trámite (548) se marca como pendiente', () => {
    const p = panelToProperty(piso({ energy: { CertificacionEnergeticaEnTramite: '548', CertificacionEnergetica: '' } }));
    expect(p.energyPending).toBe(true);
    expect(p.energyRating).toBeUndefined();
  });

  it('sin certificado legible no inventa nada: deja los campos de energía fuera para que rellene lo antiguo', () => {
    const p = panelToProperty(piso({ energy: { CertificacionEnergeticaEnTramite: '0', CertificacionEnergetica: '0', CertificacionEmisiones: '1' } }));
    for (const key of ['energyRating', 'energyConsumptionRating', 'energyConsumption', 'energyEmissions', 'energyExempt'])
      expect(p).not.toHaveProperty(key);
    expect(panelToProperty(piso({ energy: null }))).not.toHaveProperty('energyRating');
  });

  it('una zona que parece calle (con números) no se publica: usa el pueblo', () => {
    const p = panelToProperty(piso({ place: { zone: 'Mayor 5', town: 'Malgrat de Mar' } }));
    expect(p.town).toBe('malgrat-de-mar');
    expect(p.zone).toBe('Malgrat de Mar');
  });

  it('planta baja es 0 y a estrenar es Nuevo', () => {
    const p = panelToProperty(piso({ info: { 'Altura piso': 'Bajo', Conservación: 'a estrenar' } }));
    expect(p.floor).toBe(0);
    expect(p.state).toBe('Nuevo');
  });

  it('parking y terraza salen de las características', () => {
    const p = panelToProperty(piso({ features: ['Garaje', 'Terraza'] }));
    expect(p).toMatchObject({ elevator: false, parking: true, terrace: true });
  });
});

describe('cleanDescription', () => {
  it('quita los párrafos fijos de la agencia y deja el texto del inmueble', () => {
    expect(cleanDescription('Casa con vistas.\n\nCONROMA es una empresa innovadora.')).toBe('Casa con vistas.');
    expect(cleanDescription('  ')).toBe('');
    expect(cleanDescription('Vivienda ideal.\r\nCONROMA es una empresa innovadora.\r\nCon una inversión permanente.')).toBe('Vivienda ideal.');
  });
});

describe('panelInventory', () => {
  const before = { ...panelToProperty(piso()), ref: 'L-1045-H', zone: 'Centre', tag: 'Rebajado' } as Property;

  it('cruza cada inmueble del panel con el publicado por ref normalizada', () => {
    const out = panelInventory({ total: 2, records: [piso({ ref: 'L - 1045 - H' }), piso()] }, [before]);
    expect(out?.map((p) => p.ref)).toEqual(['L-1045-H', 'P-990-H']);
    expect(out?.[0]).toMatchObject({ zone: 'Centre', tag: 'Rebajado' });
  });

  it('si la lectura se quedó a medias (menos fichas que el total del panel) no devuelve nada', () => {
    expect(panelInventory({ total: 113, records: [piso()] }, [])).toBeNull();
    expect(panelInventory({ total: 0, records: [] }, [])).toBeNull();
  });

  it('si trae menos de la mitad de lo publicado lo toma por roto', () => {
    expect(panelInventory({ total: 1, records: [piso()] }, [before, before, before])).toBeNull();
  });
});
