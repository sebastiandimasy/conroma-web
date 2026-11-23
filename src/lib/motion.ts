import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { initReveals } from './motion/reveal';

/** Interruptor de emergencia (spec §5.8): en false, la web queda visible y quieta. */
export const MOTION_ON = true;

function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  ScrollTrigger.create({
    start: 24,
    onUpdate: (self) => header.classList.toggle('is-compact', self.scroll() > 24),
  });
}

function initActionBar(): void {
  const bar = document.querySelector<HTMLElement>('[data-action-bar]');
  if (!bar) return;
  let settle: number | undefined;
  ScrollTrigger.create({
    start: 400,
    onUpdate: (self) => {
      bar.classList.toggle('is-hidden', self.direction === 1 && self.getVelocity() > 600);
      window.clearTimeout(settle);
      settle = window.setTimeout(() => bar.classList.remove('is-hidden'), 300);
    },
  });
}

/** Resuelve cuando se va el esqueleto de carga (`html.is-loading`, BaseLayout). Sin temporizador propio. */
export function waitForSkeleton(): Promise<void> {
  const root = document.documentElement;
  if (!root.classList.contains('is-loading')) return Promise.resolve();
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (root.classList.contains('is-loading')) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  });
}

export function initMotion(): void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  initHeader();
  if (!MOTION_ON) return;
  Promise.all([waitForSkeleton(), document.fonts.ready]).then(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      initActionBar();
      return initReveals();
    });
    if (document.readyState !== 'complete') addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
}
