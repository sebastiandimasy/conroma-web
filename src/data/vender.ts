import type { ImageMetadata } from 'astro';
import type { FaqItem } from './faq';
import borisPhoto from '../assets/equipo/boris-conde-jr.jpg';
import deskPhoto from '../assets/equipo/conroma-91.jpg';
import officePhoto from '../assets/equipo/conroma-102.jpg';
import teamPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import reformPhoto from '../assets/reformas/reforma-17.jpg';

export interface StoryStep {
  title: string;
  text: string;
  image: ImageMetadata;
  alt: string;
}

/** Una opción de venta y a quién le encaja, por temas. Las dos son válidas: no se compara
    «bien contra mal», se ayuda a elegir. */
export interface CompareOption {
  title: string;
  groups: { title: string; items: string[] }[];
}

/* Textos de /es/vender/. Solo datos que ya están en el repo (faq.ts, blog.ts, site.ts):
   ni plazos de venta, ni porcentajes, ni pisos vendidos. */

/** Respuesta corta arriba de la página: la que pueden citar Google y las IA. */
export const venderAnswer =
  'Para vender tu piso con Conroma, primero pasamos a verlo y te decimos cuánto vale, gratis y sin compromiso. Si el precio te encaja, nos encargamos de las fotos, los portales, las visitas y los papeles. La misma persona te acompaña hasta la firma en notaría.';

export const venderSteps: StoryStep[] = [
  {
    title: 'Vemos tu piso',
    text: 'Pasamos a verlo y te decimos un precio realista. Es gratis y no te obliga a vender con nosotros.',
    image: borisPhoto,
    alt: 'Boris Conde Jr., fundador de Conroma Asesores',
  },
  {
    title: 'Lo dejamos a punto',
    text: 'Hacemos fotos y vídeo del piso. Si un arreglo pequeño ayudaría a venderlo, te lo decimos, y si quieres lo hacemos nosotros.',
    image: reformPhoto,
    alt: 'Salón y cocina abiertos de un piso reformado por Conroma',
  },
  {
    title: 'Lo enseñamos',
    text: 'Lo publicamos en los portales y en nuestras redes, @conromaasesores en Instagram y TikTok.',
    image: deskPhoto,
    alt: 'Una persona del equipo de Conroma trabajando en el ordenador',
  },
  {
    title: 'Hacemos las visitas',
    text: 'Enseñamos el piso a gente que de verdad puede comprarlo. Atendemos en catalán, castellano, inglés y francés.',
    image: officePhoto,
    alt: 'Dos personas del equipo de Conroma en la oficina',
  },
  {
    title: 'Arras y notaría',
    text: 'Negociamos el precio, preparamos las arras y vamos contigo a notaría. Y seguimos ahí después de la firma.',
    image: teamPortrait,
    alt: 'Tres personas del equipo de Conroma revisando una operación en la oficina',
  },
];

export const venderCompare: [CompareOption, CompareOption] = [
  {
    // Cada punto sale de lo ya publicado en esta página (pasos y respuesta), nada nuevo.
    title: 'Lo que tienes con Conroma',
    groups: [
      {
        title: 'Tiempo',
        items: [
          'Las llamadas y las visitas pasan por nosotros.',
          'Atendemos en catalán, castellano, inglés y francés.',
        ],
      },
      {
        title: 'Papeles',
        items: ['Te decimos qué hace falta y lo preparamos contigo.', 'Preparamos las arras por ti.'],
      },
      {
        title: 'Precio',
        items: ['Valoración en persona, gratis y sin compromiso.', 'Sales con un precio realista desde el primer día.'],
      },
      {
        title: 'Seguridad',
        items: [
          'Enseñamos el piso a gente que de verdad puede comprarlo.',
          'Vamos contigo a notaría y seguimos ahí después de la firma.',
        ],
      },
      {
        title: 'Difusión',
        items: ['Fotos y vídeo de tu piso.', 'Lo publicamos en los portales y en @conromaasesores (Instagram y TikTok).'],
      },
    ],
  },
  {
    title: 'Venderlo por tu cuenta te encaja si…',
    groups: [
      { title: 'Tiempo', items: ['Tienes tiempo para atender llamadas y enseñar el piso.'] },
      { title: 'Papeles', items: ['Ya tienes la cédula, el certificado energético y la nota simple.'] },
      { title: 'Precio', items: ['Conoces bien los precios de tu zona.'] },
      { title: 'Seguridad', items: ['Te manejas bien con las visitas y con el contrato de arras.'] },
    ],
  },
];

export const venderFaq: FaqItem[] = [
  {
    question: '¿Cuánto cobráis de honorarios?',
    answer:
      'Un porcentaje sobre el precio de venta que pactamos contigo antes de empezar, sin letra pequeña. Dentro van las fotos, la publicación, las visitas, la negociación y el acompañamiento hasta notaría. La valoración es gratis.',
  },
  {
    question: '¿Cuánto se tarda en vender un piso?',
    answer:
      'Depende sobre todo del precio y de la zona. Un piso que sale a un precio realista se mueve antes que uno que sale caro, por eso empezamos por la valoración. Te decimos qué esperar cuando lo hayamos visto.',
  },
  {
    question: '¿Tengo que firmar en exclusiva?',
    answer:
      'Te lo explicamos en la valoración, con las condiciones por escrito, antes de que firmes nada. Si algo no te encaja, nos lo dices.',
  },
  {
    question: '¿Necesito la cédula y el certificado energético?',
    answer:
      'Sí. El certificado de eficiencia energética hace falta ya para anunciar el piso, y la cédula de habitabilidad tiene que estar en vigor para venderlo. Si te falta alguno, te decimos cómo pedirlo.',
  },
  {
    question: '¿Valorar mi piso me compromete a algo?',
    answer: 'No. La valoración es gratis y no te obliga a vender con nosotros.',
  },
  {
    question: 'Es un piso heredado, ¿qué hago?',
    answer:
      'Antes de venderlo hay que aceptar la herencia ante notario y poner el piso a nombre de los herederos. Si estás en ese punto, lo vemos contigo con calma.',
  },
];
