import type { Property } from '../data/properties';
import { townSlug } from './habitatsoft.ts';
import { feedLooksComplete, normRef } from './inventory.ts';

/**
 * Puente con el PANEL de Habitatsoft (mientras no tengamos el feed «Enlace Web 2.0»).
 * El extractor (scripts/habitatsoft-panel/extractor.mjs) lee el panel con la sesión iniciada
 * y entrega un PanelRecord por inmueble activo. Aquí se convierte en Property.
 * Nunca llega la calle ni nada del propietario: el extractor ya los deja fuera.
 */
export interface PanelRecord {
  ref: string;
  id: string;
  /** Nombre de la operación en el panel: «Venta», «Alquiler»… */
  operation: string;
  type: string;
  price: number;
  /** Precio tachado del listado (precio anterior), si lo hay. */
  previousPrice: number | null;
  /** Zona y pueblo: los dos últimos tramos de la dirección, sin la calle. */
  place: { zone: string; town: string };
  /** «Información general» de la ficha: etiqueta → valor («Altura piso» → «2º»). */
  info: Record<string, string>;
  /** Inputs ocultos de la ficha (Precio1Euros, SuperficieTotal, NumBanos…). */
  hidden: Record<string, string>;
  /** Características marcadas en la ficha («Ascensor», «Terraza»…). */
  features: string[];
  images: string[];
  description: string;
  /** Bloque CEnergetica del formulario de edición, tal cual. */
  energy: Record<string, string> | null;
}

type Letter = NonNullable<Property['energyRating']>;

/** Códigos del panel en CertificacionEnergeticaEnTramite (550 = tiene certificado, con letra). */
const EXENTO = '552';
const EN_TRAMITE = '548';

/** Párrafos fijos que la agencia añade a todas las descripciones de portal. */
const BOILERPLATE = [/^CONROMA es una empresa/i, /^Con una inversi[oó]n permanente/i, /^En cumplimiento de la ley/i];

export function cleanDescription(text: string): string {
  // Por líneas: a veces el párrafo fijo va tras un solo salto (\r\n), sin línea en blanco.
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !BOILERPLATE.some((re) => re.test(line)))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const num = (value: string | undefined): number => {
  const n = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

const letter = (value: string | undefined): Letter | undefined =>
  /^[A-G]$/.test(value ?? '') ? (value as Letter) : undefined;

/** Solo pone los campos que el panel sabe: los que falten los rellena lo leído de la web antigua. */
function energyFrom(ce: Record<string, string> | null): Partial<Property> {
  if (!ce) return {};
  if (ce.CertificacionEnergeticaEnTramite === EXENTO) return { energyExempt: true };
  if (ce.CertificacionEnergeticaEnTramite === EN_TRAMITE) return { energyPending: true };
  const out: Partial<Property> = {};
  const emissions = letter(ce.CertificacionEmisiones);
  const consumption = letter(ce.CertificacionEnergetica);
  // energyRating es la letra de emisiones (ver Property); si solo hay la de consumo, esa.
  if (emissions ?? consumption) out.energyRating = emissions ?? consumption;
  if (consumption) out.energyConsumptionRating = consumption;
  if (consumption && num(ce.PrestacionEnergetica) > 0) out.energyConsumption = num(ce.PrestacionEnergetica);
  if (emissions && num(ce.PrestacionEmisiones) > 0) out.energyEmissions = num(ce.PrestacionEmisiones);
  return out;
}

const floorFrom = (text: string | undefined): number => {
  if (!text || /bajo|baja/i.test(text)) return 0;
  return Number.parseInt(text, 10) || 0;
};

/** Una «zona» con números (Nº, portal) es un trozo de calle: no se publica. */
const zoneFrom = (place: PanelRecord['place']): string =>
  place.zone && !/\d|n[º°]/i.test(place.zone) ? place.zone : place.town;

export function panelToProperty(raw: PanelRecord, previous?: Property): Property {
  const h = raw.hidden;
  const lat = num(h.Latitud);
  const lng = num(h.Longitud);
  const has = (re: RegExp) => raw.features.some((f) => re.test(f));
  const fresh = {
    // La ref ya publicada manda: de ella sale la URL de la ficha.
    ref: previous?.ref ?? raw.ref,
    operation: /alquiler|lloguer/i.test(raw.operation) ? 'alquiler' : 'venta',
    type: raw.type || 'Inmueble',
    price: raw.price || num(h.Precio1Euros),
    previousPrice: raw.previousPrice && raw.previousPrice > raw.price ? raw.previousPrice : null,
    rooms: num(h.NumHabDobles) + num(h.NumHabSencillas),
    baths: num(h.NumBanos) + num(h.NumAseos),
    area: Math.round(num(h.SuperficieTotal) || num(h.SuperficieSolar)),
    floor: floorFrom(raw.info['Altura piso']),
    elevator: has(/ascensor/i),
    parking: has(/garaje|parking/i),
    terrace: has(/terraza/i),
    description: cleanDescription(raw.description),
    photos: raw.images.length,
    images: raw.images,
    geo: lat && lng ? { latitude: lat, longitude: lng } : previous?.geo,
    fromFeed: true,
    ...energyFrom(raw.energy),
  } satisfies Partial<Property>;

  if (previous) return { ...previous, ...fresh };
  return {
    town: townSlug(raw.place.town),
    zone: zoneFrom(raw.place),
    state: /estrenar|nuev/i.test(raw.info['Conservación'] ?? '') ? 'Nuevo' : '2ª mano',
    tag: '',
    likes: '',
    watchOut: '',
    tone: 1,
    ...fresh,
  };
}

/** Inventario completo a partir de una lectura del panel. null si la lectura no es fiable
    (se quedó a medias o trae mucho menos de lo publicado): entonces se deja el volcado actual. */
export function panelInventory(read: { total: number; records: PanelRecord[] }, current: Property[]): Property[] | null {
  if (!read.total || read.records.length < read.total) return null;
  if (!feedLooksComplete(read.records.length, current.length)) return null;
  const byRef = new Map(current.map((p) => [normRef(p.ref), p]));
  return read.records.map((raw) => panelToProperty(raw, byRef.get(normRef(raw.ref))));
}
