/**
 * Fotos de lugar (pueblos y costa) mientras no haya fotos propias. Decisión del dueño, 2026-11-16.
 * Cada foto se cambia aquí sin tocar componentes: misma clave town/name, otro archivo.
 * Wikimedia (CC BY-SA): crédito visible obligatorio. Pexels: sin atribución obligatoria, se acredita igual.
 * Archivos en src/assets/lugares/{town}/{name}.jpg (Astro los optimiza al compilar).
 */
export interface PlacePhoto {
  town: string;
  name: string;
  /** Ruta relativa a src/. */
  file: string;
  alt: string;
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
    alt: 'Panorámica de Malgrat de Mar',
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
    alt: 'Parc del Castell, Malgrat de Mar',
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
    alt: 'Torre del castell, Parc del Castell de Malgrat de Mar',
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
    alt: 'Vista de Malgrat de Mar desde el Parc del Castell',
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
    alt: 'Desembocadura del río Tordera, Malgrat de Mar',
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
    alt: 'Castell de Palafolls',
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
    alt: 'Can Puig, Palafolls',
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
    alt: 'Vista de Santa Susanna',
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
    alt: 'Tordera vista desde Miralles',
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
    alt: 'Castell de Sant Joan sobre Blanes',
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
    alt: 'Playa de Blanes con Sa Palomera',
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
    alt: 'Puerto de Blanes',
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
    alt: 'Costa de Blanes desde el castillo de Sant Joan',
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
    alt: 'Acantilados del Jardí Botànic Marimurtra, Blanes',
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
    alt: 'Playa de Lloret de Mar con el castillo',
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
    alt: 'Costa de Lloret de Mar desde el aire',
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
    alt: 'Paseo junto a la playa de Pineda de Mar',
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
    alt: 'Árbol junto al mar en Pineda de Mar',
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
    alt: 'Playa de Santa Susanna',
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
    alt: 'Orilla de la playa de Santa Susanna',
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
    alt: 'Playa de Calella',
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
    alt: 'Faro de Calella',
    source: 'Pexels',
    author: 'Volodymyr Oleksandrovic Kalinkin',
    license: 'Licencia Pexels',
    licenseUrl: 'https://www.pexels.com/license/',
    url: 'https://www.pexels.com/photo/33784531/',
    attributionRequired: false
  }
];

export const photosOf = (town: string) => placePhotos.filter((photo) => photo.town === town);
