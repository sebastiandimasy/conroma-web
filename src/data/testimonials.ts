export interface Testimonial {
  text: string;
  author: string;
  context: string;
}

export const testimonials: Testimonial[] = [
  {
    text: 'Muy buenos profesionales y atentos. Nos ayudaron a encontrar inquilino para nuestro piso. Se han ganado de lleno nuestra confianza.',
    author: 'Joan Garcia',
    context: 'Gestión de patrimonio',
  },
  {
    text: 'Recomiendo esta inmobiliaria 100 por 100, nos ha vendido el piso en menos de una semana.',
    author: 'Cristina Monge',
    context: 'Venta de piso en Malgrat de Mar',
  },
  {
    text: 'Al ser joven y primeriza estaba un poco perdida. Todas las preguntas y dudas me las aclaró, y me acompañó en todo el proceso.',
    author: 'Maria Carmona',
    context: 'Compra de terreno',
  },
  {
    text: 'Super recomendable: muy encima de todos los temas, resolutivo y muy simpático.',
    author: 'Romain Traversino',
    context: 'Colaboración con empresa francesa',
  },
];
