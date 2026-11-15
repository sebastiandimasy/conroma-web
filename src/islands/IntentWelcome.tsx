import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cookieConsent, hydrateStore, intent, setIntent } from '../lib/store';
import { Icon } from './Icon';

const options = [
  { id: 'vender', label: 'Quiero vender', hint: 'Te decimos cuánto vale y el plan', href: '/es/vender/' },
  { id: 'comprar', label: 'Quiero comprar', hint: 'Mira lo que tenemos, con el precio a la vista', href: '/es/comprar/' },
] as const;

export default function IntentWelcome() {
  const current = useStore(intent);
  const consent = useStore(cookieConsent);
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);

  // Una interrupción cada vez: el aviso de cookies es la puerta legal y va primero.
  // Hasta que no hay decisión, su overlay dejaría el banner visible pero sin poder pulsarlo.
  const visible = ready && current === 'pendiente' && consent !== 'pendiente';

  // <dialog> nativo con showModal(): atrapa el foco, Esc lo cierra (evento cancel) y devuelve el foco.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (visible && dialog && !dialog.open) dialog.showModal();
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.dialog
          ref={dialogRef}
          className="intent-modal__overlay"
          aria-labelledby="intent-title"
          style={{ width: '100%', height: '100%', maxWidth: 'none', maxHeight: 'none', margin: 0, border: 0, color: 'inherit' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onCancel={(event) => {
            event.preventDefault();
            setIntent('mirando');
          }}
          onClick={() => setIntent('mirando')}
        >
          <motion.div
            className="intent-modal glass glass--thick"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="intent-modal__close" aria-label="Cerrar" onClick={() => setIntent('mirando')}>
              <Icon name="close" />
            </button>
            <p className="eyebrow">¡Hola!</p>
            <h2 className="intent-modal__title" id="intent-title">
              ¿En qué te ayudamos?
            </h2>
            <div className="intent-modal__options">
              {options.map((option, index) => (
                <a
                  key={option.id}
                  autoFocus={index === 0}
                  className="option"
                  href={option.href}
                  onClick={() => setIntent(option.id)}
                >
                  <span className="option__text">
                    <span className="option__label">{option.label}</span>
                    <span className="option__hint">{option.hint}</span>
                  </span>
                  <Icon name="arrow" className="option__icon" />
                </a>
              ))}
            </div>
            <button type="button" className="intent-modal__skip text-link" onClick={() => setIntent('mirando')}>
              Solo estoy mirando
            </button>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
