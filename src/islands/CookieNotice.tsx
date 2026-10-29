import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from '@heroui/react';
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
          className="cookie-notice glass glass--thick"
          aria-label="Aviso de cookies"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
        >
          <p className="cookie-notice__text">
            <a href="/es/privacidad/">Cookies</a>: tú decides.
          </p>
          <div className="cookie-notice__actions">
            <Button variant="ghost" className="button--small" onPress={() => setConsent('rechazado')}>
              Rechazar
            </Button>
            <Button variant="ghost" className="button--small" onPress={() => setConsent('aceptado')}>
              Aceptar
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
