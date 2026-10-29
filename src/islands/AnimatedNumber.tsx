import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
}

const formatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: 'always' });

export function AnimatedNumber({ value, suffix = ' €' }: AnimatedNumberProps) {
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
      {`${formatter.format(Math.round(shown))}${suffix}`}
    </data>
  );
}
