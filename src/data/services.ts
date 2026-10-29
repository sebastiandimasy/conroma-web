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
    summary: 'Te enseñamos lo que hay, con el precio a la vista, y te acompañamos hasta las llaves.',
    href: '/es/comprar/',
    icon: 'key',
  },
  {
    slug: 'vender',
    name: 'Vender',
    question: '¿Cómo vendo?',
    summary: 'Empezamos por decirte cuánto vale tu piso. Gratis y sin compromiso.',
    href: '/es/vender/',
    icon: 'eye',
  },
  {
    slug: 'alquilar',
    name: 'Alquilar',
    question: '¿Cómo alquilo?',
    summary: '¿Buscas piso de alquiler? ¿Tienes uno y quieres un buen inquilino? Te ayudamos en los dos casos.',
    href: '/es/alquilar/',
    icon: 'pin',
  },
  {
    slug: 'gestion-de-patrimonio',
    name: 'Gestión de patrimonio',
    question: '¿Y si tengo varios inmuebles?',
    summary: 'Si tienes uno o varios pisos, te buscamos inquilino y vemos contigo qué hacer con cada uno.',
    href: '/es/gestion-de-patrimonio/',
    icon: 'shield',
  },
  {
    slug: 'reformas',
    name: 'Reformas',
    question: '¿Y si hay que reformarlo?',
    summary: 'Conroma en Obras: le damos una segunda vida al piso antes de venderlo o de entrar a vivir.',
    href: '/es/reformas/',
    icon: 'camera',
  },
];
