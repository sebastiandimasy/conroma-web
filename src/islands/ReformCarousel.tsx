import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow, Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import '../styles/reform-carousel.css';
import { strings, type Lang } from '../i18n';
import { REVEAL } from '../lib/motion/kinds';

/* Carrusel coverflow de obras (estilo Skiper UI · Carousel_003, adaptado a Conroma con Swiper).
   Con reduced-motion, sin giro 3D: pasa como un carrusel plano. Las fotos van en el HTML. */
interface Props {
  photos: { src: string; alt: string }[];
  lang: Lang;
}

const text = strings({
  es: { prev: 'Foto anterior', next: 'Foto siguiente', bullet: 'Ir a la foto {{index}}', slide: 'Foto {{index}} de {{slidesLength}}' },
  en: { prev: 'Previous photo', next: 'Next photo', bullet: 'Go to photo {{index}}', slide: 'Photo {{index}} of {{slidesLength}}' },
  ca: { prev: 'Foto anterior', next: 'Foto següent', bullet: 'Ves a la foto {{index}}', slide: 'Foto {{index}} de {{slidesLength}}' },
});

export default function ReformCarousel({ photos, lang }: Props) {
  const t = text[lang];
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <Swiper
      className="reform-carousel"
      modules={[EffectCoverflow, Pagination, A11y, Keyboard]}
      effect="coverflow"
      grabCursor
      centeredSlides
      loop
      slidesPerView="auto"
      keyboard={{ enabled: true }}
      coverflowEffect={{ rotate: still ? 0 : 40, stretch: 0, depth: still ? 0 : 100, modifier: 1, slideShadows: !still }}
      speed={still ? 0 : 300}
      pagination={{ clickable: true }}
      onSlideChange={(swiper) => {
        if (still) return;
        // La foto que llega al centro sube un poco (spec §5.4). Sin fundido: las vecinas ya se ven.
        const photo = swiper.slides[swiper.activeIndex]?.querySelector('img');
        if (!photo) return;
        // Sin la transición CSS del hover mientras GSAP la mueve; al acabar vuelve la de la hoja de estilos.
        photo.style.transition = 'none';
        gsap.from(photo, { y: REVEAL.subir.from.y, duration: 0.3, ease: REVEAL.subir.enter.ease, clearProps: 'transform,transition' });
      }}
      a11y={{
        prevSlideMessage: t.prev,
        nextSlideMessage: t.next,
        paginationBulletMessage: t.bullet,
        slideLabelMessage: t.slide,
      }}
    >
      {photos.map((photo, index) => (
        <SwiperSlide key={photo.src} className="reform-carousel__slide">
          <img
            className="reform-carousel__photo"
            src={photo.src}
            alt={photo.alt}
            width={600}
            height={800}
            loading={index < 3 ? 'eager' : 'lazy'}
            decoding="async"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
