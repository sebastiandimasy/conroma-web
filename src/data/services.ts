import { strings } from '../i18n';
import type { IconName } from '../lib/icons';

export interface ServiceSummary {
  slug: string;
  name: string;
  question: string;
  summary: string;
  /** Ruta en español; quien la pinta la lleva al idioma de la página con localizePath. */
  href: string;
  icon: IconName;
}

export const services = strings<ServiceSummary[]>({
  es: [
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
  ],
  // En inglés, nombres en gerundio («Buying», «Selling»): así se lee «More about buying».
  en: [
    {
      slug: 'comprar',
      name: 'Buying',
      question: 'How do I buy?',
      summary: "We show you what's on the market right now and stay with you through the search, our recommendations and the purchase, until you get the keys.",
      href: '/es/comprar/',
      icon: 'key',
    },
    {
      slug: 'vender',
      name: 'Selling',
      question: 'How do I sell?',
      summary: 'We start with a valuation of your property, then take care of the whole sale.',
      href: '/es/vender/',
      icon: 'eye',
    },
    {
      slug: 'alquilar',
      name: 'Renting',
      question: 'How do I rent?',
      summary: "Looking for a home to rent? Got a property you want to rent out safely? We can help either way.",
      href: '/es/alquilar/',
      icon: 'pin',
    },
    {
      slug: 'gestion-de-patrimonio',
      name: 'Property portfolio management',
      question: 'What if I own several properties?',
      summary: 'Whether you have one property or several, we take care of managing and running them, so you have more freedom and less to worry about.',
      href: '/es/gestion-de-patrimonio/',
      icon: 'shield',
    },
    {
      slug: 'reformas',
      name: 'Renovations',
      question: 'What if it needs renovating?',
      summary: "Conroma doesn't just sell homes, we renovate them too. We give your property a second life: if you want your home to look new again, this is the place.",
      href: '/es/reformas/',
      icon: 'camera',
    },
  ],
  ca: [
    {
      slug: 'comprar',
      name: 'Comprar',
      question: 'Com compro?',
      summary: "T'ensenyem l'oferta actual del mercat i t'acompanyem en la recerca, la recomanació i la compra de l'immoble, fins que et donen les claus.",
      href: '/es/comprar/',
      icon: 'key',
    },
    {
      slug: 'vender',
      name: 'Vendre',
      question: 'Com venc?',
      summary: 'Comencem amb la taxació del teu immoble i després ens encarreguem de tot el procés de venda.',
      href: '/es/vender/',
      icon: 'eye',
    },
    {
      slug: 'alquilar',
      name: 'Llogar',
      question: 'Com llogo?',
      summary: "Busques pis de lloguer? Tens un immoble i el vols llogar amb seguretat? T'ajudem en qualsevol cas.",
      href: '/es/alquilar/',
      icon: 'pin',
    },
    {
      slug: 'gestion-de-patrimonio',
      name: 'Gestió de patrimoni',
      question: 'I si tinc diversos immobles?',
      summary: "Si tens un o diversos immobles, ens encarreguem de la gestió i l'administració perquè tu guanyis llibertat i tranquil·litat.",
      href: '/es/gestion-de-patrimonio/',
      icon: 'shield',
    },
    {
      slug: 'reformas',
      name: 'Reformes',
      question: 'I si cal reformar-lo?',
      summary: 'Conroma crea somnis i també reforma. Donem una segona vida al teu immoble: si vols donar una cara nova a la teva llar, aquest és el teu lloc.',
      href: '/es/reformas/',
      icon: 'camera',
    },
  ],
});
