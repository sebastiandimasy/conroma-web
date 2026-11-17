import * as React from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { Testimonial } from '../data/testimonials';
import '../styles/testimonial-carousel.css';

interface Props {
  testimonials: Testimonial[];
  /** Milisegundos entre avances automáticos. */
  intervalMs?: number;
}

function initialOf(name: string) {
  return (name.trim()[0] ?? '?').toUpperCase();
}

// Reseñas apiladas en la misma celda: todas van en el HTML (Google y las IA las leen)
// y solo se ve la activa. Rota sola mientras está en pantalla, sin hover ni foco dentro;
// en cuanto el visitante elige una, deja de rotar.
export default function TestimonialCarousel({ testimonials, intervalMs = 6000 }: Props) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const count = testimonials.length;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [chosen, setChosen] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion || paused || chosen || !inView || count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(id);
  }, [index, paused, chosen, inView, reduceMotion, count, intervalMs]);

  if (count === 0) return null;
  const shift = reduceMotion ? 0 : 48;

  return (
    <div
      ref={ref}
      className="tcar"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Reseñas de clientes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="tcar__stage" aria-live={chosen ? 'polite' : 'off'}>
        {testimonials.map((item, i) => {
          const active = i === index;
          return (
            <motion.figure
              key={item.author}
              className="tcar__card"
              aria-hidden={!active}
              inert={!active}
              initial={false}
              animate={{ opacity: active ? 1 : 0, x: active ? 0 : shift, scale: active || reduceMotion ? 1 : 0.94 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{ zIndex: active ? 1 : 0 }}
            >
              <span className="tcar__mark" aria-hidden="true">«</span>
              <blockquote className="tcar__quote">{item.text}</blockquote>
              <figcaption className="tcar__by">
                <span className="tcar__avatar" aria-hidden="true">{initialOf(item.author)}</span>
                <span className="tcar__by-text">
                  <strong>{item.author}</strong>
                  <span>{item.context}</span>
                </span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {count > 1 && (
        <div className="tcar__dots" role="group" aria-label="Elegir reseña">
          {testimonials.map((item, i) => (
            <button
              key={item.author}
              type="button"
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Reseña ${i + 1} de ${count}: ${item.author}`}
              className={`tcar__dot${i === index ? ' is-active' : ''}`}
              onClick={() => {
                setChosen(true);
                setIndex(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
