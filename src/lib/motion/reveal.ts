import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { defaultLang, isLang } from '../../i18n';
import { formatFigure, parseFigure, type Figure } from './figures';
import { REVEAL, TRIGGER, placement, revealKind, staggerEach, type RevealKind } from './kinds';

/** Un elemento con `data-reveal`: qué se mueve de él y, si es cifra, cómo se cuenta. */
interface Item {
  el: HTMLElement;
  kind: RevealKind;
  targets: () => gsap.TweenTarget;
  figure?: Figure;
  original?: string;
  tween?: gsap.core.Tween;
}

const lang = () => {
  const value = document.documentElement.lang;
  return isLang(value) ? value : defaultLang;
};

/** Tipos que su antepasado ya mueve: si están dentro de otro `data-reveal`, no se animan dos veces. */
const nestable: RevealKind[] = ['titulo', 'cifra'];

function toItem(el: HTMLElement): Item | null {
  const kind = revealKind(el.dataset.reveal);
  if (!nestable.includes(kind) && el.parentElement?.closest('[data-reveal]')) return null;
  if (kind === 'cifra') {
    const original = el.textContent ?? '';
    const figure = parseFigure(original.trim(), lang());
    // Sin número que contar, se comporta como «subir».
    if (!figure) return { el, kind: 'subir', targets: () => el };
    return { el, kind, targets: () => el, figure, original };
  }
  if (kind === 'escalonado') return { el, kind, targets: () => Array.from(el.children) };
  if (kind === 'foto') return { el, kind, targets: () => el.querySelector('img') ?? el };
  if (kind === 'titulo') {
    let lines: Element[] = [el];
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (split) => {
        lines = split.lines;
      },
    });
    return { el, kind, targets: () => lines };
  }
  if (kind === 'desenfoque') {
    let words: Element[] = [el];
    SplitText.create(el, {
      type: 'words',
      wordsClass: 'split-word',
      autoSplit: true,
      onSplit: (split) => {
        words = split.words;
      },
    });
    return { el, kind, targets: () => words };
  }
  return { el, kind, targets: () => el };
}

function count(item: Item, to: number): void {
  const { el, figure, original } = item;
  if (!figure) return;
  item.tween?.kill();
  if (to === 0) {
    el.textContent = formatFigure(figure, 0, lang());
    return;
  }
  const state = { n: 0 };
  item.tween = gsap.to(state, {
    n: figure.value,
    duration: 1.2,
    ease: 'power3.out',
    onUpdate: () => {
      el.textContent = formatFigure(figure, state.n, lang());
    },
    // Termina con el texto exacto del HTML.
    onComplete: () => {
      el.textContent = original ?? el.textContent;
    },
  });
}

function enter(item: Item, delay: number): void {
  if (item.kind === 'cifra') return count(item, item.figure?.value ?? 0);
  const targets = item.targets();
  const n = Array.isArray(targets) ? targets.length : 1;
  const stagger = item.kind === 'escalonado' ? staggerEach(n) : REVEAL[item.kind].enter.stagger;
  gsap.to(targets, { ...REVEAL[item.kind].enter, stagger, delay, overwrite: 'auto' });
}

function exit(item: Item): void {
  if (item.kind === 'cifra') return count(item, 0);
  gsap.to(item.targets(), { ...REVEAL[item.kind].exit, overwrite: 'auto' });
}

function reset(item: Item): void {
  if (item.kind === 'cifra') return count(item, 0);
  gsap.set(item.targets(), { ...REVEAL[item.kind].from, overwrite: 'auto' });
}

/** Estado al arrancar: lo de abajo se prepara para entrar; lo que ya se ve, sin pasar por opacidad 0. */
function prepare(item: Item): void {
  const rect = item.el.getBoundingClientRect();
  const where = placement(rect.top, rect.bottom, innerHeight);
  if (where === 'abajo') return reset(item);
  if (where === 'visible' && item.kind !== 'cifra') {
    const { opacity: _opacity, ...transformOnly } = REVEAL[item.kind].from;
    gsap.set(item.targets(), transformOnly);
  }
}

/** Entradas y salidas de todos los `[data-reveal]` con un solo `ScrollTrigger.batch` (spec §5.2). */
export function initReveals(): () => void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    .map(toItem)
    .filter((item): item is Item => item !== null);
  if (!items.length) return () => {};
  const byEl = new Map(items.map((item) => [item.el, item]));
  items.forEach(prepare);

  const each = (fn: (item: Item, i: number) => void) => (els: Element[]) =>
    els.forEach((el, i) => {
      const item = byEl.get(el as HTMLElement);
      if (item) fn(item, i);
    });

  ScrollTrigger.batch(
    items.map((item) => item.el),
    {
      start: TRIGGER.start,
      end: TRIGGER.end,
      interval: TRIGGER.interval,
      onEnter: each((item, i) => enter(item, Math.min(i * 0.06, 0.3))),
      onEnterBack: each((item) => enter(item, 0)),
      onLeave: each(exit),
      onLeaveBack: each(reset),
    },
  );

  // Abrir un desplegable o cargar una foto cambia la altura de la página: sin recalcular, los
  // disparadores se quedan en la posición vieja y un bloque podría fundirse mientras se lee.
  let pending: number | undefined;
  const observer = new ResizeObserver(() => {
    window.clearTimeout(pending);
    pending = window.setTimeout(() => ScrollTrigger.refresh(), 150);
  });
  observer.observe(document.body);

  // Al volver a «reducir movimiento», las cifras recuperan su texto real.
  return () => {
    observer.disconnect();
    window.clearTimeout(pending);
    for (const item of items) if (item.original !== undefined) item.el.textContent = item.original;
  };
}
