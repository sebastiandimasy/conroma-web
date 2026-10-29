import { describe, expect, it } from 'vitest';
import { parseHabitatsoftXml, townSlug } from '../src/lib/habitatsoft';

const xml = `<WEB><Inmuebles>
  <Inmueble>
    <IdInmueble>67506890676.510136</IdInmueble>
    <NumeroExpediente>6001</NumeroExpediente>
    <NombreZona>Centre</NombreZona>
    <NombreMunicipio>Malgrat de Mar</NombreMunicipio>
    <Longitud>2.741575</Longitud>
    <Latitud>41.650106</Latitud>
    <Precio1Euros>135000.00</Precio1Euros>
    <NumHabDobles>2</NumHabDobles>
    <NumHabSencillas>1</NumHabSencillas>
    <TotalHab>3</TotalHab>
    <NumBanos>2</NumBanos>
    <NumAseos>0</NumAseos>
    <SuperficieTotal>80.00</SuperficieTotal>
    <AlturaPiso>2</AlturaPiso>
    <box_Ascensor>1</box_Ascensor>
    <box_Garaje>0</box_Garaje>
    <box_Terraza>1</box_Terraza>
    <Medias><Fotos>
      <Foto>http://fotoshs.imghs.net/a.jpg</Foto>
      <Foto>http://fotoshs.imghs.net/b.jpg</Foto>
    </Fotos></Medias>
    <LanguageData>
      <Language idlanguage="es">
        <txt_NombreTipoInmueble>Piso</txt_NombreTipoInmueble>
        <txt_NombreOperacion>en venta</txt_NombreOperacion>
        <txt_Estado>de 2ª mano</txt_Estado>
        <txt_FrasePublicitaria>Piso reformado en el centro</txt_FrasePublicitaria>
      </Language>
      <Language idlanguage="en"><txt_NombreOperacion>for sale</txt_NombreOperacion></Language>
    </LanguageData>
  </Inmueble>
  <Inmueble>
    <NumeroExpediente>6002</NumeroExpediente>
    <NombreMunicipio>Pineda de Mar</NombreMunicipio>
    <Precio1Euros>700</Precio1Euros>
    <TotalHab>2</TotalHab>
    <NumBanos>1</NumBanos>
    <SuperficieTotal>60</SuperficieTotal>
    <box_Ascensor>0</box_Ascensor>
    <LanguageData><Language idlanguage="es"><txt_NombreOperacion>en alquiler</txt_NombreOperacion></Language></LanguageData>
  </Inmueble>
</Inmuebles></WEB>`;

describe('parser Habitatsoft → Property', () => {
  const items = parseHabitatsoftXml(xml);

  it('parsea todos los inmuebles', () => {
    expect(items).toHaveLength(2);
  });

  it('mapea el primer inmueble (venta) correctamente', () => {
    expect(items[0]).toMatchObject({
      ref: '6001',
      operation: 'venta',
      type: 'Piso',
      town: 'malgrat-de-mar',
      zone: 'Centre',
      price: 135000,
      rooms: 3,
      baths: 2,
      area: 80,
      floor: 2,
      elevator: true,
      parking: false,
      terrace: true,
      state: 'de 2ª mano',
      description: 'Piso reformado en el centro',
      photos: 2,
    });
    expect(items[0].images).toEqual(['http://fotoshs.imghs.net/a.jpg', 'http://fotoshs.imghs.net/b.jpg']);
    expect(items[0].geo).toEqual({ latitude: 41.650106, longitude: 2.741575 });
  });

  it('detecta la operación de alquiler y el municipio por slug', () => {
    expect(items[1].operation).toBe('alquiler');
    expect(items[1].town).toBe('pineda-de-mar');
    expect(items[1].geo).toBeUndefined();
  });

  it('townSlug normaliza acentos y espacios', () => {
    expect(townSlug('Santa Susanna')).toBe('santa-susanna');
    expect(townSlug('Malgrat de Mar')).toBe('malgrat-de-mar');
  });
});
