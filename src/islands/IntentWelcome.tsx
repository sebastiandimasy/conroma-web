import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { hydrateStore, intent, setIntent } from '../lib/store';
import { Icon } from './Icon';

const options = [
  { id: 'vender', label: 'Quiero vender', hint: 'Te decimos cuánto vale y el plan', href: '/es/vender/' },
  { id: 'comprar', label: 'Quiero comprar', hint: 'Mira lo que tenemos, con el precio a la vista', href: '/es/comprar/' },
] as const;

export default function IntentWelcome() {
  const current = useStore(intent);
  const [ready, setReady] = useState(false);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);

  const visible = ready && current === 'pendiente';

  useEffect(() => {
    if (!visible) return;
    firstRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setIntent('mirando');
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intent-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIntent('mirando')}
        >
          <motion.div
            className="intent-modal glass glass--thick"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intent-title"
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
                  ref={index === 0 ? firstRef : undefined}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
