import { site } from '../data/site';
import { strings, type Lang } from '../i18n';

export type ContactReason = 'visita' | 'llamada' | 'fotos' | 'bajada' | 'general' | 'valoracion' | 'alquiler';

export interface ContactContext {
  reason?: ContactReason;
  propertyRef?: string;
  /** Título ya en el idioma de la página (propertyTitle(property, lang)). */
  propertyTitle?: string;
}

const reasonText = strings<Record<ContactReason, string>>({
  es: {
    visita: '¿Lo puedo ver?',
    llamada: '¿Me podéis llamar?',
    fotos: '¿Me pasáis más fotos?',
    bajada: 'Avisadme si baja de precio.',
    general: 'Tengo una consulta.',
    valoracion: 'Quiero saber cuánto vale mi piso.',
    alquiler: 'Tengo un piso y quiero alquilarlo.',
  },
  en: {
    visita: 'Could I come and see it?',
    llamada: 'Could you give me a call?',
    fotos: 'Could you send me more photos?',
    bajada: 'Let me know if the price drops.',
    general: 'I have a question.',
    valoracion: "I'd like to know what my home is worth.",
    alquiler: "I have a flat and I'd like to rent it out.",
  },
  ca: {
    visita: 'El puc venir a veure?',
    llamada: 'Em podeu trucar?',
    fotos: 'Em passeu més fotos?',
    bajada: 'Aviseu-me si baixa de preu.',
    general: 'Tinc una consulta.',
    valoracion: 'Vull saber quant val el meu pis.',
    alquiler: 'Tinc un pis i el vull llogar.',
  },
});

/** Mensaje de WhatsApp en el idioma de la página. */
export function whatsappMessage(lang: Lang, context: ContactContext = {}): string {
  const reason = reasonText[lang][context.reason ?? (context.propertyRef ? 'visita' : 'general')];
  if (context.propertyRef && context.propertyTitle) {
    const title = context.propertyTitle.charAt(0).toLowerCase() + context.propertyTitle.slice(1);
    if (lang === 'en') return `Hi, I'm interested in the ${title} (ref. ${context.propertyRef}). ${reason}`;
    // En catalán, «l'immoble» evita acertar el género de cada tipo («el pis», «la casa»).
    if (lang === 'ca') return `Hola, m'interessa l'immoble amb referència ${context.propertyRef} (${title}). ${reason}`;
    return `Hola, me interesa el ${title} (ref. ${context.propertyRef}). ${reason}`;
  }
  return `${lang === 'en' ? 'Hi' : 'Hola'}. ${reason}`;
}

export function whatsappUrl(lang: Lang, context: ContactContext = {}): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(whatsappMessage(lang, context))}`;
}

export function phoneUrl(): string {
  return `tel:${site.phone}`;
}
