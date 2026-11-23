import type { Lang } from '../i18n';

export interface Testimonial {
  /** Cita literal de la reseña: NO se traduce. */
  text: string;
  /** Idioma original de la cita, para su atributo lang cuando la página va en otro idioma. */
  lang: Lang;
  author: string;
  /** Texto de alrededor (servicio, fuente y fecha): este sí va en los tres idiomas. */
  context: Record<Lang, string>;
}

// Las cuatro primeras son las reseñas más recientes de la ficha de Google (consultada el 2026-11-18,
// todas de 5 estrellas). Se recortan con […] cuando son largas; no se cambia el sentido.
export const testimonials: Testimonial[] = [
  {
    text: 'Quiero compartir la reforma que realicé en los lavabos de mi casa y agradecer a Conroma su gran ayuda y guía para lograr todo como lo tenía en mente. […] Resaltar el profesionalismo y la creatividad de todo su equipo.',
    author: 'Oscar Vargas',
    lang: 'es',
    context: { es: 'Reforma de baños · Google, noviembre de 2026', en: 'Bathroom renovation · Google, November 2026', ca: 'Reforma de banys · Google, novembre de 2026' },
  },
  {
    text: 'Desde el primer momento me sentí muy bien atendida y acompañada. Me orientaron, me explicaron todo con claridad y estuvieron pendientes de mí durante todo el proceso.',
    author: 'Angie Vargas',
    lang: 'es',
    context: { es: 'Google, noviembre de 2026', en: 'Google, November 2026', ca: 'Google, novembre de 2026' },
  },
  {
    text: 'Excelente experiencia con Boris y todo su equipo. Todos fueron muy atentos, profesionales y, sobre todo, muy conocedores. […] ¡Los recomiendo muchísimo!',
    author: 'Nathalie Murillo',
    lang: 'es',
    context: { es: 'Google, octubre de 2026', en: 'Google, October 2026', ca: 'Google, octubre de 2026' },
  },
  {
    text: 'Quiero destacar la excelente atención de Boris, quien siempre está dispuesto a resolver todas mis dudas, se mantiene pendiente de cada trámite y me acompaña durante todo el proceso.',
    author: 'Majo Henao',
    lang: 'es',
    context: { es: 'Google, octubre de 2026', en: 'Google, October 2026', ca: 'Google, octubre de 2026' },
  },
  {
    text: 'Recomiendo esta inmobiliaria 100 por 100, nos ha vendido el piso en menos de una semana.',
    author: 'Cristina Monge',
    lang: 'es',
    context: { es: 'Venta de piso en Malgrat de Mar', en: 'Apartment sale in Malgrat de Mar', ca: 'Venda de pis a Malgrat de Mar' },
  },
  {
    text: 'Muy buenos profesionales y atentos. Nos ayudaron a encontrar inquilino para nuestro piso. Se han ganado de lleno nuestra confianza.',
    author: 'Joan Garcia',
    lang: 'es',
    context: { es: 'Gestión de patrimonio', en: 'Property portfolio management', ca: 'Gestió de patrimoni' },
  },
];
