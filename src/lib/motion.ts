import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

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

function initSplitTitles(): void {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((title) => {
    SplitText.create(title, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.08 }),
    });
  });
}

function initReveals(): void {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!items.length) return;
  gsap.set(items, { autoAlpha: 0, y: 28 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });
}

export function initMotion(): void {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  initHeader();
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    initActionBar();
    initReveals();
    document.fonts.ready.then(initSplitTitles);
  });
}
