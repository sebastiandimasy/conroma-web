import * as React from 'react';
import '../styles/reel-testimonials.css';

export interface ReelTestimonial {
  quote: string;
  author: string;
  context?: string;
}

interface Props {
  testimonials: ReelTestimonial[];
  ratingUrl?: string;
  charStaggerMs?: number;
}

/* Geometría del carrete: paso entre centros de retrato = 3 * (celda + gap) */
const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240;
const SLIDE_MS = 800;
const EASE_INOUT = 'cubic-bezier(0.65,0,0.35,1)';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function initialOf(name: string) {
  return (name.trim()[0] ?? '?').toUpperCase();
}

function Cell() {
  return <div className="reel__cell" aria-hidden="true" style={{ width: CELL, height: CELL }} />;
}

/* Tile destacado: avatar con degradado amarillo + inicial (no hay foto de Google). */
function Featured({ initial }: { initial: string }) {
  return (
    <div className="reel__featured" style={{ width: CELL, height: CELL }}>
      <div className="reel__avatar" style={{ fontSize: Math.round(CELL * 0.42) }}>
        {initial}
      </div>
    </div>
  );
}

/* División por carácter: cada letra sube con un animation-delay escalonado. */
function Chars({ text, startIndex, staggerMs }: { text: string; startIndex: number; staggerMs: number }) {
  let idx = startIndex;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span className="reel__word" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span key={ci} className="scroll-reel-char" style={{ animationDelay: `${delay}ms` }}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default function ReelTestimonials({ testimonials, ratingUrl, charStaggerMs = 7 }: Props) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = testimonials.length;

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    const pending = timeouts.current;
    return () => {
      cancelAnimationFrame(raf);
      pending.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir: 1 | -1) => {
      if (animating.current) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating.current = true;
      setIndex(next);
      setExiting(true);
      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS),
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS),
      );
    },
    [index, count],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      paginate(-1);
    }
  };

  const middleItems = React.useMemo(() => {
    const items: Array<{ type: 'cell' } | { type: 'featured'; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    testimonials.forEach((_, i) => {
      items.push({ type: 'featured', i });
      if (i < count - 1) items.push({ type: 'cell' }, { type: 'cell' });
    });
    for (let i = 0; i < 3; i++) items.push({ type: 'cell' });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : 'none',
  });

  const current = testimonials[displayIndex];
  if (!current) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Reseñas de clientes"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="reel"
    >
      <div
        aria-hidden="true"
        className="reel__reel"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <div className="reel__cols">
          <div className="reel__col" style={colStyle(sideY)}>
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
          <div className="reel__col" style={colStyle(middleY)}>
            {middleItems.map((item, i) =>
              item.type === 'featured' ? (
                <Featured key={i} initial={initialOf(testimonials[item.i].author)} />
              ) : (
                <Cell key={i} />
              ),
            )}
          </div>
          <div className="reel__col" style={colStyle(sideY)}>
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell key={i} />
            ))}
          </div>
        </div>
      </div>

      <div className="reel__content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <svg className="reel__mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          <div className="reel__stage" aria-live="polite">
            <div className="reel__ghost" aria-hidden="true">
              <p className="reel__quote">{current.quote}</p>
              <p className="reel__author">{current.author}</p>
            </div>
            <div key={displayIndex} className={cn('reel__live', exiting && 'scroll-reel-exit')}>
              <p className="reel__quote">
                <Chars text={current.quote} startIndex={0} staggerMs={charStaggerMs} />
              </p>
              <p className="reel__author">
                <Chars
                  text={current.context ? `${current.author} · ${current.context}` : current.author}
                  startIndex={current.quote.length + 6}
                  staggerMs={charStaggerMs}
                />
              </p>
            </div>
          </div>
        </div>

        <div className="reel__controls">
          <button
            type="button"
            onClick={() => paginate(-1)}
            disabled={index === 0}
            aria-label="Reseña anterior"
            className="reel__btn"
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7.5 2.5 3.5 6l4 3.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            disabled={index === count - 1}
            aria-label="Siguiente reseña"
            className="reel__btn"
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m4.5 2.5 4 3.5-4 3.5" />
            </svg>
          </button>
          {ratingUrl && (
            <span className="reel__more">
              <a href={ratingUrl} rel="noopener" target="_blank">
                Ver reseñas en Google
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
