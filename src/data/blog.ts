export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  /** Fecha de la última revisión del contenido (dateModified). Si falta, se usa `date`. */
  updated?: string;
  /** Firma del artículo: el fundador (team.ts). shortcut: autoría asignada por defecto, pendiente de confirmar con el dueño. */
  author: { name: string; role: string; href: string };
  draft: boolean;
  intro: string;
  sections: BlogSection[];
  cta: { label: string; href: string };
}

const founder = { name: 'Boris Conde Jr.', role: 'CEO y fundador de Conroma Asesores', href: '/es/equipo/' };

/* Solo normativa general y verificable (Código Civil de Cataluña, LAU, IRPF, plusvalía municipal,
   RD 390/2021, Decret 141/2012, ITP del Decreto ley 5/2025). Nada de plazos o precios propios. */
export const posts: BlogPost[] = [
  {
    slug: 'quiero-vender-mi-piso-por-donde-empiezo',
    title: 'Quiero vender mi piso: ¿por dónde empiezo?',
    description: 'Los pasos para vender un piso sin líos, en orden: saber cuánto vale, preparar los papeles, enseñarlo bien, firmar las arras y llegar a notaría.',
    category: 'Vender',
    date: '2026-10-13',
    updated: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'Vender un piso impone, sobre todo la primera vez. Te lo contamos fácil, en el orden en que pasa de verdad.',
    sections: [
      {
        heading: '1. Saber cuánto vale',
        paragraphs: [
          'Todo empieza por el precio. Si sales demasiado alto, el piso se quema en los portales: la gente lo ve semana tras semana y acaba pensando que algo le pasa. Si sales bajo, pierdes dinero.',
          'Por eso lo primero es una valoración hecha por alguien que conozca tu calle, no solo tu código postal. Lo que cuenta es a cuánto se han vendido pisos parecidos cerca del tuyo, no a cuánto están anunciados. Entre un piso y otro del mismo barrio pesan mucho la planta, si hay ascensor, la luz, el estado y si tiene terraza o parking.',
          'Si además vas a comprar otro, conviene saber las dos cifras antes de mover ficha: lo que te van a dar por el tuyo y lo que te costará el siguiente.',
        ],
      },
      {
        heading: '2. Tener los papeles a mano',
        paragraphs: [
          'No hace falta tenerlo todo el primer día, pero cuanto antes lo reúnas, menos sustos al final. Hay uno que necesitas ya para anunciar el piso: el certificado de eficiencia energética, porque la etiqueta tiene que salir en el anuncio.',
          'La lista completa, con lo que pasa si el piso tiene hipoteca o viene de una herencia, la tienes en nuestra guía de papeles para vender un piso en Cataluña.',
        ],
      },
      {
        heading: '3. Prepararlo y enseñarlo bien',
        paragraphs: [
          'No hace falta reformar para vender. Sí ayuda despejar, arreglar lo pequeño (una persiana que no baja, un grifo que gotea) y ventilar antes de cada visita. Un piso ordenado se ve más grande en las fotos y en persona.',
          'Luego, buenas fotos, una descripción honesta y visitas con gente que de verdad puede comprar. Lo que el piso no tiene también se cuenta: ahorra visitas inútiles y evita que la operación se caiga más adelante.',
        ],
      },
      {
        heading: '4. Negociar y firmar las arras',
        paragraphs: [
          'Cuando llega una oferta que te encaja, se firma un contrato de arras: el comprador entrega una señal y los dos os comprometéis a firmar la venta antes de una fecha.',
          'En el contrato se dice qué tipo de arras son. Las más habituales son las penitenciales: si el comprador se echa atrás, pierde la señal; si te echas atrás tú, le devuelves el doble. Por eso conviene que el contrato lo diga claro, igual que quién paga cada gasto y qué pasa si el banco no le da la hipoteca al comprador.',
        ],
      },
      {
        heading: '5. La firma en notaría',
        paragraphs: [
          'El día de la firma, el notario lee la escritura, comprueba que el piso está a tu nombre y qué cargas tiene, y tú entregas las llaves. Si queda hipoteca, se paga ahí mismo con parte del dinero de la venta.',
          'Después, el comprador inscribe la compra en el Registro de la Propiedad y se cambian a su nombre los recibos del IBI, la comunidad y los suministros.',
        ],
      },
      {
        heading: '6. Lo que pagas tú al vender',
        paragraphs: ['Vender también tiene su parte de impuestos. Para que no te pille por sorpresa:'],
        list: [
          'IRPF. Si vendes por más de lo que te costó (sumando gastos e impuestos de cuando compraste), la diferencia es una ganancia que se declara en la renta del año siguiente. Si es tu vivienda habitual y reinviertes el dinero en otra vivienda habitual, o si tienes más de 65 años, puede quedar exenta.',
          'Plusvalía municipal. La cobra el ayuntamiento y la paga quien vende. Si vendes por menos de lo que compraste, no se paga, y puedes elegir el cálculo que te salga más barato.',
          'Cancelar la hipoteca, si la hay. Pagar lo que queda y quitarla del Registro tiene su coste de notaría y registro.',
          'El IBI del año. Lo paga quien es propietario el 1 de enero, aunque es habitual repartirlo con el comprador según los meses.',
        ],
      },
    ],
    cta: { label: 'Saber cuánto vale mi piso', href: '/es/valoracion/' },
  },
  {
    slug: 'papeles-para-vender-un-piso-en-cataluna',
    title: 'Papeles para vender un piso en Cataluña',
    description: 'Los papeles que te van a pedir para vender un piso en Cataluña, dónde se piden y qué pasa si tiene hipoteca, inquilino o viene de una herencia.',
    category: 'Vender',
    date: '2026-10-13',
    updated: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'No es la parte divertida, pero es la que más retrasa una venta cuando falta algo. Esta es la lista habitual, y dónde se pide cada cosa.',
    sections: [
      {
        heading: 'Lo que casi siempre hace falta',
        paragraphs: ['Cada operación tiene sus detalles, pero esto es lo que se suele pedir:'],
        list: [
          'Escritura de propiedad. Y una nota simple reciente del Registro, para ver que todo está a tu nombre y qué cargas tiene.',
          'Certificado de eficiencia energética. Hace falta ya para anunciar el piso.',
          'Cédula de habitabilidad en vigor.',
          'Último recibo del IBI.',
          'Certificado de la comunidad de propietarios de que estás al corriente de pago.',
          'DNI o NIE de todos los propietarios.',
        ],
      },
      {
        heading: 'Dónde se pide cada uno',
        paragraphs: [
          'La nota simple se pide al Registro de la Propiedad, en persona o por internet, y llega en poco tiempo. Es lo primero que mira cualquier comprador o banco, así que conviene tenerla reciente.',
          'El certificado energético lo hace un técnico habilitado, que visita el piso y lo inscribe en el registro del Institut Català d’Energia (ICAEN). En general vale diez años.',
          'La cédula de habitabilidad la expide la Agència de l’Habitatge de Catalunya. La de un piso de segunda mano vale quince años: mira la fecha, porque si está caducada hay que pedir una nueva y eso necesita también la visita de un técnico.',
          'El certificado de la comunidad lo firma el secretario o el administrador de la finca. Si debes alguna cuota, se salda antes de firmar.',
        ],
      },
      {
        heading: 'Si el piso tiene hipoteca',
        paragraphs: [
          'Se puede vender igual. Lo normal es pagar lo que queda el mismo día de la firma, con parte del dinero de la venta. Antes, el banco te da un certificado con la cantidad pendiente.',
          'Después hay que cancelarla también en el Registro. Es un trámite aparte, con su coste.',
        ],
      },
      {
        heading: 'Si está alquilado',
        paragraphs: [
          'Un piso alquilado se puede vender, y el comprador entra como nuevo casero respetando el contrato. Pero el inquilino tiene, por ley, derecho a comprarlo antes que nadie al mismo precio, salvo que renunciara a ese derecho en el contrato de alquiler.',
          'Por eso hay que avisarle por escrito del precio y las condiciones antes de vender. Si no se hace, puede reclamar la compra después.',
        ],
      },
      {
        heading: 'Si es una herencia',
        paragraphs: [
          'Antes de vender hay que tener la herencia aceptada ante notario y el piso a nombre de los herederos. Si estás en ese punto, lo vemos contigo con calma.',
          'Ojo con los plazos: en Cataluña, el impuesto de sucesiones se presenta en seis meses desde el fallecimiento, y se puede pedir una prórroga. La plusvalía municipal de la herencia tiene también su plazo de seis meses.',
        ],
      },
      {
        heading: 'Si sois varios propietarios',
        paragraphs: [
          'Si el piso es de varios (una pareja, hermanos, una herencia a medias), firman todos. Si alguno no puede ir a la notaría, puede dar un poder a otra persona para que firme por él.',
          'Si es de protección oficial, hay que mirar antes si sigue calificado como tal: en ese caso tiene un precio máximo de venta y hace falta comunicarlo a la Generalitat.',
        ],
      },
    ],
    cta: { label: 'Preguntarnos por tu caso', href: '/es/contacto/' },
  },
  {
    slug: 'comprar-piso-en-malgrat-de-mar-viviendo-fuera',
    title: 'Comprar piso en Malgrat de Mar viviendo fuera',
    description: 'Cómo comprar una vivienda en Malgrat de Mar si vives en otro país: el NIE, los impuestos, la hipoteca y cómo firmar sin tener que venir.',
    category: 'Comprar',
    date: '2026-10-13',
    updated: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'Mucha gente que compra en la costa no vive aquí. Se puede hacer bien y sin venir diez veces.',
    sections: [
      {
        heading: 'Te atendemos en tu idioma',
        paragraphs: ['Te atendemos en catalán, castellano, inglés y francés, para que entiendas bien lo que firmas.'],
      },
      {
        heading: 'Lo que vas a necesitar',
        paragraphs: ['Si no tienes nacionalidad española, cuenta con esto:'],
        list: [
          'Un NIE (número de identidad de extranjero). Te lo piden en la notaría y para pagar los impuestos. Se puede pedir en España o en el consulado español de tu país.',
          'Una cuenta bancaria en España. No es obligatoria por ley, pero facilita los pagos, los impuestos y los recibos.',
        ],
      },
      {
        heading: 'Los impuestos de la compra',
        paragraphs: [
          'Son los mismos que para alguien que vive aquí. Un piso de segunda mano en Cataluña paga el Impuesto de Transmisiones Patrimoniales: un 10% hasta 600.000 €. Uno de obra nueva paga IVA (10%) y actos jurídicos documentados.',
          'A eso se suman notaría, registro y, si la usas, gestoría. Haz la cuenta antes de ofertar: el precio del anuncio no es lo único que vas a pagar.',
        ],
      },
      {
        heading: 'Si necesitas hipoteca',
        paragraphs: [
          'Los bancos españoles dan hipotecas a no residentes, pero suelen financiar menos que a alguien que vive aquí y piden más papeles: ingresos, declaraciones de impuestos de tu país e informes de deudas.',
          'Como con cualquier hipoteca, los gastos de notaría, registro y gestoría del préstamo los paga el banco desde la Ley 5/2019. La tasación del piso, normalmente, la pagas tú.',
        ],
      },
      {
        heading: 'Si no puedes venir a firmar',
        paragraphs: [
          'Se puede firmar con un poder notarial a favor de una persona de confianza. Si lo haces en tu país, lo normal es que tenga que venir apostillado y traducido. Te explicamos cómo prepararlo.',
          'También puedes firmar ante el cónsul de España, que hace de notario para estos casos.',
        ],
      },
      {
        heading: 'Después de comprar',
        paragraphs: [
          'Si no vives en España, cada año declaras el Impuesto sobre la Renta de No Residentes por el piso, aunque no lo alquiles. Si lo alquilas, declaras lo que cobras.',
          'Pagarás también el IBI y la comunidad, como cualquier propietario. Y si algún día lo vendes siendo no residente, el comprador retiene un 3% del precio y lo ingresa a Hacienda a cuenta de tus impuestos.',
          'Comprar una vivienda ya no da permiso de residencia: la llamada golden visa se suprimió en abril de 2025. Si quieres vivir aquí, hay que pedir el permiso por otra vía.',
        ],
      },
      {
        heading: 'Por qué Malgrat de Mar',
        paragraphs: [
          'Malgrat está en el Alt Maresme, entre el aeropuerto de Barcelona y el de Girona, con estación de tren de la línea R1 y playa a pie desde el centro. Y es pueblo todo el año, no solo en verano.',
        ],
      },
    ],
    cta: { label: 'Ver pisos en venta', href: '/es/venta/malgrat-de-mar/' },
  },
];

/** Artículos publicados de una categoría, del más reciente al más antiguo. */
export function postsIn(category: string, limit = 3): BlogPost[] {
  return posts
    .filter((post) => post.category === category && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function findPost(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}
