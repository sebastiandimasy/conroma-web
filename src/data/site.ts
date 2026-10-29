import type { ImageMetadata } from 'astro';
import borisPhoto from '../assets/equipo/boris-conde-jr.jpg';
import boardPhoto from '../assets/equipo/conroma-74.jpg';
import heroPhoto from '../assets/equipo/conroma-82.jpg';
import heroPhotoPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import officePhoto from '../assets/equipo/conroma-102.jpg';
import deskPhoto from '../assets/equipo/conroma-91.jpg';

export interface SiteData {
  name: string;
  legalName: string;
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
  heroImage: { src: ImageMetadata; portrait: ImageMetadata; alt: string } | null;
  teamPhotos: { src: ImageMetadata; alt: string }[];
  ceo: {
    name: string;
    role: string;
    photo: { src: ImageMetadata; alt: string } | null;
    bio: string[];
    bioPending: boolean;
    // Frase de cierre destacada bajo la bio. null la oculta.
    closing: string | null;
    facts: { label: string; value: string }[];
  } | null;
  languages: string[];
  sampleData: boolean;
  instagram: { handle: string; url: string; about: string }[];
  // Publicaciones (reels o posts) a embeber. Lista vacía = la sección no se muestra.
  instagramVideos: { url: string; label: string; video?: string }[];
  // Perfil de TikTok. null oculta el botón.
  tiktok: string | null;
  about: string[];
}

export const site: SiteData = {
  name: 'Conroma',
  legalName: 'Conroma Asesores Inmobiliarios',
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
    count: 107,
    checkedOn: '2026-10-12',
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
    alt: 'Tres personas del equipo de Conroma revisando una operación en la oficina',
  },
  teamPhotos: [
    { src: deskPhoto, alt: 'Una persona del equipo de Conroma trabajando en el ordenador' },
    { src: officePhoto, alt: 'Dos personas del equipo de Conroma en la oficina' },
    { src: boardPhoto, alt: 'Una persona del equipo de Conroma explicando una operación en la pizarra' },
  ],
  ceo: {
    name: 'Boris Conde Jr.',
    role: 'CEO y fundador de Conroma Asesores Inmobiliarios',
    photo: { src: borisPhoto, alt: 'Boris Conde Jr., CEO y fundador de Conroma Asesores' },
    bio: [
      'Mi historia en el sector inmobiliario empezó a los 18 años, cuando entré en la inmobiliaria de mi padre. Lo que era una oportunidad para conocer el negocio desde dentro acabó siendo mi profesión, mi proyecto personal y una de mis grandes pasiones.',
      'Tres años después decidí emprender mi propio camino y crear una agencia con una visión más moderna y tecnológica del sector. Los comienzos no fueron fáciles, pero la constancia y la confianza de nuestros clientes nos han permitido construir una empresa sólida, con una cartera que nos confía algo tan importante como su patrimonio, sus inversiones y sus proyectos de vida.',
      'En estos siete años he conocido el mercado desde muchas perspectivas: la intermediación en compraventas, la inversión, el flipping, la compra para alquiler y la reforma de inmuebles. Eso me ha enseñado que una propiedad no es solo un inmueble: es una oportunidad, una inversión y, muchas veces, el esfuerzo de toda una vida.',
      'Mi forma de trabajar combina la seriedad y la organización con un trato cercano y directo. Para mí estas operaciones son el día a día; para muchos clientes, decisiones que toman una o dos veces en la vida. Por eso mi trabajo no es solo encontrar soluciones, sino transmitir tranquilidad, explicar cada paso con claridad y acompañarte durante todo el proceso.',
      'Me considero resolutivo, comprometido y perseverante. Cuando una operación se atasca, busco una última alternativa antes de darla por perdida. Muchas veces la diferencia no está en que las cosas sean fáciles, sino en tener a alguien al otro lado dispuesto a implicarse de verdad.',
      'Y, por encima de todo, soy de aquí. Me gusta conocer a la gente, pasear por nuestros pueblos y tomar algo en una terraza. Conocer el territorio no es solo saber qué se vende: es entender cómo vive la gente y qué hace especial a cada lugar.',
      'Conroma es el proyecto que he construido con esfuerzo, y mi objetivo es que siga creciendo sin perder lo esencial: la confianza, la implicación y el trato personal. Porque detrás de cada inmueble hay una historia, y detrás de cada operación, una persona que merece sentirse bien acompañada.',
    ],
    bioPending: false,
    closing: 'Mi trabajo es el inmobiliario. Mi compromiso es que tú tomes cada decisión con tranquilidad y confianza.',
    facts: [
      { label: 'Cargo', value: 'CEO y fundador' },
      { label: 'En el sector', value: 'Desde los 18 años' },
      { label: 'Sede', value: 'Malgrat de Mar, Barcelona' },
    ],
  },
  languages: ['Català', 'Castellano', 'English', 'Français'],
  sampleData: true,
  instagram: [
    { handle: '@conromaasesores', url: 'https://www.instagram.com/conromaasesores/', about: 'Pisos, consejos y datos curiosos del sector.' },
    { handle: '@conromaenobras', url: 'https://www.instagram.com/conromaenobras/', about: 'El antes y el después de nuestras reformas.' },
  ],
  tiktok: 'https://www.tiktok.com/@conromaasesores',
  instagramVideos: [
    { url: 'https://www.instagram.com/p/DebtL2ftE-X/', label: 'Ver vídeo en Instagram', video: '/video/historia-1.mp4' },
    { url: 'https://www.instagram.com/p/Dd4U1odxhkG/', label: 'Ver vídeo en Instagram', video: '/video/historia-2.mp4' },
    { url: 'https://www.instagram.com/p/DZKf2T2oVqB/', label: 'Ver vídeo en Instagram', video: '/video/historia-3.mp4' },
    { url: 'https://www.instagram.com/p/DbA7dBGq00W/', label: 'Ver vídeo en Instagram', video: '/video/historia-4.mp4' },
    { url: 'https://www.instagram.com/p/DcRVa2dR1vG/', label: 'Ver vídeo en Instagram', video: '/video/historia-5.mp4' },
  ],
  about: [
    'Somos una pequeña familia encargada de encontrarle sentido a la vivienda que siempre has deseado.',
    'Te acompañamos en todo el proceso y seguimos ahí después: antes, durante y después de la venta.',
    'Tenemos agentes de calle, gente que conoce el sector y, sobre todo, el pueblo.',
  ],
};
