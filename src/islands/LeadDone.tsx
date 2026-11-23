import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { site } from '../data/site';
import { strings, type Lang } from '../i18n';
import { Icon } from './Icon';

const text = strings({
  es: { close: 'Cerrar' },
  en: { close: 'Close' },
  ca: { close: 'Tanca' },
});

interface LeadDoneProps {
  lang: Lang;
  ok: boolean; // false = no llegó por ninguna vía: el texto manda a WhatsApp
  title: string;
  text: string;
  phoneLead: string; // frase que va justo antes del teléfono («¿Te corre prisa? Llámanos al»)
  origin: string; // data-origin del enlace tel: (medición por Click URL)
  onClose: () => void;
  children: ReactNode; // botones
}

/** Confirmación de un formulario a pantalla completa. <dialog> nativo: foco atrapado, Esc cierra
 * y el resto de la página queda inerte sin código extra. */
export function LeadDone({ lang, ok, title, text: body, phoneLead, origin, onClose, children }: LeadDoneProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      className={`lead-done${ok ? '' : ' lead-done--fail'}`}
      aria-labelledby="lead-done-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button type="button" className="lead-done__close" aria-label={text[lang].close} onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="lead-done__body">
        {ok && (
          <span className="lead-done__mark">
            <Icon name="check" />
          </span>
        )}
        <h2 className="lead-done__title" id="lead-done-title">
          {title}
        </h2>
        <p className="lead-done__text">{body}</p>
        <p className="lead-done__phone">
          {phoneLead}{' '}
          <a href={`tel:${site.phone}`} data-contact="llamada" data-origin={origin}>
            {site.phoneDisplay}
          </a>
        </p>
        <div className="lead-done__actions">{children}</div>
      </div>
    </dialog>
  );
}
