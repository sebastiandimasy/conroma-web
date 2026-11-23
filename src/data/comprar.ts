import { strings } from '../i18n';
import type { FaqItem } from './faq';
import type { StoryStep } from './vender';
import deskPhoto from '../assets/equipo/conroma-91.jpg';
import teamPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import reformPhoto from '../assets/reformas/reforma-17.jpg';

/* Textos de /es/comprar/. Salen de la página anterior y de los pasos de compra (steps.ts):
   no se añaden promesas nuevas. */

/** Respuesta directa a «¿cómo compro con Conroma?» (la leen Google y las IA). */
export const buyAnswer = strings({
  es:
    'Para comprar con Conroma, nos dices la zona, el presupuesto y lo que no puede faltar, y con eso filtramos por ti. ' +
    'Te enseñamos lo que hay de verdad, con el precio a la vista, y te decimos lo bueno y lo malo de cada piso antes de que firmes. ' +
    'Te orientamos con la hipoteca y vamos contigo hasta la notaría.',
  en:
    "To buy with Conroma, tell us the area, your budget and what you can't do without, and we do the filtering for you. " +
    "We show you what's really out there, with the price up front, and tell you the good and the bad of each home before you sign. " +
    'We point you in the right direction on the mortgage and come with you all the way to the notary.',
  ca:
    'Per comprar amb Conroma, ens dius la zona, el pressupost i allò que no pot faltar, i amb això filtrem per tu. ' +
    "T'ensenyem el que hi ha de debò, amb el preu a la vista, i et diem el que té de bo i de dolent cada pis abans que signis. " +
    "T'orientem amb la hipoteca i venim amb tu fins a la notaria.",
});

export const buySteps = strings<StoryStep[]>({
  es: [
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
  ],
  en: [
    {
      title: "Tell us what you're after",
      text: "Area, budget and your must-haves. We filter for you and let you know about homes that aren't on the property portals yet.",
      image: deskPhoto,
      alt: 'A member of the Conroma team working at the computer',
    },
    {
      title: 'You view it with us',
      text: "We show you round and tell you what we don't like about it, too. We speak Catalan, Spanish, English and French.",
      image: reformPhoto,
      alt: 'Open-plan living room and kitchen in an apartment renovated by Conroma',
    },
    {
      title: "We're with you when you sign",
      text: 'The deposit contract (arras), a mortgage if you need one, and the notary. We handle the paperwork with you.',
      image: teamPortrait,
      alt: 'Three members of the Conroma team going over a sale at the office',
    },
  ],
  ca: [
    {
      title: 'Ens dius què busques',
      text: "Zona, pressupost i allò que no pot faltar. Amb això filtrem per tu i t'avisem del que encara no és als portals.",
      image: deskPhoto,
      alt: "Una persona de l'equip de Conroma treballant a l'ordinador",
    },
    {
      title: 'El visites amb nosaltres',
      text: "T'ensenyem el pis i també et diem el que no ens agrada. T'atenem en català, castellà, anglès i francès.",
      image: reformPhoto,
      alt: "Sala d'estar i cuina obertes d'un pis reformat per Conroma",
    },
    {
      title: "T'acompanyem a signar",
      text: 'Arres, hipoteca si la necessites i notaria. Els papers els portem amb tu.',
      image: teamPortrait,
      alt: "Tres persones de l'equip de Conroma revisant una operació a l'oficina",
    },
  ],
});

export const buyFaq = strings<FaqItem[]>({
  es: [
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
  ],
  en: [
    {
      question: 'Do you charge anything to show me homes?',
      answer: "No. Viewing homes with us costs you nothing and doesn't tie you to anything.",
    },
    {
      question: 'Can you help me with the mortgage?',
      answer: "We tell you what to ask for and who to ask, and help you with the paperwork the bank wants.",
    },
    {
      question: 'I live abroad. Can I still buy?',
      answer: "Yes. We speak Catalan, Spanish, English and French, and we'll explain what you need to buy from another country.",
    },
  ],
  ca: [
    {
      question: 'Cobreu alguna cosa per ensenyar-me pisos?',
      answer: 'No. Veure pisos amb nosaltres no et costa res ni et compromet a res.',
    },
    {
      question: "M'ajudeu amb la hipoteca?",
      answer: "T'orientem sobre què demanar i a qui, i t'acompanyem amb els papers que et demani el banc.",
    },
    {
      question: 'Visc fora, puc comprar igualment?',
      answer: "Sí. T'atenem en català, castellà, anglès i francès, i t'expliquem què necessites per comprar des d'un altre país.",
    },
  ],
});
