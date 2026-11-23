import type { Lang } from '../i18n';

/** Texto de un pueblo en los tres idiomas. */
export type TownText = Record<Lang, string>;

export interface Town {
  slug: string;
  name: string;
  hasCatalog: boolean;
  /** Sin intro, el pueblo no entra en el catálogo indexable. */
  intro?: TownText;
  /** Sin sellerIntro, el pueblo no tiene página de inmobiliaria propia. */
  sellerIntro?: TownText;
  /** Texto para quien BUSCA piso en el pueblo. Sin él, la página solo habla de vender. */
  buyerIntro?: TownText;
  /** Centro aproximado del pueblo (dato público), para el mapa de zona de la ficha. No es la dirección del piso. */
  geo?: { latitude: number; longitude: number };
}

export const towns: Town[] = [
  {
    slug: 'malgrat-de-mar',
    name: 'Malgrat de Mar',
    geo: { latitude: 41.6469, longitude: 2.7419 },
    hasCatalog: true,
    intro: {
      es: 'Es nuestro pueblo y donde tenemos la oficina. Conocemos cada calle, lo que se vende rápido y lo que no.',
      en: "It's our town and where our office is. We know every street, what sells fast and what doesn't.",
      ca: "És el nostre poble i on tenim l'oficina. Coneixem cada carrer, què es ven de pressa i què no.",
    },
    sellerIntro: {
      es: 'Vendemos pisos y casas en Malgrat de Mar desde la oficina de la Av. Mediterránea.',
      en: 'We sell apartments and houses in Malgrat de Mar from our office on Av. Mediterránea.',
      ca: "Venem pisos i cases a Malgrat de Mar des de l'oficina de l'Av. Mediterránea.",
    },
  },
  {
    slug: 'blanes',
    name: 'Blanes',
    geo: { latitude: 41.6747, longitude: 2.7903 },
    hasCatalog: true,
    intro: {
      es: 'A diez minutos de la oficina. Si tienes un piso en Blanes, lo vamos a ver y te decimos cuánto vale.',
      en: "Ten minutes from the office. If you have a home in Blanes, we'll come and see it and tell you what it's worth.",
      ca: "A deu minuts de l'oficina. Si tens un pis a Blanes, el venim a veure i et diem quant val.",
    },
    sellerIntro: {
      es: 'Si quieres vender en Blanes, pasamos a ver tu piso, te decimos lo que vale y nos encargamos de todo.',
      en: "If you want to sell in Blanes, we'll come round to see your home, tell you what it's worth and take care of everything.",
      ca: 'Si vols vendre a Blanes, passem a veure el teu pis, et diem què val i ens encarreguem de tot.',
    },
    buyerIntro: {
      es: 'Lo que tenemos en venta en Blanes lo ves en su listado, con fotos y precio. Y si buscas algo concreto, dinos qué: te contamos también lo que aún no está anunciado.',
      en: "Everything we have for sale in Blanes is in its listings, with photos and prices. And if you're after something specific, tell us what: we'll also fill you in on what isn't advertised yet.",
      ca: "El que tenim en venda a Blanes ho veus al seu llistat, amb fotos i preu. I si busques una cosa concreta, digues-nos què: també t'expliquem el que encara no està anunciat.",
    },
  },
  {
    slug: 'tordera',
    name: 'Tordera',
    geo: { latitude: 41.6997, longitude: 2.7186 },
    hasCatalog: true,
    intro: {
      es: 'Aquí al lado, tierra adentro. Casas con terreno y pueblo de verdad, a un rato de la playa.',
      en: 'Right next door, a little inland. Houses with land and a proper town, a short drive from the beach.',
      ca: 'Aquí al costat, terra endins. Cases amb terreny i poble de veritat, a una estona de la platja.',
    },
    sellerIntro: {
      es: 'Si vendes en Tordera, pasamos a verlo, te decimos lo que vale y nos ocupamos de visitas y papeles.',
      en: "If you're selling in Tordera, we'll come and see it, tell you what it's worth and handle the viewings and paperwork.",
      ca: 'Si vens a Tordera, passem a veure-ho, et diem què val i ens ocupem de les visites i els papers.',
    },
    buyerIntro: {
      es: 'Mira lo que tenemos publicado en Tordera. Si no está lo tuyo —casa con terreno, piso en el centro—, dinos qué buscas y cuánto quieres gastarte y te contamos qué hay.',
      en: "Have a look at what we've got listed in Tordera. If what you want isn't there (a house with land, an apartment in the centre), tell us what you're looking for and your budget, and we'll tell you what's around.",
      ca: "Mira què tenim publicat a Tordera. Si no hi és el que vols (casa amb terreny, pis al centre), digues-nos què busques i quant et vols gastar i t'expliquem què hi ha.",
    },
  },
  {
    slug: 'pineda-de-mar',
    name: 'Pineda de Mar',
    geo: { latitude: 41.6278, longitude: 2.6903 },
    hasCatalog: true,
    intro: {
      es: 'Bajando la costa, a un paso de Malgrat. Mucho piso cerca de la playa y vecinos de todo el año.',
      en: "Down the coast, a stone's throw from Malgrat. Lots of apartments near the beach and neighbours who live here all year round.",
      ca: "Costa avall, a tocar de Malgrat. Molts pisos a prop de la platja i veïns de tot l'any.",
    },
    sellerIntro: {
      es: 'Si vendes en Pineda, vamos a ver tu piso, te decimos lo que vale hoy y llevamos visitas y papeles.',
      en: "If you're selling in Pineda, we'll come and see your home, tell you what it's worth today and handle viewings and paperwork.",
      ca: 'Si vens a Pineda, venim a veure el teu pis, et diem què val avui i portem les visites i els papers.',
    },
    buyerIntro: {
      es: 'Lo que tenemos en Pineda está en su listado. Si buscas otra cosa, dinos qué y para qué, y te contamos lo que se mueve, también lo que no está anunciado.',
      en: "What we have in Pineda is in its listings. If you're after something else, tell us what and what for, and we'll tell you what's moving, including what isn't advertised.",
      ca: "El que tenim a Pineda és al seu llistat. Si busques una altra cosa, digues-nos què i per a què, i t'expliquem què es mou, també el que no està anunciat.",
    },
  },
  {
    slug: 'santa-susanna',
    name: 'Santa Susanna',
    geo: { latitude: 41.6367, longitude: 2.71 },
    hasCatalog: true,
    intro: {
      es: 'Nuestra vecina de al lado, entre Malgrat y Pineda. Pueblo pequeño, playa ancha y mucho apartamento.',
      en: 'Our next-door neighbour, between Malgrat and Pineda. A small town, a wide beach and lots of apartments.',
      ca: 'La nostra veïna del costat, entre Malgrat i Pineda. Poble petit, platja ampla i molts apartaments.',
    },
    sellerIntro: {
      es: 'Vendes en Santa Susanna: pasamos a verlo, te damos un precio con los pies en el suelo y nos ocupamos del resto.',
      en: "Selling in Santa Susanna? We'll come and see it, give you a down-to-earth price and sort out the rest.",
      ca: 'Vens a Santa Susanna: passem a veure-ho, et donem un preu amb els peus a terra i ens ocupem de la resta.',
    },
    buyerIntro: {
      es: 'Mira lo que tenemos en venta en Santa Susanna. Si no encaja, cuéntanos qué necesitas y te decimos qué se mueve por aquí.',
      en: "Have a look at what we have for sale in Santa Susanna. If nothing fits, tell us what you need and we'll tell you what's moving around here.",
      ca: "Mira què tenim en venda a Santa Susanna. Si no encaixa, explica'ns què necessites i et diem què es mou per aquí.",
    },
  },
  {
    slug: 'palafolls',
    name: 'Palafolls',
    geo: { latitude: 41.6694, longitude: 2.7514 },
    hasCatalog: true,
    intro: {
      es: 'Justo detrás de Malgrat, ya tierra adentro. Casas con terreno, tranquilidad y el pueblo a mano.',
      en: 'Just behind Malgrat, a little inland. Houses with land, peace and quiet, and the town close at hand.',
      ca: 'Just darrere de Malgrat, ja terra endins. Cases amb terreny, tranquil·litat i el poble a mà.',
    },
    sellerIntro: {
      es: 'Si tienes casa o piso en Palafolls y quieres venderlo, lo vemos, te decimos lo que vale y nos encargamos de todo.',
      en: "If you have a house or apartment in Palafolls and want to sell it, we'll see it, tell you what it's worth and take care of everything.",
      ca: 'Si tens casa o pis a Palafolls i el vols vendre, el veiem, et diem què val i ens encarreguem de tot.',
    },
    buyerIntro: {
      es: 'En Palafolls tienes publicado lo que tenemos ahora mismo. ¿Buscas casa con terreno o piso en el centro y no lo ves? Dínoslo y te avisamos.',
      en: "Everything we have in Palafolls right now is listed. Looking for a house with land or an apartment in the centre and can't see one? Tell us and we'll let you know.",
      ca: "A Palafolls tens publicat el que tenim ara mateix. Busques casa amb terreny o pis al centre i no el veus? Digues-nos-ho i t'avisem.",
    },
  },
  {
    slug: 'calella',
    name: 'Calella',
    geo: { latitude: 41.6147, longitude: 2.6556 },
    hasCatalog: true,
    intro: {
      es: 'Un poco más al sur, pueblo grande de costa. Centro con vida todo el año y mucha compra de fuera.',
      en: 'A bit further south, a big coastal town. The centre is lively all year and lots of buyers come from elsewhere.',
      ca: "Una mica més al sud, poble gran de costa. Centre amb vida tot l'any i molta compra de fora.",
    },
    sellerIntro: {
      es: 'Vendes en Calella: vamos a verlo, te decimos el precio de verdad y llevamos la venta de principio a fin.',
      en: "Selling in Calella? We'll come and see it, give you the honest price and handle the sale from start to finish.",
      ca: 'Vens a Calella: venim a veure-ho, et diem el preu de veritat i portem la venda de principi a fi.',
    },
    buyerIntro: {
      es: 'Lo que tenemos en Calella lo tienes en su listado, con el precio a la vista. Si buscas otra cosa, dinos qué y para qué lo quieres y te contamos qué hay.',
      en: "What we have in Calella is in its listings, with the price on show. If you're after something else, tell us what and what it's for and we'll tell you what's around.",
      ca: "El que tenim a Calella ho tens al seu llistat, amb el preu a la vista. Si busques una altra cosa, digues-nos què i per a què el vols i t'expliquem què hi ha.",
    },
  },
  {
    slug: 'lloret-de-mar',
    name: 'Lloret de Mar',
    geo: { latitude: 41.7, longitude: 2.845 },
    hasCatalog: true,
    intro: {
      es: 'Subiendo por la costa, ya en la Costa Brava. Mucho apartamento de temporada y mucha compra de fuera.',
      en: 'Up the coast, already on the Costa Brava. Lots of holiday apartments and lots of buyers from elsewhere.',
      ca: 'Costa amunt, ja a la Costa Brava. Molts apartaments de temporada i molta compra de fora.',
    },
    sellerIntro: {
      es: 'Si tienes un piso en Lloret y quieres venderlo, vamos a verlo y te decimos lo que vale de verdad hoy.',
      en: "If you have an apartment in Lloret and want to sell it, we'll come and see it and tell you what it's really worth today.",
      ca: "Si tens un pis a Lloret i el vols vendre, venim a veure'l i et diem què val de veritat avui.",
    },
    buyerIntro: {
      es: 'Lo que tenemos en Lloret lo ves en su listado. Cuéntanos para qué lo quieres —vivir, alquilar, veranear— y te ayudamos a elegir, también entre lo que aún no está anunciado.',
      en: "What we have in Lloret is in its listings. Tell us what you want it for (to live in, to rent out, for the summers) and we'll help you choose, including from what isn't advertised yet.",
      ca: "El que tenim a Lloret ho veus al seu llistat. Explica'ns per a què el vols (viure-hi, llogar-lo, estiuejar) i t'ajudem a triar, també entre el que encara no està anunciat.",
    },
  },
  // Municipios del Excel de inventario sin ficha editorial propia todavía.
  // hasCatalog:true porque tienen >=1 propiedad en venta; sin intro/sellerIntro
  // a propósito: no se publican páginas de captación vacías.
  {
    slug: 'arbucies',
    name: 'Arbúcies',
    hasCatalog: true,
    intro: {
      es: 'En plena Selva, al pie del Montseny. Casas de pueblo y de montaña; tenemos alguna en venta, así que si te tira la zona, pregúntanos.',
      en: 'Deep in La Selva, at the foot of the Montseny. Village and mountain houses; we have a few for sale, so if the area appeals, ask us.',
      ca: "En plena Selva, als peus del Montseny. Cases de poble i de muntanya; en tenim alguna en venda, així que si et tira la zona, pregunta'ns.",
    },
  },
  { slug: 'besalu', name: 'Besalú', hasCatalog: true },
  {
    slug: 'caldes-de-malavella',
    name: 'Caldes de Malavella',
    hasCatalog: true,
    intro: {
      es: 'Pueblo de La Selva famoso por sus aguas termales, entre Girona y la costa. Tenemos algún inmueble en venta; dinos qué buscas y te lo enseñamos.',
      en: "A La Selva town known for its thermal springs, between Girona and the coast. We have a property or two for sale; tell us what you're looking for and we'll show you.",
      ca: "Poble de La Selva famós per les aigües termals, entre Girona i la costa. Tenim algun immoble en venda; digues-nos què busques i te l'ensenyem.",
    },
  },
  { slug: 'carretera-de-santa-coloma', name: 'Carretera de Santa Coloma', hasCatalog: true },
  { slug: 'comajuliana', name: 'Comajuliana', hasCatalog: true },
  { slug: 'el-serrat', name: 'El Serrat', hasCatalog: true },
  {
    slug: 'fogars-de-la-selva',
    name: 'Fogars de la Selva',
    hasCatalog: true,
    intro: {
      es: 'Entre el Maresme y La Selva, siguiendo el río Tordera. Pueblo pequeño con casas y terreno; pregúntanos por lo que tenemos.',
      en: 'Between the Maresme and La Selva, along the Tordera river. A small village with houses and land; ask us about what we have.',
      ca: "Entre el Maresme i La Selva, seguint el riu Tordera. Poble petit amb cases i terreny; pregunta'ns pel que tenim.",
    },
  },
  { slug: 'hostalric', name: 'Hostalric', hasCatalog: true },
  {
    slug: 'macanet-de-la-selva',
    name: 'Maçanet de la Selva',
    hasCatalog: true,
    intro: {
      es: 'Ya en La Selva, tierra adentro pasada la autopista. Aquí sí tenemos varios pisos y casas; dinos qué buscas y te enseñamos lo que hay.',
      en: "Into La Selva, inland past the motorway. Here we do have several apartments and houses; tell us what you're after and we'll show you what there is.",
      ca: "Ja a La Selva, terra endins passada l'autopista. Aquí sí que tenim uns quants pisos i cases; digues-nos què busques i t'ensenyem el que hi ha.",
    },
  },
  { slug: 'massanes', name: 'Massanes', hasCatalog: true },
  {
    slug: 'riudarenes',
    name: 'Riudarenes',
    hasCatalog: true,
    intro: {
      es: 'Pueblo tranquilo de La Selva, de campo y casas con espacio. Aquí tenemos alguna propiedad en venta; te la enseñamos sin compromiso.',
      en: "A quiet La Selva village, all countryside and roomy houses. We have a property or two for sale here; we'll show you round, no strings attached.",
      ca: "Poble tranquil de La Selva, de camp i cases amb espai. Aquí tenim alguna propietat en venda; te l'ensenyem sense compromís.",
    },
  },
  { slug: 'sant-cebria-de-vallalta', name: 'Sant Cebrià de Vallalta', hasCatalog: true },
  { slug: 'sant-genis-de-palafolls', name: 'Sant Genís de Palafolls', hasCatalog: true },
  { slug: 'sant-hilari-sacalm', name: 'Sant Hilari Sacalm', hasCatalog: true },
  { slug: 'sils', name: 'Sils', hasCatalog: true },
  { slug: 'vidreres', name: 'Vidreres', hasCatalog: true },
  { slug: 'vilobi-d-onyar', name: "Vilobí d'Onyar", hasCatalog: true },
];

// Solo entran al catálogo indexable los pueblos con intro escrita. Los que el feed trae con
// 1 piso suelto (o que son zonas, no municipios) se quedan fuera para no indexar páginas finas;
// sus pisos siguen apareciendo en el listado general y en su ficha.
export const publishedCatalogTowns = towns.filter((town) => town.hasCatalog && town.intro);
/**
 * Pueblos con página propia. Solo los que tienen texto real escrito: Blanes,
 * Tordera y Lloret son además el hueco que la competencia no cubre. El resto
 * se queda fuera a propósito para no publicar páginas vacías.
 */
export const publishedSellerTowns = towns.filter((town) => town.sellerIntro);

export function findTown(slug: string): Town | undefined {
  return towns.find((town) => town.slug === slug);
}
