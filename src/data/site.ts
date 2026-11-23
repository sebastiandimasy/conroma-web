import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import borisPhoto from '../assets/equipo/boris-conde-jr.jpg';
import boardPhoto from '../assets/equipo/conroma-74.jpg';
import heroPhoto from '../assets/equipo/conroma-82.jpg';
import heroPhotoPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import officePhoto from '../assets/equipo/conroma-102.jpg';
import deskPhoto from '../assets/equipo/conroma-91.jpg';

/** Texto visible en los tres idiomas: quien lo pinta hace `campo[lang]`. */
type T<V> = Record<Lang, V>;

export interface SiteData {
  name: string;
  legalName: string;
  /** Sociedad titular (aviso legal y privacidad). legalName es el nombre comercial. */
  company: { name: string; nif: string; registeredAddress: string; registry: string };
  url: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: { street: string; postalCode: string; locality: string; region: string; country: string };
  geo: { latitude: number; longitude: number } | null;
  // Horario de oficina para openingHoursSpecification. days = nombres de día schema.org.
  openingHours: { days: string[]; opens: string; closes: string }[] | null;
  // Ficha de Google por CID (reseñas/cómo llegar) y src del mapa embebido.
  mapsUrl: string;
  mapEmbedUrl: string;
  googleRating: { value: number; count: number; checkedOn: string; url: string } | null;
  yearsActive: number | null;
  feePercent: number | null;
  agent: { name: string; photo: string } | null;
  landline: string;
  landlineDisplay: string;
  heroImage: { src: ImageMetadata; portrait: ImageMetadata; alt: T<string> } | null;
  teamPhotos: { src: ImageMetadata; alt: T<string> }[];
  ceo: {
    name: string;
    role: T<string>;
    photo: { src: ImageMetadata; alt: T<string> } | null;
    bio: T<string[]>;
    bioPending: boolean;
    // Frase de cierre destacada bajo la bio. null la oculta.
    closing: T<string> | null;
    facts: T<{ label: string; value: string }[]>;
  } | null;
  languages: string[];
  /** Muestra el aviso "web en construcción" mientras faltan fotos. */
  sampleData: boolean;
  /**
   * Permite que Google indexe la cartera (listados y fichas). Mientras está en
   * `false`, 149 páginas —el activo SEO más grande del sitio, una por pueblo y
   * una por inmueble— quedan fuera del índice y del sitemap.
   * Ponerlo en `true` es la decisión del dueño: 118 de los 126 inmuebles ya
   * tienen fotos, y los 8 que no las tienen se quedan fuera igualmente.
   */
  catalogIndexable: boolean;
  /**
   * De dónde salen los inmuebles.
   *
   * `'json'`  → `properties.real.json`, el volcado del inventario. Es lo que
   *             hay hoy y funciona sin depender de nada.
   * `'supabase'` → la tabla `property`, que alimenta el CRM.
   *
   * **Este es el botón de marcha atrás de la Fase 1.** Si el gestor de pisos
   * da problemas después de migrar, se pone `'json'` y la web vuelve a servir
   * el volcado al instante: el catálogo público no se cae por culpa del CRM.
   * Toda lectura de inmuebles pasa por `getListings()`, así que no hay que
   * tocar ninguna página.
   */
  inventarioDesde: 'json' | 'supabase';
  instagram: { handle: string; url: string; about: T<string> }[];
  // Publicaciones (reels o posts) a embeber. Lista vacía = la sección no se muestra.
  instagramVideos: { url: string; label: T<string>; video?: string }[];
  // Perfil de TikTok. null oculta el botón.
  tiktok: string | null;
  about: T<string[]>;
}

const videoLabel = { es: 'Ver vídeo en Instagram', en: 'Watch the video on Instagram', ca: 'Mira el vídeo a Instagram' };

export const site: SiteData = {
  name: 'Conroma',
  legalName: 'Conroma Asesores Inmobiliarios',
  // Titular confirmado por el dueño el 19-nov: Conroma Asesores S.L. (el aviso legal de la web
  // antigua decía Conroma La Selva S.L., que es otra sociedad). Faltan NIF, domicilio social y
  // registro mercantil: mientras estén vacíos, los legales omiten esas líneas. Falta el nº AICAT.
  company: {
    name: 'Conroma Asesores S.L.',
    nif: '',
    registeredAddress: '',
    registry: '',
  },
  url: 'https://conromaasesores.com',
  phone: '+34626378687',
  phoneDisplay: '626 378 687',
  whatsapp: '34626378687',
  email: 'gestion@conromaasesores.com',
  address: {
    street: 'Av. Mediterránea 16',
    postalCode: '08380',
    locality: 'Malgrat de Mar',
    region: 'Barcelona',
    country: 'ES',
  },
  geo: { latitude: 41.650106, longitude: 2.741575 },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '14:00' },
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:30', closes: '19:30' },
  ],
  mapsUrl: 'https://www.google.com/maps?cid=18024108401007901977',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2981.2608408826322!2d2.7415753763525395!3d41.650105971267614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12bb3df627060cef%3A0xfa227f184b35bd19!2sCONROMA%20ASESORES%20INMOBILIARIOS%20%7C%20MALGRAT%20DE%20MAR!5e0!3m2!1ses!2ses!4v1792931494414!5m2!1ses!2ses',
  googleRating: {
    value: 4.7,
    count: 122,
    checkedOn: '2026-11-18',
    url: 'https://www.google.com/maps?cid=18024108401007901977',
  },
  yearsActive: 7,
  feePercent: null,
  agent: null,
  landline: '+34937610353',
  landlineDisplay: '937 61 03 53',
  heroImage: {
    src: heroPhoto,
    portrait: heroPhotoPortrait,
    alt: {
      es: 'Tres personas del equipo de Conroma revisando una operación en la oficina',
      en: 'Three members of the Conroma team going over a sale at the office',
      ca: "Tres persones de l’equip de Conroma revisant una operació a l’oficina",
    },
  },
  teamPhotos: [
    {
      src: deskPhoto,
      alt: {
        es: 'Una persona del equipo de Conroma trabajando en el ordenador',
        en: 'A member of the Conroma team working at the computer',
        ca: "Una persona de l’equip de Conroma treballant amb l’ordinador",
      },
    },
    {
      src: officePhoto,
      alt: {
        es: 'Dos personas del equipo de Conroma en la oficina',
        en: 'Two members of the Conroma team at the office',
        ca: "Dues persones de l’equip de Conroma a l’oficina",
      },
    },
    {
      src: boardPhoto,
      alt: {
        es: 'Una persona del equipo de Conroma explicando una operación en la pizarra',
        en: 'A member of the Conroma team explaining a sale on the whiteboard',
        ca: "Una persona de l’equip de Conroma explicant una operació a la pissarra",
      },
    },
  ],
  ceo: {
    name: 'Boris Conde Jr.',
    role: {
      es: 'CEO y fundador de Conroma Asesores Inmobiliarios',
      en: 'CEO and founder of Conroma Asesores Inmobiliarios',
      ca: 'CEO i fundador de Conroma Asesores Inmobiliarios',
    },
    photo: {
      src: borisPhoto,
      alt: {
        es: 'Boris Conde Jr., CEO y fundador de Conroma Asesores',
        en: 'Boris Conde Jr., CEO and founder of Conroma Asesores',
        ca: 'Boris Conde Jr., CEO i fundador de Conroma Asesores',
      },
    },
    bio: { es: [
      'Mi historia en el sector inmobiliario empezó a los 18 años, cuando entré en la inmobiliaria de mi padre. Lo que era una oportunidad para conocer el negocio desde dentro acabó siendo mi profesión, mi proyecto personal y una de mis grandes pasiones.',
      'Tres años después decidí emprender mi propio camino y crear una agencia con una visión más moderna y tecnológica del sector. Los comienzos no fueron fáciles, pero la constancia y la confianza de nuestros clientes nos han permitido construir una empresa sólida, con una cartera que nos confía algo tan importante como su patrimonio, sus inversiones y sus proyectos de vida.',
      'En estos siete años he conocido el mercado desde muchas perspectivas: la intermediación en compraventas, la inversión, el flipping, la compra para alquiler y la reforma de inmuebles. Eso me ha enseñado que una propiedad no es solo un inmueble: es una oportunidad, una inversión y, muchas veces, el esfuerzo de toda una vida.',
      'Mi forma de trabajar combina la seriedad y la organización con un trato cercano y directo. Para mí estas operaciones son el día a día; para muchos clientes, decisiones que toman una o dos veces en la vida. Por eso mi trabajo no es solo encontrar soluciones, sino transmitir tranquilidad, explicar cada paso con claridad y acompañarte durante todo el proceso.',
      'Me considero resolutivo, comprometido y perseverante. Cuando una operación se atasca, busco una última alternativa antes de darla por perdida. Muchas veces la diferencia no está en que las cosas sean fáciles, sino en tener a alguien al otro lado dispuesto a implicarse de verdad.',
      'Y, por encima de todo, soy de aquí. Me gusta conocer a la gente, pasear por nuestros pueblos y tomar algo en una terraza. Conocer el territorio no es solo saber qué se vende: es entender cómo vive la gente y qué hace especial a cada lugar.',
      'Conroma es el proyecto que he construido con esfuerzo, y mi objetivo es que siga creciendo sin perder lo esencial: la confianza, la implicación y el trato personal. Porque detrás de cada inmueble hay una historia, y detrás de cada operación, una persona que merece sentirse bien acompañada.',
    ],
    en: [
      "My story in property began at 18, when I joined my father’s estate agency. What started as a chance to learn the business from the inside ended up being my profession, my own project and one of my great passions.",
      "Three years later I decided to go my own way and set up an agency with a more modern, tech-minded view of the business. The early days weren’t easy, but hard work and the trust of our clients have let us build a solid company, with clients who trust us with things as important as their property, their investments and their plans for the future.",
      "Over these seven years I’ve seen the market from many angles: brokering sales, investing, flipping, buying to let and renovating. It’s taught me that a property is more than bricks and mortar. It’s an opportunity, an investment and, very often, a lifetime of hard work.",
      "The way I work mixes seriousness and organisation with a close, straightforward manner. For me these deals are everyday work; for many clients, they’re decisions they make once or twice in their lives. So my job isn’t only to find solutions. It’s to give you peace of mind, explain each step clearly and stay with you through the whole process.",
      "I’d say I’m someone who gets things done, committed and stubborn in the good sense. When a deal gets stuck, I look for one last way through before giving it up. Often the difference isn’t that things are easy, but having someone on the other side who’s willing to really get involved.",
      "And, above all, I’m from here. I like getting to know people, walking round our towns and having a drink on a terrace. Knowing the area isn’t just knowing what sells. It’s understanding how people live and what makes each place special.",
      "Conroma is the project I’ve built with a lot of effort, and I want it to keep growing without losing what matters: trust, commitment and personal service. Because behind every property there’s a story, and behind every deal, a person who deserves to feel properly looked after.",
    ],
    ca: [
      "La meva història al sector immobiliari va començar als 18 anys, quan vaig entrar a la immobiliària del meu pare. El que era una oportunitat per conèixer el negoci des de dins va acabar sent la meva professió, el meu projecte personal i una de les meves grans passions.",
      "Tres anys després vaig decidir fer el meu propi camí i crear una agència amb una visió més moderna i tecnològica del sector. Els inicis no van ser fàcils, però la constància i la confiança dels nostres clients ens han permès construir una empresa sòlida, amb una cartera de clients que ens confia una cosa tan important com el seu patrimoni, les seves inversions i els seus projectes de vida.",
      "En aquests set anys he conegut el mercat des de molts angles: la intermediació en compravendes, la inversió, el flipping, la compra per llogar i la reforma d’immobles. Això m’ha ensenyat que una propietat no és només un immoble: és una oportunitat, una inversió i, moltes vegades, l’esforç de tota una vida.",
      "La meva manera de treballar combina la serietat i l’organització amb un tracte proper i directe. Per a mi aquestes operacions són el dia a dia; per a molts clients, decisions que prenen una o dues vegades a la vida. Per això la meva feina no és només trobar solucions, sinó transmetre tranquil·litat, explicar cada pas amb claredat i acompanyar-te durant tot el procés.",
      "Em considero resolutiu, compromès i perseverant. Quan una operació s’encalla, busco una última alternativa abans de donar-la per perduda. Moltes vegades la diferència no és que les coses siguin fàcils, sinó tenir algú a l’altra banda disposat a implicar-s’hi de debò.",
      "I, per sobre de tot, soc d’aquí. M’agrada conèixer la gent, passejar pels nostres pobles i prendre alguna cosa en una terrassa. Conèixer el territori no és només saber què es ven: és entendre com viu la gent i què fa especial cada lloc.",
      "Conroma és el projecte que he construït amb esforç, i el meu objectiu és que continuï creixent sense perdre l’essencial: la confiança, la implicació i el tracte personal. Perquè darrere de cada immoble hi ha una història, i darrere de cada operació, una persona que mereix sentir-se ben acompanyada.",
    ],
    },
    bioPending: false,
    closing: {
      es: 'Mi trabajo es el inmobiliario. Mi compromiso es que tú tomes cada decisión con tranquilidad y confianza.',
      en: 'Property is my work. My commitment is that you make every decision calmly and with confidence.',
      ca: "La meva feina és l’immobiliari. El meu compromís és que prenguis cada decisió amb tranquil·litat i confiança.",
    },
    facts: {
      es: [
        { label: 'Cargo', value: 'CEO y fundador' },
        { label: 'En el sector', value: 'Desde los 18 años' },
        { label: 'Sede', value: 'Malgrat de Mar, Barcelona' },
      ],
      en: [
        { label: 'Role', value: 'CEO and founder' },
        { label: 'In the business', value: 'Since the age of 18' },
        { label: 'Based in', value: 'Malgrat de Mar, Barcelona' },
      ],
      ca: [
        { label: 'Càrrec', value: 'CEO i fundador' },
        { label: 'Al sector', value: 'Des dels 18 anys' },
        { label: 'Seu', value: 'Malgrat de Mar, Barcelona' },
      ],
    },
  },
  languages: ['Català', 'Castellano', 'English', 'Français'],
  // Aprobado por el dueño (3-nov-2026): fuera el aviso de "web en construcción".
  // Las 118 fichas con fotos salen limpias; las 8 que aún no las tienen se quedan
  // fuera de Google solas (noindex + fuera del sitemap), así que no se promete nada
  // que no esté. Volver a poner `true` solo si se vuelve a cargar cartera en bruto.
  sampleData: false,
  // Aprobado por el dueño (3-nov-2026): el catálogo se indexa. Los 8 inmuebles
  // sin fotos quedan fuera automáticamente hasta que Habitatsoft entregue el archivo.
  catalogIndexable: true,
  // Mientras la Fase 1 no esté entera, la web sigue leyendo el volcado.
  // Ver ../conroma-crm-ui/docs/PLAN-FASES.md
  inventarioDesde: 'json',
  instagram: [
    { handle: '@conromaasesores', url: 'https://www.instagram.com/conromaasesores/', about: { es: 'Pisos, consejos y datos curiosos del sector.', en: 'Homes, tips and the odd curious fact about the property world.', ca: 'Pisos, consells i curiositats del sector.' } },
    { handle: '@conromaenobras', url: 'https://www.instagram.com/conromaenobras/', about: { es: 'El antes y el después de nuestras reformas.', en: 'The before and after of our renovations.', ca: "L’abans i el després de les nostres reformes." } },
  ],
  tiktok: 'https://www.tiktok.com/@conromaasesores',
  instagramVideos: [
    { url: 'https://www.instagram.com/p/DebtL2ftE-X/', label: videoLabel, video: '/video/historia-1.mp4' },
    { url: 'https://www.instagram.com/p/Dd4U1odxhkG/', label: videoLabel, video: '/video/historia-2.mp4' },
    { url: 'https://www.instagram.com/p/DZKf2T2oVqB/', label: videoLabel, video: '/video/historia-3.mp4' },
    { url: 'https://www.instagram.com/p/DbA7dBGq00W/', label: videoLabel, video: '/video/historia-4.mp4' },
    { url: 'https://www.instagram.com/p/DcRVa2dR1vG/', label: videoLabel, video: '/video/historia-5.mp4' },
  ],
  about: {
    es: [
      'Somos una pequeña familia encargada de encontrarle sentido a la vivienda que siempre has deseado.',
      'Te acompañamos en todo el proceso y seguimos ahí después: antes, durante y después de la venta.',
      'Detrás de cada piso hay una familia que empieza algo nuevo. Nos implicamos para que ese sitio acabe siendo su hogar.',
    ],
    en: [
      "We’re a small family whose job is to help you find a home that truly makes sense for you.",
      "We’re with you through the whole process and we’re still there afterwards: before, during and after the sale.",
      'Behind every home there’s a family starting something new. We get involved so that place ends up being their home.',
    ],
    ca: [
      "Som una petita família que s’encarrega de trobar-li el sentit a l’habitatge que sempre has volgut.",
      "T’acompanyem durant tot el procés i hi continuem sent després: abans, durant i després de la venda.",
      'Darrere de cada pis hi ha una família que comença una cosa nova. Ens hi impliquem perquè aquell lloc acabi sent la seva llar.',
    ],
  },
};
