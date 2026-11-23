import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import type { Lang } from '../i18n';
import { formatPrice } from '../lib/format';

interface AnimatedNumberProps {
  value: number;
  lang: Lang;
}

/** Importe en euros que cuenta hasta su valor (formato del idioma: «60.000 €», «€60,000»). */
export function AnimatedNumber({ value, lang }: AnimatedNumberProps) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      current.current = value;
      setShown(value);
      return;
    }
    const state = { value: current.current };
    const tween = gsap.to(state, {
      value,
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => {
        current.current = state.value;
        setShown(state.value);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, reduceMotion]);

  return (
    <data value={Math.round(value)}>
      {formatPrice(Math.round(shown), lang)}
    </data>
  );
}
