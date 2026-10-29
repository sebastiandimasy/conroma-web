import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface StoryVideo {
  url: string;
  label: string;
  video: string;
}

// Posición de cada carta en el abanico: más centrada, más recta y más grande.
function slotConfig(total: number, slot: number) {
  const center = total >> 1;
  const d = total > 1 ? (slot - center) / center : 0;
  const a = Math.abs(d);
  return { rot: d * 21, scale: 1 - 0.2244 * a * a, x: d * 30, y: a * a * 7.3, z: 10 - Math.abs(slot - center) };
}

const multiplier = (width: number) => (width < 480 ? 0.2 : width < 640 ? 0.38 : width < 768 ? 0.5 : width < 1024 ? 0.75 : 1);

export default function StoryVideos({ items }: { items: StoryVideo[] }) {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;
    const cards = Array.from(layout.querySelectorAll<HTMLElement>('.story-fan__card'));
    const videos = Array.from(layout.querySelectorAll<HTMLVideoElement>('video'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // La altura del abanico es la de su carta más baja, así el hueco a los botones es el mismo en cualquier ancho.
    const fit = () => {
      const top = layout.getBoundingClientRect().top;
      layout.style.height = `${Math.max(...cards.map((c) => c.getBoundingClientRect().bottom)) - top}px`;
    };
    const fitCall = gsap.delayedCall(1.9, fit);

    // Destino de cada carta; si una carta está en hover, sus vecinas se apartan.
    const target = (i: number, hover: number | null) => {
      const m = multiplier(window.innerWidth);
      const c = slotConfig(cards.length, i);
      let x = c.x * m;
      let y = c.y * m;
      let rotation = c.rot;
      let scale = c.scale;
      // Hover suave: solo la carta activa da un pequeño salto, sin mover a las vecinas.
      if (hover !== null && i === hover) {
        y -= 0.6 * m;
        scale *= 1.03;
      }
      return { x: `${x}rem`, y: `${y}rem`, rotation, scale, zIndex: c.z };
    };

    const place = (duration: number, hover: number | null) => {
      cards.forEach((el, i) => gsap.to(el, { ...target(i, hover), duration, ease: 'elastic.out(1,.75)', overwrite: 'auto' }));
    };

    if (reduceMotion) {
      cards.forEach((el, i) => gsap.set(el, target(i, null)));
    } else {
      cards.forEach((el, i) =>
        gsap.fromTo(
          el,
          { x: 0, y: '12rem', rotation: 0, scale: 0.5, opacity: 0 },
          { ...target(i, null), opacity: 1, duration: 1.2, ease: 'elastic.out(1.05,.78)', delay: 0.2 + i * 0.06 },
        ),
      );
    }

    // Solo reproduce los vídeos que se ven.
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target: video, isIntersecting }) => {
          const v = video as HTMLVideoElement;
          if (isIntersecting && !reduceMotion) void v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: 0.4 },
    );
    videos.forEach((v) => observer.observe(v));

    const hoverHandlers = cards.map((el, i) => {
      const onEnter = () => !reduceMotion && place(0.5, i);
      el.addEventListener('mouseenter', onEnter);
      return { el, onEnter };
    });
    const onLeave = () => !reduceMotion && place(0.5, null);
    layout.addEventListener('mouseleave', onLeave);

    const onResize = () => {
      place(0, null);
      gsap.delayedCall(0.05, fit);
    };
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      hoverHandlers.forEach(({ el, onEnter }) => el.removeEventListener('mouseenter', onEnter));
      layout.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      gsap.killTweensOf(cards);
      fitCall.kill();
    };
  }, [items]);

  return (
    <div ref={layoutRef} className="story-fan">
      {items.map((item) => (
        <a
          key={item.video}
          className="story-fan__card"
          href={item.url}
          target="_blank"
          rel="noopener"
          aria-label={`${item.label}, abrir en Instagram`}
        >
          <video src={item.video} muted loop playsInline preload="metadata" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
