/**
 * Fotos de lugar (pueblos y costa) mientras no haya fotos propias. Decisión del dueño, 2026-11-16.
 * Cada foto se cambia aquí sin tocar componentes: misma clave town/name, otro archivo.
 * Wikimedia (CC BY-SA): crédito visible obligatorio. Pexels: sin atribución obligatoria, se acredita igual.
 * Archivos en src/assets/lugares/{town}/{name}.jpg (Astro los optimiza al compilar).
 */
import type { Lang } from '../i18n';

export interface PlacePhoto {
  town: string;
  name: string;
  /** Ruta relativa a src/. */
  file: string;
  /** Texto alternativo en los tres idiomas. Autor y licencia no se traducen. */
  alt: Record<Lang, string>;
  source: 'Wikimedia Commons' | 'Pexels';
  author: string;
  license: string;
  licenseUrl: string | null;
  url: string;
  attributionRequired: boolean;
}

export const placePhotos: PlacePhoto[] = [
  {
    town: 'malgrat-de-mar',
    name: 'panoramica',
    file: 'assets/lugares/malgrat-de-mar/panoramica.jpg',
    alt: { es: 'Panorámica de Malgrat de Mar', en: 'Panoramic view of Malgrat de Mar', ca: 'Panoràmica de Malgrat de Mar' },
    source: 'Wikimedia Commons',
    author: 'Carlos Pino Andújar',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Panoramica_Malgrat.jpg',
    attributionRequired: true
  },
  {
    town: 'malgrat-de-mar',
    name: 'parc-del-castell',
    file: 'assets/lugares/malgrat-de-mar/parc-del-castell.jpg',
    alt: { es: 'Parc del Castell, Malgrat de Mar', en: 'Parc del Castell, Malgrat de Mar', ca: 'Parc del Castell, Malgrat de Mar' },
    source: 'Wikimedia Commons',
    author: 'Madeline 7',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Malgrat_de_Mar_Parc_del_Castell.JPG',
    attributionRequired: true
  },
  {
    town: 'malgrat-de-mar',
    name: 'torre-castell',
    file: 'assets/lugares/malgrat-de-mar/torre-castell.jpg',
    alt: { es: 'Torre del castell, Parc del Castell de Malgrat de Mar', en: 'Castle tower in the Parc del Castell, Malgrat de Mar', ca: 'Torre del castell, Parc del Castell de Malgrat de Mar' },
    source: 'Wikimedia Commons',
    author: 'Carlos Pino Andújar',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    url: 'https://commons.wikimedia.org/wiki/File:TorreCastellMalgrat3.JPG',
    attributionRequired: true
  },
  {
    town: 'malgrat-de-mar',
    name: 'vista',
    file: 'assets/lugares/malgrat-de-mar/vista.jpg',
    alt: { es: 'Vista de Malgrat de Mar desde el Parc del Castell', en: 'Malgrat de Mar seen from the Parc del Castell', ca: 'Vista de Malgrat de Mar des del Parc del Castell' },
    source: 'Wikimedia Commons',
    author: 'Herodotptlomeu',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Vista_de_Malgrat_de_Mar.jpg',
    attributionRequired: true
  },
  {
    town: 'malgrat-de-mar',
    name: 'desembocadura-tordera',
    file: 'assets/lugares/malgrat-de-mar/desembocadura-tordera.jpg',
    alt: { es: 'Desembocadura del río Tordera, Malgrat de Mar', en: 'Mouth of the Tordera river, Malgrat de Mar', ca: 'Desembocadura del riu Tordera, Malgrat de Mar' },
    source: 'Wikimedia Commons',
    author: 'Carlos Pino Andújar',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    url: 'https://commons.wikimedia.org/wiki/File:RiuTordera_final.jpg',
    attributionRequired: true
  },
  {
    town: 'palafolls',
    name: 'castell',
    file: 'assets/lugares/palafolls/castell.jpg',
    alt: { es: 'Castell de Palafolls', en: 'Castell de Palafolls', ca: 'Castell de Palafolls' },
    source: 'Wikimedia Commons',
    author: 'Friviere',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    url: 'https://commons.wikimedia.org/wiki/File:CataloniaMaresmePalafollsCastell.JPG',
    attributionRequired: true
  },
  {
    town: 'palafolls',
    name: 'can-puig',
    file: 'assets/lugares/palafolls/can-puig.jpg',
    alt: { es: 'Can Puig, Palafolls', en: 'Can Puig, Palafolls', ca: 'Can Puig, Palafolls' },
    source: 'Wikimedia Commons',
    author: 'Rosa domingo',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Can_Puig_de_Palafolls.jpg',
    attributionRequired: true
  },
  {
    town: 'santa-susanna',
    name: 'vista',
    file: 'assets/lugares/santa-susanna/vista.jpg',
    alt: { es: 'Vista de Santa Susanna', en: 'View of Santa Susanna', ca: 'Vista de Santa Susanna' },
    source: 'Wikimedia Commons',
    author: 'Madeline 7',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    url: 'https://commons.wikimedia.org/wiki/File:Santa_Susanna_widok.JPG',
    attributionRequired: true
  },
  {
    town: 'tordera',
    name: 'vista',
    file: 'assets/lugares/tordera/vista.jpg',
    alt: { es: 'Tordera vista desde Miralles', en: 'Tordera seen from Miralles', ca: 'Tordera vista des de Miralles' },
    source: 'Wikimedia Commons',
    author: 'Francesc Molins',
    license: 'Public domain',
    licenseUrl: null,
    url: 'https://commons.wikimedia.org/wiki/File:Tordera_desde_miralles.JPG',
    attributionRequired: false
  },
  {
    town: 'blanes',
    name: 'castell-sant-joan',
    file: 'assets/lugares/blanes/castell-sant-joan.jpg',
    alt: { es: 'Castell de Sant Joan sobre Blanes', en: 'Castell de Sant Joan above Blanes', ca: 'Castell de Sant Joan sobre Blanes' },
    source: 'Wikimedia Commons',
    author: 'Adville',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    url: 'https://commons.wikimedia.org/wiki/File:Blanes_castell_san_juan.JPG',
    attributionRequired: true
  },
  {
    town: 'blanes',
    name: 'sa-palomera',
    file: 'assets/lugares/blanes/sa-palomera.jpg',
    alt: { es: 'Playa de Blanes con Sa Palomera', en: 'Blanes beach with Sa Palomera', ca: 'Platja de Blanes amb sa Palomera' },
    source: 'Pexels',
    author: 'WeareDjBl',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/29339780/',
    attributionRequired: false
  },
  {
    town: 'blanes',
    name: 'puerto',
    file: 'assets/lugares/blanes/puerto.jpg',
    alt: { es: 'Puerto de Blanes', en: 'Blanes harbour', ca: 'Port de Blanes' },
    source: 'Pexels',
    author: 'Valentin Onu',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/39520705/',
    attributionRequired: false
  },
  {
    town: 'blanes',
    name: 'vista-castell',
    file: 'assets/lugares/blanes/vista-castell.jpg',
    alt: { es: 'Costa de Blanes desde el castillo de Sant Joan', en: 'The Blanes coastline from Sant Joan castle', ca: 'Costa de Blanes des del castell de Sant Joan' },
    source: 'Pexels',
    author: 'Adria Gimeno',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/31867517/',
    attributionRequired: false
  },
  {
    town: 'blanes',
    name: 'marimurtra',
    file: 'assets/lugares/blanes/marimurtra.jpg',
    alt: { es: 'Acantilados del Jardí Botànic Marimurtra, Blanes', en: 'Cliffs at the Jardí Botànic Marimurtra, Blanes', ca: 'Penya-segats del Jardí Botànic Marimurtra, Blanes' },
    source: 'Pexels',
    author: 'Manuel Torres Garcia',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/8803716/',
    attributionRequired: false
  },
  {
    town: 'lloret-de-mar',
    name: 'playa-castell',
    file: 'assets/lugares/lloret-de-mar/playa-castell.jpg',
    alt: { es: 'Playa de Lloret de Mar con el castillo', en: 'Lloret de Mar beach with the castle', ca: 'Platja de Lloret de Mar amb el castell' },
    source: 'Pexels',
    author: 'Jonas Horsch',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/38149727/',
    attributionRequired: false
  },
  {
    town: 'lloret-de-mar',
    name: 'aerea',
    file: 'assets/lugares/lloret-de-mar/aerea.jpg',
    alt: { es: 'Costa de Lloret de Mar desde el aire', en: 'The Lloret de Mar coastline from the air', ca: "Costa de Lloret de Mar des de l'aire" },
    source: 'Pexels',
    author: 'Jakub Krystkiewicz',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/28983098/',
    attributionRequired: false
  },
  {
    town: 'pineda-de-mar',
    name: 'playa-bici',
    file: 'assets/lugares/pineda-de-mar/playa-bici.jpg',
    alt: { es: 'Paseo junto a la playa de Pineda de Mar', en: 'Seafront promenade by the beach in Pineda de Mar', ca: 'Passeig vora la platja de Pineda de Mar' },
    source: 'Pexels',
    author: 'Antonio Lorenzana Bermejo',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/14283371/',
    attributionRequired: false
  },
  {
    town: 'pineda-de-mar',
    name: 'arbol-mar',
    file: 'assets/lugares/pineda-de-mar/arbol-mar.jpg',
    alt: { es: 'Árbol junto al mar en Pineda de Mar', en: 'Tree by the sea in Pineda de Mar', ca: 'Arbre vora el mar a Pineda de Mar' },
    source: 'Pexels',
    author: 'Antonio Lorenzana Bermejo',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/14283277/',
    attributionRequired: false
  },
  {
    town: 'santa-susanna',
    name: 'playa',
    file: 'assets/lugares/santa-susanna/playa.jpg',
    alt: { es: 'Playa de Santa Susanna', en: 'Santa Susanna beach', ca: 'Platja de Santa Susanna' },
    source: 'Pexels',
    author: 'Jakub Krystkiewicz',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/28936785/',
    attributionRequired: false
  },
  {
    town: 'santa-susanna',
    name: 'playa-olas',
    file: 'assets/lugares/santa-susanna/playa-olas.jpg',
    alt: { es: 'Orilla de la playa de Santa Susanna', en: 'The shoreline at Santa Susanna beach', ca: 'La vora de la platja de Santa Susanna' },
    source: 'Pexels',
    author: 'Lidia Miralles',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/33421670/',
    attributionRequired: false
  },
  {
    town: 'calella',
    name: 'playa',
    file: 'assets/lugares/calella/playa.jpg',
    alt: { es: 'Playa de Calella', en: 'Calella beach', ca: 'Platja de Calella' },
    source: 'Pexels',
    author: 'Volodymyr Oleksandrovic Kalinkin',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/33784560/',
    attributionRequired: false
  },
  {
    town: 'calella',
    name: 'faro',
    file: 'assets/lugares/calella/faro.jpg',
    alt: { es: 'Faro de Calella', en: 'Calella lighthouse', ca: 'Far de Calella' },
    source: 'Pexels',
    author: 'Volodymyr Oleksandrovic Kalinkin',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/33784531/',
    attributionRequired: false
  }
];

export const photosOf = (town: string) => placePhotos.filter((photo) => photo.town === town);
