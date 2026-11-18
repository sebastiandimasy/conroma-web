import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, EffectCoverflow, Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import '../styles/reform-carousel.css';

/* Carrusel coverflow de obras (estilo Skiper UI · Carousel_003, adaptado a Conroma con Swiper).
   Con reduced-motion, sin giro 3D: pasa como un carrusel plano. Las fotos van en el HTML. */
interface Props {
  photos: { src: string; alt: string }[];
}

export default function ReformCarousel({ photos }: Props) {
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
      a11y={{
        prevSlideMessage: 'Foto anterior',
        nextSlideMessage: 'Foto siguiente',
        paginationBulletMessage: 'Ir a la foto {{index}}',
        slideLabelMessage: 'Foto {{index}} de {{slidesLength}}',
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
