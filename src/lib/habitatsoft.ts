import { XMLParser } from 'fast-xml-parser';
import type { Operation, Property } from '../data/properties';

/**
 * Parser del feed Habitatsoft "Enlace Web 2.0" (v1.7) → Property.
 *
 * Estructura: <WEB><Inmuebles><Inmueble> … </Inmueble></Inmuebles></WEB>.
 *  - Campos numéricos/booleanos en el nivel <Inmueble> (Precio1Euros, NumBanos, box_Ascensor="1/0", Latitud…).
 *  - Fotos en <Medias><Fotos><Foto>.
 *  - Textos (tipo, operación, estado, descripción) en <LanguageData><Language idlanguage="es">.
 *
 * NO viene en el feed: `likes`/`watchOut` (notas editoriales de Conroma). Quedan vacías salvo que
 * la agencia las meta en un campo libre de Habitatsoft y lo mapeemos aquí.
 */

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', trimValues: true });

/* eslint-disable @typescript-eslint/no-explicit-any */
function text(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return '';
  return String(value).trim();
}

function num(value: any): number {
  const n = Number(text(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function bool01(value: any): boolean {
  return text(value) === '1';
}

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

export function townSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function spanishBlock(inmueble: any): any {
  const langs = asArray<any>(inmueble?.LanguageData?.Language);
  return langs.find((l) => l?.idlanguage === 'es') ?? langs[0] ?? {};
}

function operationFrom(nombreOperacion: string): Operation {
  return /alquiler|lloguer|rent|louer|miet/i.test(nombreOperacion) ? 'alquiler' : 'venta';
}

function photosOf(inmueble: any): string[] {
  return asArray<any>(inmueble?.Medias?.Fotos?.Foto)
    .map((f) => text(f))
    .filter((url) => url.startsWith('http'));
}

export function parseHabitatsoftXml(xml: string): Property[] {
  const data = parser.parse(xml);
  return asArray<any>(data?.WEB?.Inmuebles?.Inmueble).map((it): Property => {
    const es = spanishBlock(it);
    const rooms = Number(text(it.TotalHab)) || num(it.NumHabDobles) + num(it.NumHabSencillas);
    const lat = num(it.Latitud);
    const lng = num(it.Longitud);
    const images = photosOf(it);
    return {
      ref: text(it.NumeroExpediente) || text(it.IdInmueble),
      operation: operationFrom(text(es.txt_NombreOperacion)),
      type: text(es.txt_NombreTipoInmueble) || 'Inmueble',
      town: townSlug(text(it.NombreMunicipio)),
      zone: text(it.NombreZona) || text(it.NombreMunicipio),
      price: num(it.Precio1Euros),
      previousPrice: null,
      rooms,
      baths: num(it.NumBanos) + num(it.NumAseos),
      area: Math.round(num(it.SuperficieTotal)),
      floor: num(it.AlturaPiso),
      elevator: bool01(it.box_Ascensor),
      parking: bool01(it.box_Garaje),
      terrace: bool01(it.box_Terraza),
      state: text(es.txt_Estado) || 'Consultar',
      tag: '',
      likes: '', // editorial de Conroma; no viene del feed
      watchOut: '', // idem
      description: text(es.txt_FrasePublicitaria) || text(es.txt_DetalleAlternativo),
      photos: images.length,
      tone: 1,
      images,
      geo: lat && lng ? { latitude: lat, longitude: lng } : undefined,
    };
  });
}
