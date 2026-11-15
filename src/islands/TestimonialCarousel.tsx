import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Testimonial } from '../data/testimonials';
import '../styles/testimonial-carousel.css';

interface Props {
  testimonials: Testimonial[];
  ratingUrl?: string;
  /** Milisegundos entre avances automáticos. */
  intervalMs?: number;
}

const AUTOPLAY_MS = 5000;

function initialOf(name: string) {
  return (name.trim()[0] ?? '?').toUpperCase();
}

export default function TestimonialCarousel({ testimonials, ratingUrl, intervalMs = AUTOPLAY_MS }: Props) {
  const reduceMotion = useReducedMotion();
  const count = testimonials.length;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false); // pausa temporal (hover/foco)
  const [stopped, setStopped] = React.useState(false); // pausa elegida con el botón
  const [interacted, setInteracted] = React.useState(false); // aria-live solo tras interactuar

  // Auto-play: avanza solo salvo pausa o reduced-motion.
  React.useEffect(() => {
    if (reduceMotion || paused || stopped || count < 2) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => clearTimeout(id);
  }, [index, paused, stopped, reduceMotion, count, intervalMs]);

  const current = testimonials[index];
  if (!current) return null;

  const dur = reduceMotion ? 0 : 0.2;
  const offset = reduceMotion ? 0 : 12;

  return (
    <div
      className="tcar"
      role="group"
      aria-roledescription="carousel"
      aria-label="Reseñas de clientes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="tcar__stage" aria-live={interacted || stopped || reduceMotion ? 'polite' : 'off'}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={index}
            className="tcar__slide"
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -offset }}
            transition={{ duration: dur, ease: 'easeOut' }}
          >
            <span className="tcar__stars" aria-label="5 de 5 estrellas">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.3l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94z" />
                </svg>
              ))}
            </span>
            <blockquote className="tcar__quote">{current.text}</blockquote>
            <figcaption className="tcar__by">
              <span className="tcar__avatar" aria-hidden="true">{initialOf(current.author)}</span>
              <span className="tcar__by-text">
                <strong>{current.author}</strong>
                <span>{current.context}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="tcar__dots" role="group" aria-label="Elegir reseña">
          {!reduceMotion && (
            <button
              type="button"
              aria-pressed={stopped}
              aria-label={stopped ? 'Reanudar el cambio automático de reseñas' : 'Pausar el cambio automático de reseñas'}
              style={{ minHeight: 44, minWidth: 44, padding: '0 8px', font: 'inherit', fontSize: '0.875rem', background: 'none', border: 0, color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setStopped((v) => !v)}
            >
              {stopped ? 'Reanudar' : 'Pausar'}
            </button>
          )}
          {testimonials.map((t, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Reseña ${i + 1} de ${count}: ${t.author}`}
              className={`tcar__dot${i === index ? ' is-active' : ''}`}
              onClick={() => {
                setInteracted(true);
                setIndex(i);
              }}
            />
          ))}
        </div>
      )}

      {ratingUrl && (
        <p className="tcar__more">
          <a href={ratingUrl} rel="noopener" target="_blank">
            Ver reseñas en Google
          </a>
        </p>
      )}
    </div>
  );
}
