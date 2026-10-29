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
      'Todavía no publicamos los pisos de Blanes en la web, así que aquí no vas a ver un listado. Lo que sí hacemos: nos dices qué buscas y te decimos qué hay, también lo que aún no está anunciado.',
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
      'En Tordera no tenemos catálogo publicado todavía. Dinos qué buscas —casa con terreno, piso en el centro, presupuesto— y te contamos qué hay.',
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
      'En Pineda aún no colgamos catálogo en la web. Dinos qué buscas y para qué, y te contamos qué hay, también lo que no está anunciado.',
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
      'Todavía no tenemos listado de Santa Susanna en la web. Cuéntanos qué necesitas y te decimos qué se mueve por aquí.',
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
      'En Palafolls no publicamos catálogo por ahora. Dinos qué buscas —casa con terreno, piso en el centro— y te decimos qué hay.',
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
      'En Calella aún no verás un listado en la web. Nos dices qué buscas y para qué lo quieres, y te contamos qué hay.',
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
      'En Lloret todavía no publicamos catálogo en la web. Cuéntanos qué buscas y para qué lo quieres —vivir, alquilar, veranear— y te decimos qué hay.',
  },
  // Municipios del Excel de inventario sin ficha editorial propia todavía.
  // hasCatalog:true porque tienen >=1 propiedad en venta; intro/sellerIntro
  // vacíos a propósito: no se publican páginas de captación vacías.
  { slug: 'arbucies', name: 'Arbúcies', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'besalu', name: 'Besalú', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'caldes-de-malavella', name: 'Caldes de Malavella', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'carretera-de-santa-coloma', name: 'Carretera de Santa Coloma', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'comajuliana', name: 'Comajuliana', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'el-serrat', name: 'El Serrat', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'fogars-de-la-selva', name: 'Fogars de la Selva', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'hostalric', name: 'Hostalric', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'macanet-de-la-selva', name: 'Maçanet de la Selva', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'massanes', name: 'Massanes', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'riudarenes', name: 'Riudarenes', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sant-cebria-de-vallalta', name: 'Sant Cebrià de Vallalta', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sant-genis-de-palafolls', name: 'Sant Genís de Palafolls', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sant-hilari-sacalm', name: 'Sant Hilari Sacalm', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'sils', name: 'Sils', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'vidreres', name: 'Vidreres', hasCatalog: true, intro: '', sellerIntro: '' },
  { slug: 'vilobi-d-onyar', name: "Vilobí d'Onyar", hasCatalog: true, intro: '', sellerIntro: '' },
];

export const publishedCatalogTowns = towns.filter((town) => town.hasCatalog);
/**
 * Pueblos con página propia. Solo los que tienen texto real escrito: Blanes,
 * Tordera y Lloret son además el hueco que la competencia no cubre. El resto
 * se queda fuera a propósito para no publicar páginas vacías.
 */
export const publishedSellerTowns = towns.filter((town) => town.sellerIntro !== '');

export function findTown(slug: string): Town | undefined {
  return towns.find((town) => town.slug === slug);
}
