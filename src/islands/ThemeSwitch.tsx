import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Icon } from './Icon';

// Interruptor claro/oscuro (componente Switch del dueño, con los tokens de la casa).
// Antes de hidratar, la bola se coloca por CSS según :root[data-theme] (sin salto al cargar);
// después manda el estado de React, que es lo que permite animar con `layout`.
export default function ThemeSwitch({ label }: { label: string }) {
  const [dark, setDark] = useState<boolean | null>(null);
  const [animate, setAnimate] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.dataset.theme === 'dark');
    sync();
    // Hay dos interruptores (cabecera en escritorio, pie en móvil): si uno cambia el tema,
    // el otro se entera por el atributo.
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    // La primera sincronización no se anima: solo los cambios del visitante.
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  function toggle() {
    const next = !(dark ?? document.documentElement.dataset.theme === 'dark');
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('conroma:tema', next ? 'dark' : 'light');
    } catch {
      // Sin almacenamiento el tema dura lo que la visita.
    }
  }

  const state = dark === null ? '' : dark ? ' is-on' : ' is-off';
  const spin = reduceMotion ? 0 : 60;

  return (
    <button
      type="button"
      className={`theme-switch${state}`}
      role="switch"
      aria-checked={dark ?? undefined}
      aria-label={label}
      onClick={toggle}
    >
      <span className="theme-switch__track">
        <motion.span
          className="theme-switch__knob"
          layout={animate && !reduceMotion}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
        >
          <motion.span
            key={dark === null ? 'ssr' : dark ? 'on' : 'off'}
            className="theme-switch__icon"
            initial={animate ? { opacity: 0, rotate: dark ? -spin : spin } : false}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="moon" className="theme-switch__moon" />
            <Icon name="sun" className="theme-switch__sun" />
          </motion.span>
        </motion.span>
      </span>
    </button>
  );
}
