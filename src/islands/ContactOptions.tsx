import { useState } from 'react';
import { phoneUrl, whatsappMessage, whatsappUrl, type ContactReason } from '../lib/links';
import { Icon } from './Icon';

interface ContactOptionsProps {
  propertyRef: string;
  propertyTitle: string;
}

const reasons: { id: ContactReason; label: string }[] = [
  { id: 'visita', label: 'Quiero verlo' },
  { id: 'llamada', label: 'Que me llaméis' },
  { id: 'fotos', label: 'Más fotos' },
  { id: 'bajada', label: 'Avisadme si baja' },
];

export default function ContactOptions({ propertyRef, propertyTitle }: ContactOptionsProps) {
  const [reason, setReason] = useState<ContactReason>('visita');
  const context = { reason, propertyRef, propertyTitle };

  return (
    <div className="contact-options">
      <div className="chip-row" role="group" aria-label="Qué necesitas">
        {reasons.map((item) => (
          <button
            key={item.id}
            type="button"
            className="chip"
            aria-pressed={reason === item.id}
            onClick={() => setReason(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="contact-options__preview-label">Al darle a WhatsApp se abre con este mensaje escrito:</p>
      <p className="contact-options__message" aria-live="polite">
        {whatsappMessage(context)}
      </p>
      <p className="contact-options__hint">Contestamos nosotros, desde la oficina de Malgrat.</p>
      <div className="contact-options__actions">
        <a
          className="button button--ink button--block"
          href={whatsappUrl(context)}
          data-contact="whatsapp"
          data-origin="ficha-contacto"
          data-ref={propertyRef}
          data-reason={reason}
        >
          <Icon name="whatsapp" className="button__icon" />
          Enviar por WhatsApp
        </a>
        <a
          className="button button--ghost button--block"
          href={phoneUrl()}
          data-contact="llamada"
          data-origin="ficha-contacto"
          data-ref={propertyRef}
          data-reason={reason}
        >
          <Icon name="phone" className="button__icon" />
          Llamar
        </a>
      </div>
      <p className="field__hint">El mensaje ya va escrito. Lo puedes cambiar antes de enviarlo.</p>
    </div>
  );
}
