import type { IconName } from '../lib/icons';

export interface ServiceSummary {
  slug: string;
  name: string;
  question: string;
  summary: string;
  href: string;
  icon: IconName;
}

export const services: ServiceSummary[] = [
  {
    slug: 'comprar',
    name: 'Comprar',
    question: '¿Cómo compro?',
    summary: 'Te enseñamos la oferta actual del mercado y te acompañamos en la búsqueda, la recomendación y la compra del inmueble, hasta que te entregan las llaves.',
    href: '/es/comprar/',
    icon: 'key',
  },
  {
    slug: 'vender',
    name: 'Vender',
    question: '¿Cómo vendo?',
    summary: 'Empezamos con la tasación de tu inmueble y después nos encargamos de todo el proceso de venta.',
    href: '/es/vender/',
    icon: 'eye',
  },
  {
    slug: 'alquilar',
    name: 'Alquilar',
    question: '¿Cómo alquilo?',
    summary: '¿Buscas piso de alquiler? ¿Tienes un inmueble y quieres alquilarlo con seguridad? Te ayudamos en cualquier caso.',
    href: '/es/alquilar/',
    icon: 'pin',
  },
  {
    slug: 'gestion-de-patrimonio',
    name: 'Gestión de patrimonio',
    question: '¿Y si tengo varios inmuebles?',
    summary: 'Si tienes uno o varios inmuebles, nos encargamos de su gestión y administración para que tú ganes libertad y tranquilidad.',
    href: '/es/gestion-de-patrimonio/',
    icon: 'shield',
  },
  {
    slug: 'reformas',
    name: 'Reformas',
    question: '¿Y si hay que reformarlo?',
    summary: 'Conroma crea sueños y también reforma. Le damos una segunda vida a tu inmueble: si quieres darle una nueva cara a tu hogar, este es tu sitio.',
    href: '/es/reformas/',
    icon: 'camera',
  },
];
