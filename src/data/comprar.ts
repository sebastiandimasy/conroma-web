import type { FaqItem } from './faq';
import type { StoryStep } from './vender';
import deskPhoto from '../assets/equipo/conroma-91.jpg';
import teamPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import reformPhoto from '../assets/reformas/reforma-17.jpg';

/* Textos de /es/comprar/. Salen de la página anterior y de los pasos de compra (steps.ts):
   no se añaden promesas nuevas. */

/** Respuesta directa a «¿cómo compro con Conroma?» (la leen Google y las IA). */
export const buyAnswer =
  'Para comprar con Conroma, nos dices la zona, el presupuesto y lo que no puede faltar, y con eso filtramos por ti. ' +
  'Te enseñamos lo que hay de verdad, con el precio a la vista, y te decimos lo bueno y lo malo de cada piso antes de que firmes. ' +
  'Te orientamos con la hipoteca y vamos contigo hasta la notaría.';

export const buySteps: StoryStep[] = [
  {
    title: 'Nos dices qué buscas',
    text: 'Zona, presupuesto y lo que no puede faltar. Con eso filtramos por ti y te avisamos de lo que aún no está en los portales.',
    image: deskPhoto,
    alt: 'Una persona del equipo de Conroma trabajando en el ordenador',
  },
  {
    title: 'Lo visitas con nosotros',
    text: 'Te enseñamos el piso y te decimos también lo que no nos gusta. Atendemos en catalán, castellano, inglés y francés.',
    image: reformPhoto,
    alt: 'Salón y cocina abiertos de un piso reformado por Conroma',
  },
  {
    title: 'Te acompañamos a firmar',
    text: 'Arras, hipoteca si la necesitas y notaría. Los papeles los llevamos contigo.',
    image: teamPortrait,
    alt: 'Tres personas del equipo de Conroma revisando una operación en la oficina',
  },
];

export const buyFaq: FaqItem[] = [
  {
    question: '¿Cobráis algo por enseñarme pisos?',
    answer: 'No. Ver pisos con nosotros no te cuesta nada ni te compromete a nada.',
  },
  {
    question: '¿Me ayudáis con la hipoteca?',
    answer: 'Te orientamos sobre qué pedir y a quién, y te acompañamos con los papeles que te pida el banco.',
  },
  {
    question: 'Vivo fuera, ¿puedo comprar igual?',
    answer: 'Sí. Te atendemos en catalán, castellano, inglés y francés, y te explicamos qué necesitas para comprar desde otro país.',
  },
];
