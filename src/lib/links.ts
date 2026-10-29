import { site } from '../data/site';

export type ContactReason = 'visita' | 'llamada' | 'fotos' | 'bajada' | 'general' | 'valoracion' | 'alquiler';

export interface ContactContext {
  reason?: ContactReason;
  propertyRef?: string;
  propertyTitle?: string;
}

const reasonText: Record<ContactReason, string> = {
  visita: '¿Lo puedo ver?',
  llamada: '¿Me podéis llamar?',
  fotos: '¿Me pasáis más fotos?',
  bajada: 'Avisadme si baja de precio.',
  general: 'Tengo una consulta.',
  valoracion: 'Quiero saber cuánto vale mi piso.',
  alquiler: 'Tengo un piso y quiero alquilarlo.',
};

export function whatsappMessage(context: ContactContext = {}): string {
  const reason = reasonText[context.reason ?? (context.propertyRef ? 'visita' : 'general')];
  if (context.propertyRef && context.propertyTitle) {
    const title = context.propertyTitle.charAt(0).toLowerCase() + context.propertyTitle.slice(1);
    return `Hola, me interesa el ${title} (ref. ${context.propertyRef}). ${reason}`;
  }
  return `Hola. ${reason}`;
}

export function whatsappUrl(context: ContactContext = {}): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(whatsappMessage(context))}`;
}

export function phoneUrl(): string {
  return `tel:${site.phone}`;
}
