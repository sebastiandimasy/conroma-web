export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  draft: boolean;
  intro: string;
  sections: BlogSection[];
  cta: { label: string; href: string };
}

export const posts: BlogPost[] = [
  {
    slug: 'quiero-vender-mi-piso-por-donde-empiezo',
    title: 'Quiero vender mi piso: ¿por dónde empiezo?',
    description: 'Los pasos para vender un piso sin líos, en orden: saber cuánto vale, preparar los papeles, enseñarlo bien y llegar a notaría.',
    category: 'Vender',
    date: '2026-10-13',
    draft: false,
    intro: 'Vender un piso impone, sobre todo la primera vez. Te lo contamos fácil, en el orden en que pasa de verdad.',
    sections: [
      {
        heading: '1. Saber cuánto vale',
        paragraphs: [
          'Todo empieza por el precio. Si sales demasiado alto, el piso se quema en los portales. Si sales bajo, pierdes dinero.',
          'Por eso lo primero es una valoración hecha por alguien que conozca tu calle, no solo tu código postal.',
        ],
      },
      {
        heading: '2. Tener los papeles a mano',
        paragraphs: ['No hace falta tenerlo todo el primer día, pero cuanto antes lo reúnas, menos sustos al final.'],
      },
      {
        heading: '3. Enseñarlo bien',
        paragraphs: [
          'Buenas fotos, una descripción honesta y visitas con gente que de verdad puede comprar. Lo que el piso no tiene también se cuenta: ahorra visitas inútiles.',
        ],
      },
      {
        heading: '4. Negociar y firmar',
        paragraphs: [
          'Cuando llega una oferta, toca negociar, firmar las arras y preparar la notaría. Aquí es donde más se agradece tener a alguien al lado.',
        ],
      },
    ],
    cta: { label: 'Saber cuánto vale mi piso', href: '/es/valoracion/' },
  },
  {
    slug: 'papeles-para-vender-un-piso-en-cataluna',
    title: 'Papeles para vender un piso en Cataluña',
    description: 'Los papeles que te van a pedir para vender un piso en Cataluña, y qué pasa si tiene hipoteca o si viene de una herencia.',
    category: 'Vender',
    date: '2026-10-13',
    draft: false,
    intro: 'No es la parte divertida, pero es la que más retrasa una venta cuando falta algo. Esta es la lista habitual.',
    sections: [
      {
        heading: 'Lo que casi siempre hace falta',
        paragraphs: ['Cada operación tiene sus detalles, pero esto es lo que se suele pedir:'],
        list: [
          'Escritura de propiedad. Y una nota simple reciente del Registro, para ver que todo está a tu nombre y qué cargas tiene.',
          'Certificado de eficiencia energética. Hace falta ya para anunciar el piso.',
          'Cédula de habitabilidad en vigor.',
          'Último recibo del IBI.',
          'Certificado de la comunidad de propietarios de que estás al corriente de pago.',
          'DNI o NIE de todos los propietarios.',
        ],
      },
      {
        heading: 'Si el piso tiene hipoteca',
        paragraphs: [
          'Se puede vender igual. Lo normal es pagar lo que queda el mismo día de la firma, con parte del dinero de la venta. Antes, el banco te da un certificado con la cantidad pendiente.',
          'Después hay que cancelarla también en el Registro. Es un trámite aparte, con su coste.',
        ],
      },
      {
        heading: 'Si es una herencia',
        paragraphs: [
          'Antes de vender hay que tener la herencia aceptada ante notario y el piso a nombre de los herederos. Si estás en ese punto, lo vemos contigo con calma.',
        ],
      },
    ],
    cta: { label: 'Preguntarnos por tu caso', href: '/es/contacto/' },
  },
  {
    slug: 'comprar-piso-en-malgrat-de-mar-viviendo-fuera',
    title: 'Comprar piso en Malgrat de Mar viviendo fuera',
    description: 'Cómo comprar una vivienda en Malgrat de Mar si vives en otro país: qué papeles necesitas y cómo firmar sin tener que venir.',
    category: 'Comprar',
    date: '2026-10-13',
    draft: false,
    intro: 'Mucha gente que compra en la costa no vive aquí. Se puede hacer bien y sin venir diez veces.',
    sections: [
      {
        heading: 'Te atendemos en tu idioma',
        paragraphs: ['Te atendemos en catalán, castellano, inglés y francés, para que entiendas bien lo que firmas.'],
      },
      {
        heading: 'Lo que vas a necesitar',
        paragraphs: ['Si no tienes nacionalidad española, cuenta con esto:'],
        list: [
          'Un NIE (número de identidad de extranjero). Te lo piden en la notaría y para pagar los impuestos.',
          'Una cuenta bancaria en España. No es obligatoria por ley, pero facilita los pagos, los impuestos y los recibos.',
        ],
      },
      {
        heading: 'Si no puedes venir a firmar',
        paragraphs: [
          'Se puede firmar con un poder notarial a favor de una persona de confianza. Si lo haces en tu país, lo normal es que tenga que venir apostillado y traducido. Te explicamos cómo prepararlo.',
        ],
      },
    ],
    cta: { label: 'Ver pisos en venta', href: '/es/venta/malgrat-de-mar/' },
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
