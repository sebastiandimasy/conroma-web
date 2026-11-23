import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { photoSources } from '../lib/photos';
import { strings, type Lang } from '../i18n';

interface PropertyGalleryProps {
  propertyRef: string;
  title: string;
  photos: number;
  tone: number;
  images?: string[];
  lang: Lang;
}

const texts = strings({
  es: {
    photosOf: (title: string) => `Fotos de ${title}`,
    allPhotosOf: (title: string) => `Todas las fotos de ${title}`,
    soon: 'Fotos próximamente',
    zoom: (n: number, total: number) => `Ampliar foto ${n} de ${total}`,
    alt: (title: string, n: number, total: number) => `${title}, foto ${n} de ${total}`,
    prev: 'Foto anterior',
    next: 'Foto siguiente',
    thumbs: 'Miniaturas',
    see: (n: number, total: number) => `Ver foto ${n} de ${total}`,
    count: (n: number, total: number) => `Foto ${n} de ${total}`,
    seeAll: 'Ver todas las fotos',
    close: 'Cerrar',
  },
  en: {
    photosOf: (title: string) => `Photos of the ${title.charAt(0).toLowerCase()}${title.slice(1)}`,
    allPhotosOf: (title: string) => `All photos of the ${title.charAt(0).toLowerCase()}${title.slice(1)}`,
    soon: 'Photos coming soon',
    zoom: (n: number, total: number) => `Enlarge photo ${n} of ${total}`,
    alt: (title: string, n: number, total: number) => `${title}, photo ${n} of ${total}`,
    prev: 'Previous photo',
    next: 'Next photo',
    thumbs: 'Thumbnails',
    see: (n: number, total: number) => `See photo ${n} of ${total}`,
    count: (n: number, total: number) => `Photo ${n} of ${total}`,
    seeAll: 'See all photos',
    close: 'Close',
  },
  ca: {
    photosOf: (title: string) => `Fotos: ${title}`,
    allPhotosOf: (title: string) => `Totes les fotos: ${title}`,
    soon: 'Aviat hi haurà fotos',
    zoom: (n: number, total: number) => `Amplia la foto ${n} de ${total}`,
    alt: (title: string, n: number, total: number) => `${title}, foto ${n} de ${total}`,
    prev: 'Foto anterior',
    next: 'Foto següent',
    thumbs: 'Miniatures',
    see: (n: number, total: number) => `Mostra la foto ${n} de ${total}`,
    count: (n: number, total: number) => `Foto ${n} de ${total}`,
    seeAll: 'Mostra totes les fotos',
    close: 'Tanca',
  },
});

/* Visor con miniaturas: foto principal 4:3 que se desliza con el dedo (scroll-snap), tira de
   miniaturas debajo y visor a pantalla completa. Las fotos vienen de Habitatsoft en varios tamaños
   (lib/photos): 800 px por defecto con srcset y miniaturas de 170 px. */
export default function PropertyGallery({ propertyRef, title, photos, tone, images, lang }: PropertyGalleryProps) {
  const t = texts[lang];
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(1);
  // Fotos reales si las hay; si no, los SVG de muestra con rotación por tono.
  const hasPhotos = (images?.length ?? 0) > 0 || photos > 0;
  const urls = hasPhotos
    ? (images ?? Array.from({ length: photos }, (_, i) => `/img/muestra-${((tone + i - 1) % 4) + 1}.svg`))
    : [];
  const sources = urls.map(photoSources);
  const count = sources.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { root: track, threshold: 0.6 },
    );
    track.querySelectorAll('[data-index]').forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  // La miniatura activa se queda a la vista sin mover la página (scrollTo de la tira, no scrollIntoView).
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[current - 1] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: motion() });
  }, [current]);

  function motion(): ScrollBehavior {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const target = (index + count) % count;
    track.scrollTo({ left: target * track.clientWidth, behavior: motion() });
  }

  function openViewer(index = current - 1) {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Las imágenes del visor son lazy: tras abrir, se centra la pulsada.
    dialog.querySelectorAll('.gallery__viewer-list img')[index]?.scrollIntoView({ block: 'start' });
  }

  // Sin fotos reales todavía: marcador sobrio, sin miniaturas ni visor.
  if (!hasPhotos) {
    return (
      <div className="gallery">
        <div className="gallery__empty" aria-label={t.photosOf(title)}>
          <Icon name="camera" />
          <span>{t.soon}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__stage">
        <div className="gallery__track" ref={trackRef} tabIndex={0} aria-label={t.photosOf(title)}>
          {sources.map((photo, index) => (
            <figure key={index} className="gallery__slide" data-index={index + 1}>
              <button type="button" className="gallery__zoom" onClick={() => openViewer(index)} aria-label={t.zoom(index + 1, count)}>
                <img
                  className="gallery__photo"
                  src={photo.src}
                  srcSet={photo.srcset}
                  sizes="(min-width: 60rem) 58vw, 100vw"
                  alt={t.alt(title, index + 1, count)}
                  width="1280"
                  height="960"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  style={index === 0 ? { viewTransitionName: `foto-${propertyRef.toLowerCase()}` } : undefined}
                />
              </button>
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => goTo(current - 2)} aria-label={t.prev}>
              <Icon name="arrow" />
            </button>
            <button type="button" className="gallery__nav gallery__nav--next" onClick={() => goTo(current)} aria-label={t.next}>
              <Icon name="arrow" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="gallery__thumbs" ref={thumbsRef} role="group" aria-label={t.thumbs}>
          {sources.map((photo, index) => (
            <button
              key={index}
              type="button"
              className="gallery__thumb"
              onClick={() => goTo(index)}
              aria-label={t.see(index + 1, count)}
              aria-current={current === index + 1 ? 'true' : undefined}
            >
              <img src={photo.thumb} alt="" width="170" height="128" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}

      <div className="gallery__meta">
        <span className="gallery__count" aria-live="polite">{t.count(current, count)}</span>
        <button type="button" className="link-cta" onClick={() => openViewer()}>
          {t.seeAll}
        </button>
      </div>

      <dialog ref={dialogRef} className="gallery__viewer" aria-label={t.allPhotosOf(title)}>
        <form method="dialog" className="gallery__viewer-bar">
          <button type="submit" className="chip chip--on-photo">
            <Icon name="close" className="save-button__icon" />
            {t.close}
          </button>
        </form>
        <div className="gallery__viewer-list">
          {sources.map((photo, index) => (
            <img
              key={index}
              src={photo.src}
              srcSet={photo.srcset}
              sizes="(min-width: 1100px) 1100px, 100vw"
              alt={t.alt(title, index + 1, count)}
              width="1280"
              height="960"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </dialog>
    </div>
  );
}
