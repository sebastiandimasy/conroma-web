import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

interface PropertyGalleryProps {
  propertyRef: string;
  title: string;
  photos: number;
  tone: number;
  images?: string[];
}

export default function PropertyGallery({ propertyRef, title, photos, tone, images }: PropertyGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(1);
  // Fotos reales si las hay; si no, los SVG de muestra con rotación por tono.
  const hasPhotos = (images?.length ?? 0) > 0 || photos > 0;
  const srcs = hasPhotos
    ? (images ?? Array.from({ length: photos }, (_, i) => `/img/muestra-${((tone + i - 1) % 4) + 1}.svg`))
    : [];
  const count = srcs.length;

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

  function step(delta: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: delta * track.clientWidth, behavior: 'smooth' });
  }

  function openViewer() {
    dialogRef.current?.showModal();
  }

  // Sin fotos reales todavía: marcador elegante, sin SVG de muestra ni lightbox/contador.
  if (!hasPhotos) {
    return (
      <div className="gallery">
        <div className="gallery__empty" aria-label={`Fotos de ${title}`}>
          <Icon name="camera" />
          <span>Fotos próximamente</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div className="gallery__track" ref={trackRef} tabIndex={0} aria-label={`Fotos de ${title}`}>
        {srcs.map((src, index) => (
          <figure key={index} className="gallery__slide" data-index={index + 1}>
            <button type="button" className="gallery__zoom" onClick={openViewer} aria-label={`Ampliar foto ${index + 1} de ${count}`}>
              <img
                className="gallery__photo"
                src={src}
                alt={`${title}, foto ${index + 1} de ${count}`}
                width="1200"
                height="900"
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
          <button type="button" className="gallery__nav gallery__nav--prev" onClick={() => step(-1)} aria-label="Foto anterior">
            <Icon name="arrow" />
          </button>
          <button type="button" className="gallery__nav gallery__nav--next" onClick={() => step(1)} aria-label="Foto siguiente">
            <Icon name="arrow" />
          </button>
        </>
      )}

      <button type="button" className="chip chip--on-photo gallery__counter" onClick={openViewer}>
        {`${current} / ${count} · Ver todas`}
      </button>

      <dialog ref={dialogRef} className="gallery__viewer" aria-label={`Todas las fotos de ${title}`}>
        <form method="dialog" className="gallery__viewer-bar">
          <button type="submit" className="chip chip--on-photo">
            <Icon name="close" className="save-button__icon" />
            Cerrar
          </button>
        </form>
        <div className="gallery__viewer-list">
          {srcs.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${title}, foto ${index + 1} de ${count}`}
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </dialog>
    </div>
  );
}
