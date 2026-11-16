export interface Town {
  slug: string;
  name: string;
  hasCatalog: boolean;
  intro: string;
  sellerIntro: string;
  /** Texto para quien BUSCA piso en el pueblo. Vacío = la página solo habla de vender. */
  buyerIntro?: string;
  /** Centro aproximado del pueblo (dato público), para el mapa de zona de la ficha. No es la dirección del piso. */
  geo?: { latitude: number; longitude: number };
}

export const towns: Town[] = [
  {
    slug: 'malgrat-de-mar',
    name: 'Malgrat de Mar',
    geo: { latitude: 41.6469, longitude: 2.7419 },
    hasCatalog: true,
    intro:
      'Es nuestro pueblo y donde tenemos la oficina. Conocemos cada calle, lo que se vende rápido y lo que no.',
    sellerIntro: 'Vendemos pisos y casas en Malgrat de Mar desde la oficina de la Av. Mediterránea.',
  },
  {
    slug: 'blanes',
    name: 'Blanes',
    geo: { latitude: 41.6747, longitude: 2.7903 },
    hasCatalog: true,
    intro: 'A diez minutos de la oficina. Si tienes un piso en Blanes, lo vamos a ver y te decimos cuánto vale.',
    sellerIntro:
      'Si quieres vender en Blanes, pasamos a ver tu piso, te decimos lo que vale y nos encargamos de todo.',
    buyerIntro:
      'Lo que tenemos en venta en Blanes lo ves en su listado, con fotos y precio. Y si buscas algo concreto, dinos qué: te contamos también lo que aún no está anunciado.',
  },
  {
    slug: 'tordera',
    name: 'Tordera',
    geo: { latitude: 41.6997, longitude: 2.7186 },
    hasCatalog: true,
    intro: 'Aquí al lado, tierra adentro. Casas con terreno y pueblo de verdad, a un rato de la playa.',
    sellerIntro:
      'Si vendes en Tordera, pasamos a verlo, te decimos lo que vale y nos ocupamos de visitas y papeles.',
    buyerIntro:
      'Mira lo que tenemos publicado en Tordera. Si no está lo tuyo —casa con terreno, piso en el centro—, dinos qué buscas y cuánto quieres gastarte y te contamos qué hay.',
  },
  {
    slug: 'pineda-de-mar',
    name: 'Pineda de Mar',
    geo: { latitude: 41.6278, longitude: 2.6903 },
    hasCatalog: true,
    intro: 'Bajando la costa, a un paso de Malgrat. Mucho piso cerca de la playa y vecinos de todo el año.',
    sellerIntro:
      'Si vendes en Pineda, vamos a ver tu piso, te decimos lo que vale hoy y llevamos visitas y papeles.',
    buyerIntro:
      'Lo que tenemos en Pineda está en su listado. Si buscas otra cosa, dinos qué y para qué, y te contamos lo que se mueve, también lo que no está anunciado.',
  },
  {
    slug: 'santa-susanna',
    name: 'Santa Susanna',
    geo: { latitude: 41.6367, longitude: 2.71 },
    hasCatalog: true,
    intro: 'Nuestra vecina de al lado, entre Malgrat y Pineda. Pueblo pequeño, playa ancha y mucho apartamento.',
    sellerIntro:
      'Vendes en Santa Susanna: pasamos a verlo, te damos un precio con los pies en el suelo y nos ocupamos del resto.',
    buyerIntro:
      'Mira lo que tenemos en venta en Santa Susanna. Si no encaja, cuéntanos qué necesitas y te decimos qué se mueve por aquí.',
  },
  {
    slug: 'palafolls',
    name: 'Palafolls',
    geo: { latitude: 41.6694, longitude: 2.7514 },
    hasCatalog: true,
    intro: 'Justo detrás de Malgrat, ya tierra adentro. Casas con terreno, tranquilidad y el pueblo a mano.',
    sellerIntro:
      'Si tienes casa o piso en Palafolls y quieres venderlo, lo vemos, te decimos lo que vale y nos encargamos de todo.',
    buyerIntro:
      'En Palafolls tienes publicado lo que tenemos ahora mismo. ¿Buscas casa con terreno o piso en el centro y no lo ves? Dínoslo y te avisamos.',
  },
  {
    slug: 'calella',
    name: 'Calella',
    geo: { latitude: 41.6147, longitude: 2.6556 },
    hasCatalog: true,
    intro: 'Un poco más al sur, pueblo grande de costa. Centro con vida todo el año y mucha compra de fuera.',
    sellerIntro:
      'Vendes en Calella: vamos a verlo, te decimos el precio de verdad y llevamos la venta de principio a fin.',
    buyerIntro:
      'Lo que tenemos en Calella lo tienes en su listado, con el precio a la vista. Si buscas otra cosa, dinos qué y para qué lo quieres y te contamos qué hay.',
  },
  {
    slug: 'lloret-de-mar',
    name: 'Lloret de Mar',
    geo: { latitude: 41.7, longitude: 2.845 },
    hasCatalog: true,
    intro: 'Subiendo por la costa, ya en la Costa Brava. Mucho apartamento de temporada y mucha compra de fuera.',
    sellerIntro:
      'Si tienes un piso en Lloret y quieres venderlo, vamos a verlo y te decimos lo que vale de verdad hoy.',
    buyerIntro:
      'Lo que tenemos en Lloret lo ves en su listado. Cuéntanos para qué lo quieres —vivir, alquilar, veranear— y te ayudamos a elegir, también entre lo que aún no está anunciado.',
  },
  // Municipios del Excel de inventario sin ficha editorial propia todavía.
  // hasCatalog:true porque tienen >=1 propiedad en venta; intro/sellerIntro
  // vacíos a propósito: no se publican páginas de captación vacías.
  { slug: 'arbucies', name: 'Arbúcies', hasCatalog: true, intro: 'En plena Selva, al pie del Montseny. Casas de pueblo y de montaña; tenemos alguna en venta, así que si te tira la zona, pregúntanos.', sellerIntro: '' },
  { slug: 'besalu', name: 'Besalú', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'caldes-de-malavella', name: 'Caldes de Malavella', hasCatalog: true, intro: 'Pueblo de La Selva famoso por sus aguas termales, entre Girona y la costa. Tenemos algún inmueble en venta; dinos qué buscas y te lo enseñamos.', sellerIntro: '' },
  { slug: 'carretera-de-santa-coloma', name: 'Carretera de Santa Coloma', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'comajuliana', name: 'Comajuliana', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'el-serrat', name: 'El Serrat', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'fogars-de-la-selva', name: 'Fogars de la Selva', hasCatalog: true, intro: 'Entre el Maresme y La Selva, siguiendo el río Tordera. Pueblo pequeño con casas y terreno; pregúntanos por lo que tenemos.', sellerIntro: '' },
  { slug: 'hostalric', name: 'Hostalric', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'macanet-de-la-selva', name: 'Maçanet de la Selva', hasCatalog: true, intro: 'Ya en La Selva, tierra adentro pasada la autopista. Aquí sí tenemos varios pisos y casas; dinos qué buscas y te enseñamos lo que hay.', sellerIntro: '' },
  { slug: 'massanes', name: 'Massanes', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'riudarenes', name: 'Riudarenes', hasCatalog: true, intro: 'Pueblo tranquilo de La Selva, de campo y casas con espacio. Aquí tenemos alguna propiedad en venta; te la enseñamos sin compromiso.', sellerIntro: '' },
  { slug: 'sant-cebria-de-vallalta', name: 'Sant Cebrià de Vallalta', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sant-genis-de-palafolls', name: 'Sant Genís de Palafolls', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sant-hilari-sacalm', name: 'Sant Hilari Sacalm', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sils', name: 'Sils', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'vidreres', name: 'Vidreres', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'vilobi-d-onyar', name: "Vilobí d'Onyar", hasCatalog: true, intro: '', sellerIntro: '' },
];

// Solo entran al catálogo indexable los pueblos con intro escrita. Los que el feed trae con
// 1 piso suelto (o que son zonas, no municipios) se quedan fuera para no indexar páginas finas;
// sus pisos siguen apareciendo en el listado general y en su ficha.
export const publishedCatalogTowns = towns.filter((town) => town.hasCatalog && town.intro !== '');
/**
 * Pueblos con página propia. Solo los que tienen texto real escrito: Blanes,
 * Tordera y Lloret son además el hueco que la competencia no cubre. El resto
 * se queda fuera a propósito para no publicar páginas vacías.
 */
export const publishedSellerTowns = towns.filter((town) => town.sellerIntro !== '');

export function findTown(slug: string): Town | undefined {
  return towns.find((town) => town.slug === slug);
}
