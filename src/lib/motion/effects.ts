import gsap from 'gsap';
import { REVEAL } from './kinds';

/** Héroe de las páginas interiores: al salir, la foto baja (parallax) y el texto sube y se funde.
    La foto nunca cambia de opacidad: es el LCP. */
function heroStory(): void {
  const hero = document.querySelector<HTMLElement>('.hero-story');
  if (!hero) return;
  const scrollTrigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  // immediateRender: false — si no, GSAP lee a medias el zoom CSS de entrada (hero-settle) y lo deja fijo.
  gsap.to(hero.querySelector('.hero-story__photo'), { y: '10%', ease: 'none', immediateRender: false, scrollTrigger });
  gsap.to(hero.querySelector('.hero-story__content'), { y: -48, opacity: 0, ease: 'none', scrollTrigger });
}

/** Héroe de Inicio: entrada escalonada del texto al cargar y salida con el scroll. La foto no se toca. */
function heroCenter(): void {
  const hero = document.querySelector<HTMLElement>('.hero-center');
  if (!hero) return;
  const parts = hero.querySelectorAll('.hero-center__title, .hero-center__lead, .hero-center__actions');
  gsap.from(parts, { y: 16, opacity: 0, duration: 0.6, ease: REVEAL.subir.enter.ease, stagger: 0.08 });
  gsap.to(hero.querySelector('.hero-center__content'), {
    y: -48,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

/** Statement: las palabras (ya partidas en el HTML) pasan de 0,18 a 1 al cruzar la pantalla. */
function statement(): void {
  document.querySelectorAll<HTMLElement>('.statement__text').forEach((text) => {
    gsap.fromTo(
      text.querySelectorAll('.statement__word'),
      { opacity: 0.18 },
      { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: text, start: 'top 80%', end: 'bottom 40%', scrub: true } },
    );
  });
}

/** StoryScroll en escritorio: el paso que cruza el centro se marca y su foto aparece en el stage fijo. */
function storyScroll(): void {
  document.querySelectorAll<HTMLElement>('.story-scroll').forEach((section) => {
    const steps = section.querySelectorAll<HTMLElement>('.story-scroll__step');
    const photos = Array.from(section.querySelectorAll<HTMLElement>('.story-scroll__stage-photo'));
    if (!photos.length) return;
    section.classList.add('is-enhanced');
    steps.forEach((step, i) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: step,
          start: 'top center',
          end: 'bottom center',
          toggleClass: 'is-active',
          onToggle: (self) => {
            if (!self.isActive) return;
            photos.forEach((photo, p) => gsap.to(photo, { opacity: p === i ? 1 : 0, duration: 0.4, overwrite: 'auto' }));
          },
        },
      });
    });
  });
}

/** Efectos singulares (spec §5.3). Se registran dentro del matchMedia de motion.ts. */
export function initEffects(): () => void {
  heroStory();
  heroCenter();
  statement();
  const desktop = gsap.matchMedia();
  desktop.add('(min-width: 60rem)', () => {
    storyScroll();
    return () => document.querySelectorAll('.story-scroll').forEach((s) => s.classList.remove('is-enhanced'));
  });
  return () => desktop.revert();
}
