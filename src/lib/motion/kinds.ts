import type { gsap } from 'gsap';

/** Tipos de entrada que se marcan con `data-reveal="…"` (spec §5.2). */
export type RevealKind = 'subir' | 'escalonado' | 'foto' | 'titulo' | 'cifra' | 'desenfoque';

const kinds: readonly RevealKind[] = ['subir', 'escalonado', 'foto', 'titulo', 'cifra', 'desenfoque'];

/** Vacío, `"true"` o desconocido → `subir`, el tipo por defecto. */
export function revealKind(attr: string | null | undefined): RevealKind {
  return kinds.includes(attr as RevealKind) ? (attr as RevealKind) : 'subir';
}

type Motion = { from: gsap.TweenVars; enter: gsap.TweenVars; exit: gsap.TweenVars };

const enterEase = 'power3.out';
const exitEase = 'power2.in';
const subir: Motion = {
  from: { y: 32, opacity: 0 },
  enter: { y: 0, opacity: 1, duration: 0.6, ease: enterEase },
  exit: { y: -16, opacity: 0, duration: 0.35, ease: exitEase },
};

/** Valores de la tabla §5.2 del spec. `titulo` y `escalonado` se aplican a líneas o hijos. */
export const REVEAL: Record<RevealKind, Motion> = {
  subir,
  escalonado: { ...subir, exit: { ...subir.exit, duration: 0.3 } },
  foto: {
    from: { scale: 1.12, opacity: 0 },
    enter: { scale: 1, opacity: 1, duration: 0.8, ease: enterEase },
    exit: { scale: 1.04, opacity: 0, duration: 0.35, ease: exitEase },
  },
  titulo: {
    from: { yPercent: 110 },
    enter: { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power4.out', stagger: 0.08 },
    exit: { yPercent: -60, opacity: 0, duration: 0.3, ease: exitEase },
  },
  cifra: subir,
  // Frases de cierre: palabra a palabra, de borrosa a nítida (patrón «Text Blur In» de 21st.dev).
  desenfoque: {
    from: { opacity: 0, filter: 'blur(10px)', y: 8 },
    enter: { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.06 },
    exit: { opacity: 0, filter: 'blur(8px)', duration: 0.35, ease: exitEase },
  },
};

export const TRIGGER = { start: 'top 88%', end: 'bottom 12%', interval: 0.1 } as const;
export const STAGGER = { each: 0.06, max: 0.4 } as const;

/** Retraso entre hijos: 0,06 s, sin pasar de 0,4 s en total. */
export function staggerEach(count: number): number {
  return Math.min(STAGGER.each, STAGGER.max / Math.max(count, 1));
}

/** Dónde está un elemento al arrancar respecto a la pantalla (mismo umbral que `TRIGGER.start`). */
export function placement(top: number, bottom: number, viewport: number): 'arriba' | 'visible' | 'abajo' {
  if (top >= viewport * 0.88) return 'abajo';
  if (bottom <= 0) return 'arriba';
  return 'visible';
}
