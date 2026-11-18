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
  /** Reel de @conromaasesores en el que se basa el artículo: MP4 propio en public/video/{file}.mp4 y portada en src/assets/blog/reels/{instagram}.jpg. */
  video?: { instagram: string; file: string; title: string; uploaded: string; seconds: number };
}

const founder = { name: 'Boris Conde Jr.', role: 'CEO y fundador de Conroma Asesores', href: '/es/equipo/' };

/* Solo normativa general y verificable (Código Civil de Cataluña, LAU, IRPF, plusvalía municipal,
   RD 390/2021, Decret 141/2012, ITP del Decreto ley 5/2025). Nada de plazos o precios propios. */
export const posts: BlogPost[] = [
  {
    slug: 'quien-paga-cada-gasto-al-comprar-o-vender-un-piso',
    title: '¿Quién paga cada gasto al comprar o vender un piso?',
    description: 'ITP, plusvalía, notaría, registro, tasación, comisión e IBI: qué paga el comprador, qué paga el vendedor y qué se puede pactar en Cataluña.',
    category: 'Comprar',
    date: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'Notaría, registro, plusvalía, ITP… Es una de las dudas que más nos llegan. En el vídeo lo jugamos a ver si aciertas; aquí lo tienes por escrito, gasto a gasto.',
    video: { instagram: 'DfzYVvHxPCp', file: 'reel-quien-paga', title: '¿Quién paga cuando compras o vendes una vivienda?', uploaded: '2026-11-16', seconds: 46 },
    sections: [
      {
        heading: 'Lo que paga el comprador',
        paragraphs: ['Casi todo lo que tiene que ver con hacer la compra y dejarla a su nombre:'],
        list: [
          'ITP. En un piso de segunda mano en Cataluña, el Impuesto de Transmisiones Patrimoniales es un 10% del precio hasta 600.000 €. Si es de obra nueva, en lugar de ITP se paga IVA (10%) y actos jurídicos documentados.',
          'Tasación. Si compra con hipoteca, el banco pide una tasación oficial y la paga el comprador. Es el único gasto de la hipoteca que le toca: notaría, registro y gestoría del préstamo los paga el banco desde la Ley 5/2019.',
          'Notaría. Lo habitual es que la escritura de compraventa la pague el comprador. Se puede pactar otro reparto, y por eso conviene dejarlo escrito en las arras.',
          'Registro. Inscribir la compra en el Registro de la Propiedad es cosa del comprador: es lo que le protege como nuevo dueño.',
        ],
      },
      {
        heading: 'Lo que paga el vendedor',
        paragraphs: ['Lo que tiene que ver con haber sido el dueño hasta ahora:'],
        list: [
          'Plusvalía municipal. La cobra el ayuntamiento por la subida de valor del suelo y la paga quien vende. Si vende por menos de lo que compró, no se paga.',
          'IBI. Lo paga quien es propietario el 1 de enero. En el vídeo lo marcamos como «pactable», porque es habitual repartirlo con el comprador según los meses que cada uno tiene el piso ese año.',
          'Cancelar su hipoteca, si la hay, y los certificados para vender: el energético, la cédula de habitabilidad y, desde octubre de 2026, el de amianto.',
          'La ganancia en el IRPF, si vende por más de lo que le costó.',
        ],
      },
      {
        heading: 'Y la comisión de la agencia',
        paragraphs: [
          'En el vídeo la comisión sale a los dos lados, y es a propósito: la paga quien contrata a la agencia. Si la contrata el vendedor para vender, la paga él; si un comprador encarga a una agencia que le busque piso, la paga el comprador.',
          'Lo importante es que esté claro desde el principio, por escrito, cuánto es y quién la paga. Sin sorpresas el día de la firma.',
        ],
      },
      {
        heading: 'Antes de firmar las arras',
        paragraphs: [
          'Las arras son el momento de dejarlo todo atado: precio, fecha de la firma y quién paga cada gasto. Si algo de esta lista no te cuadra con tu caso, pregúntalo antes de firmar, no después.',
          'Si compras, haz la cuenta completa: precio, más el 10% de ITP, más notaría, registro y tasación. Puedes ver hasta dónde llegas con nuestra calculadora «¿Puedo comprar?».',
        ],
      },
    ],
    cta: { label: 'Calcular si puedo comprar', href: '/es/comprar/puedo-comprar/' },
  },
  {
    slug: 'certificado-de-amianto-para-vender-o-alquilar-en-cataluna',
    title: 'Certificado de amianto para vender o alquilar en Cataluña',
    description: 'Desde el 3 de octubre de 2026, la Ley 8/2026 pide un certificado de amianto para vender o alquilar en Cataluña. Qué es, a quién afecta y quién lo hace.',
    category: 'Vender',
    date: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'Es la nueva ley que más preguntas nos ha traído este otoño. Te contamos qué pide, a quién afecta y qué pasa si en tu edificio hay amianto.',
    video: { instagram: 'DebtL2ftE-X', file: 'reel-amianto', title: 'La nueva ley que ha afectado a la compraventa y el alquiler', uploaded: '2026-10-13', seconds: 36 },
    sections: [
      {
        heading: 'Qué ha cambiado',
        paragraphs: [
          'La Ley 8/2026, de erradicación del amianto en Cataluña, está en vigor desde el 3 de octubre de 2026. Entre otras cosas, pide un certificado de presencia o ausencia de amianto visible cuando se vende o se alquila un inmueble.',
          'En una venta, lo entrega el vendedor al comprador. En un alquiler, el propietario al inquilino.',
        ],
      },
      {
        heading: 'A qué pisos afecta',
        paragraphs: [
          'Según el criterio de la Agència de Residus de Catalunya, a los inmuebles construidos antes de 2002, que es cuando se prohibió vender productos con amianto. Y no solo a pisos: también a casas, locales, naves y terrenos.',
          'En el Maresme, buena parte de los pisos son de esos años, así que si vas a vender o alquilar es muy probable que te toque.',
        ],
      },
      {
        heading: 'Qué revisa el técnico',
        paragraphs: [
          'Es una inspección a la vista: el técnico mira los elementos donde suele haber amianto, como cubiertas de uralita, bajantes o depósitos, y anota su estado. No toma muestras ni hace análisis de laboratorio.',
          'Para un piso, el certificado se limita a la vivienda. La ley todavía no aclara si hará falta además uno de las zonas comunes del edificio, así que cuando lo hacemos pedimos acceso también a terrazas, balcones y terrados comunitarios.',
          'Hoy lo pueden firmar arquitectos, arquitectos técnicos e ingenieros. La Generalitat tiene un año para aprobar el reglamento que concrete el modelo, así que algunos detalles todavía pueden cambiar.',
        ],
      },
      {
        heading: '¿Se puede vender sin él?',
        paragraphs: [
          'Se puede firmar, pero no es buena idea. Vender o alquilar sin entregarlo es una infracción leve, con multas de 100 a 3.000 €, y el Registro de la Propiedad puede pedirlo para inscribir la compra. Si hay prisa, se puede firmar con el compromiso de aportarlo después.',
          'Lo sensato es pedirlo en cuanto decidas vender, junto con el certificado energético y la cédula. Así llega a tiempo para las arras.',
        ],
      },
      {
        heading: 'Si sale que hay amianto',
        paragraphs: [
          'Que haya amianto no impide vender ni alquilar. El certificado sirve para informar: dice dónde está, en qué estado y si supone un riesgo, y se anota en el Registro de la Propiedad.',
          'Si hay que retirarlo, lo tiene que hacer una empresa autorizada. El comprador lo sabrá antes de firmar, y eso es justo lo que busca la ley.',
        ],
      },
    ],
    cta: { label: 'Pedir el certificado de amianto', href: '/es/contacto/' },
  },
  {
    slug: 'ayudas-al-alquiler-de-la-generalitat',
    title: 'Ayudas al alquiler de la Generalitat: quién puede pedirlas',
    description: 'Las ayudas de la Generalitat para pagar el alquiler: quién puede pedirlas, cuánto dan, qué alquiler máximo se acepta en el Maresme y cuándo se piden.',
    category: 'Alquilar',
    date: '2026-11-18',
    author: founder,
    draft: false,
    intro: 'Muchas familias van justas cada mes con el alquiler y no saben que la Generalitat tiene ayudas pensadas para eso. El problema es que se piden en plazos cortos y se pasan.',
    video: { instagram: 'Dac63hXIAw7', file: 'reel-ayudas-alquiler', title: 'Ayuda al alquiler de la Generalitat para jóvenes', uploaded: '2026-07-06', seconds: 28 },
    sections: [
      {
        heading: 'Qué son',
        paragraphs: [
          'Son subvenciones de la Agència de l’Habitatge de Catalunya para ayudarte a pagar el alquiler de tu vivienda habitual. Se convocan cada año por edades: una línea para jóvenes de hasta 35 años, otra de 36 a 64 y otra para mayores de 65.',
          'En 2026 no se daban por orden de llegada: se estudiaba y puntuaba cada caso con los requisitos de la convocatoria.',
        ],
      },
      {
        heading: 'La de jóvenes, la del vídeo',
        paragraphs: [
          'En 2026, la ayuda para jóvenes era para quien tuviera 35 años o menos a 31 de enero y fuera titular de un contrato de alquiler, de un piso o de una habitación. Daba entre 20 y 250 € al mes, según la parte del sueldo que se te va en el alquiler.',
          'El plazo fue muy corto: del 29 de junio al 10 de julio de 2026. Por eso subimos el vídeo justo antes de que cerrara.',
        ],
      },
      {
        heading: 'Cuánto alquiler se acepta en el Maresme',
        paragraphs: ['La convocatoria pone un tope al alquiler que se puede subvencionar. En 2026, para Malgrat de Mar y el resto del Maresme (demarcación de Barcelona, fuera del área metropolitana):'],
        list: [
          'Un piso entero: hasta 750 € al mes.',
          'Una habitación, en la línea de jóvenes: hasta 350 € al mes.',
          'En la línea de jóvenes, si eres familia numerosa, monoparental o con una persona con discapacidad reconocida: hasta 900 € al mes.',
        ],
      },
      {
        heading: 'Cómo se piden',
        paragraphs: [
          'Por internet, con el formulario de la Agència de l’Habitatge de Catalunya en su web. Necesitas el contrato de alquiler, los recibos pagados y los datos de ingresos de quienes viven en el piso. Las oficinas locales de vivienda suelen ayudar a tramitarla.',
          'Cada convocatoria fija sus propios límites de ingresos y documentos. Léelos antes de empezar: cambian de un año a otro.',
        ],
      },
      {
        heading: 'Para no quedarte fuera',
        paragraphs: [
          'En 2026, las líneas de 36 a 64 años y de mayores de 65 se pidieron en primavera (la de 36 a 64 cerró el 30 de abril) y la de jóvenes, a principios de verano. Si vives de alquiler, apúntate esas fechas y mira la web de la Agència cuando se acerquen.',
          'Si tienes dudas o quieres que te echemos una mano con los papeles, escríbenos.',
        ],
      },
    ],
    cta: { label: 'Ver pisos en alquiler', href: '/es/alquilar/' },
  },
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
