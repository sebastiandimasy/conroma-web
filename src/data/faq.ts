export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaq: FaqItem[] = [
  {
    question: '¿Cuánto vale mi piso en Malgrat de Mar?',
    answer:
      'Depende de la zona, los metros, la planta y el estado. Pasamos a verlo y te damos un precio realista con los últimos pisos vendidos en tu calle. La valoración es gratis y no te compromete a nada.',
  },
  {
    question: '¿Cuánto cuesta vender un piso con inmobiliaria?',
    answer:
      'Trabajamos con honorarios sobre el precio de venta, que pactamos antes de empezar y sin letra pequeña. Dentro entran las fotos, la publicación, las visitas, la negociación y el acompañamiento hasta la firma en notaría.',
  },
  {
    question: '¿Cuánto se tarda en vender un piso en el Maresme?',
    answer:
      'Un piso bien valorado en Malgrat de Mar, Palafolls o Santa Susanna suele venderse en unas semanas. Lo que más alarga una venta es salir con un precio por encima de mercado; por eso empezamos siempre por una valoración honesta.',
  },
  {
    question: '¿Qué papeles necesito para vender mi casa?',
    answer:
      'Escritura, último recibo del IBI, certificado energético y la cédula de habitabilidad. Si te falta alguno, lo tramitamos nosotros para que no frene la venta.',
  },
  {
    question: 'Busco piso en Malgrat, Blanes o Lloret de Mar, ¿cómo lo hago?',
    answer:
      'Dinos zona, presupuesto y para cuándo. Te enseñamos lo que tenemos en venta y te avisamos en cuanto entra algo que encaje, también lo que todavía no está publicado en los portales.',
  },
  {
    question: 'Vivo en el extranjero, ¿podéis encargaros de todo?',
    answer:
      'Sí. Te atendemos en catalán, castellano, inglés y francés, y nos ocupamos de visitas, papeles y notaría para que no tengas que venir a cada paso.',
  },
  {
    question: 'Tengo un piso vacío, ¿me buscáis inquilino?',
    answer:
      'Buscamos inquilino, enseñamos el piso, revisamos la solvencia y preparamos el contrato. Tú decides a quién se lo alquilas.',
  },
  {
    question: '¿Valorar mi piso me compromete a algo?',
    answer: 'No. La valoración es gratis y no te obliga a vender con nosotros.',
  },
];

export const guarantees: FaqItem[] = [
  {
    question: 'Una misma persona todo el proceso',
    answer: 'Nada de empezar con alguien y acabar con otro. Quien te atiende el primer día te acompaña hasta la firma.',
  },
  {
    question: 'Te atendemos en cuatro idiomas',
    answer: 'Catalán, castellano, inglés y francés. Hablamos como te vaya mejor.',
  },
  {
    question: 'Si un piso no te conviene, te lo decimos',
    answer: 'Y también lo que no nos gusta de él. Mejor saberlo antes de firmar que después.',
  },
];

export function townFaq(town: string): FaqItem[] {
  return [
    {
      question: `¿Cómo vendo mi piso en ${town}?`,
      answer: `Nos dices la dirección, pasamos a verlo y te decimos cuánto vale. Si te cuadra, nos encargamos de fotos, visitas, negociación y papeles.`,
    },
    {
      question: `¿Cuánto cuesta valorar un piso en ${town}?`,
      answer: 'Nada. La valoración es gratis y sin compromiso.',
    },
    {
      question: `¿Tenéis oficina en ${town}?`,
      answer: `La oficina está en Malgrat de Mar, en la Av. Mediterránea 16. Nos desplazamos a ${town} para ver tu piso y para las visitas.`,
    },
  ];
}
