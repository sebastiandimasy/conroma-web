import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cookieConsent, hydrateStore, setConsent } from '../lib/store';

export default function CookieNotice() {
  const consent = useStore(cookieConsent);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);

  const visible = ready && consent === 'pendiente';

  useEffect(() => {
    document.documentElement.classList.toggle('has-cookie-notice', visible);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="cookie-notice"
          role="dialog"
          aria-label="Aviso de cookies"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
        >
          <div className="cookie-notice__body">
            <p className="cookie-notice__title">Usamos cookies</p>
            <p className="cookie-notice__text">
              Usamos cookies propias y de terceros para medir las visitas con Google Analytics y
              mejorar la web. Las de medición solo se activan si las aceptas. Puedes aceptarlas todas
              o rechazar las no esenciales. Más información en nuestra{' '}
              <a href="/es/cookies/">política de cookies</a>.
            </p>
          </div>
          <div className="cookie-notice__actions">
            <button type="button" className="button button--ghost" onClick={() => setConsent('rechazado')}>
              Rechazar
            </button>
            <button type="button" className="button button--primary" onClick={() => setConsent('aceptado')}>
              Aceptar
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
