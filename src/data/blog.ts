import { localizePath, strings, type Lang } from '../i18n';

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

/** Artículo ya en un idioma: lo que pintan las páginas (sale de `localizePost`). */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Categoría visible, ya traducida. */
  category: string;
  date: string;
  /** Fecha de la última revisión del contenido (dateModified). Si falta, se usa `date`. */
  updated?: string;
  author: { name: string; role: string; href: string };
  draft: boolean;
  intro: string;
  summary: string;
  sections: BlogSection[];
  cta: { label: string; href: string };
  video?: { instagram: string; file: string; title: string; uploaded: string; seconds: number };
}

/** Texto de un artículo en un idioma. */
interface PostText {
  title: string;
  description: string;
  intro: string;
  /** Respuesta directa en 1-2 frases, arriba del artículo (fragmentos destacados y buscadores con IA). */
  summary: string;
  /** Párrafos y elementos de lista admiten enlaces internos [texto](/xx/ruta/), ya en el idioma del texto. */
  sections: BlogSection[];
  /** Texto del botón final. */
  cta: string;
  /** Título del reel en este idioma (el vídeo está en español). */
  video?: string;
}

type Category = 'Comprar' | 'Vender' | 'Alquilar';

/** Artículo en los tres idiomas. Slug, fechas, vídeo y categoría (como clave) no cambian con el idioma. */
export interface BlogEntry {
  slug: string;
  category: Category;
  date: string;
  updated?: string;
  draft: boolean;
  /** Ruta del botón final en español; se localiza al idioma de la página. */
  cta: string;
  /** Reel de @conromaasesores en el que se basa el artículo: MP4 propio en public/video/{file}.mp4 y portada en src/assets/blog/reels/{instagram}.jpg. */
  video?: { instagram: string; file: string; uploaded: string; seconds: number };
  text: Record<Lang, PostText>;
}

const categoryNames = strings<Record<Category, string>>({
  es: { Comprar: 'Comprar', Vender: 'Vender', Alquilar: 'Alquilar' },
  en: { Comprar: 'Buying', Vender: 'Selling', Alquilar: 'Renting' },
  ca: { Comprar: 'Comprar', Vender: 'Vendre', Alquilar: 'Llogar' },
});

/** Firma del artículo: el fundador (team.ts). shortcut: autoría asignada por defecto, pendiente de confirmar con el dueño. */
const founder = {
  name: 'Boris Conde Jr.',
  href: '/es/equipo/',
  role: strings({
    es: 'CEO y fundador de Conroma Asesores',
    en: 'CEO and founder of Conroma Asesores',
    ca: 'CEO i fundador de Conroma Asesores',
  }),
};

/* Solo normativa general y verificable (Código Civil de Cataluña, LAU, IRPF, plusvalía municipal,
   RD 390/2021, Decret 141/2012, ITP del Decreto ley 5/2025). Nada de plazos o precios propios. */
export const posts: BlogEntry[] = [
  {
    slug: 'quien-paga-cada-gasto-al-comprar-o-vender-un-piso',
    category: 'Comprar',
    date: '2026-11-18',
    draft: false,
    cta: '/es/comprar/puedo-comprar/',
    video: { instagram: 'DfzYVvHxPCp', file: 'reel-quien-paga', uploaded: '2026-11-16', seconds: 46 },
    text: strings<PostText>({
      es: {
        title: '¿Quién paga cada gasto al comprar o vender un piso?',
        description: 'ITP, plusvalía, notaría, registro, tasación, comisión e IBI: qué paga el comprador, qué paga el vendedor y qué se puede pactar en Cataluña.',
        intro: 'Notaría, registro, plusvalía, ITP… Es una de las dudas que más nos llegan. En el vídeo lo jugamos a ver si aciertas; aquí lo tienes por escrito, gasto a gasto.',
        summary: 'El comprador paga el ITP (o el IVA si el piso es nuevo), la notaría, el registro y la tasación si pide hipoteca. El vendedor paga la plusvalía municipal, la cancelación de su hipoteca y los certificados. El IBI del año se suele repartir, y la comisión la paga quien contrata a la agencia.',
        video: '¿Quién paga cuando compras o vendes una vivienda?',
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
              'Cancelar su hipoteca, si la hay, y los certificados para vender: el energético, la cédula de habitabilidad y, desde octubre de 2026, [el de amianto](/es/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'La ganancia en el IRPF, si vende por más de lo que le costó.',
            ],
          },
          {
            heading: '¿Quién paga la comisión de la inmobiliaria?',
            paragraphs: [
              'En el vídeo la comisión sale a los dos lados, y es a propósito: la paga quien contrata a la agencia. Si la contrata el vendedor para vender, la paga él; si un comprador encarga a una agencia que le busque piso, la paga el comprador.',
              'Lo importante es que esté claro desde el principio, por escrito, cuánto es y quién la paga. Sin sorpresas el día de la firma.',
            ],
          },
          {
            heading: 'Antes de firmar las arras',
            paragraphs: [
              'Las arras son el momento de dejarlo todo atado: precio, fecha de la firma y quién paga cada gasto. Si algo de esta lista no te cuadra con tu caso, pregúntalo antes de firmar, no después.',
              'Si compras, haz la cuenta completa: precio, más el 10% de ITP, más notaría, registro y tasación. Puedes ver hasta dónde llegas con nuestra [calculadora «¿Puedo comprar?»](/es/comprar/puedo-comprar/).',
              'Si vendes, ten a mano [los papeles que te van a pedir](/es/blog/papeles-para-vender-un-piso-en-cataluna/) antes de llegar a las arras.',
            ],
          },
        ],
        cta: 'Calcular si puedo comprar',
      },
      en: {
        title: 'Who pays what when you buy or sell a home?',
        description: 'ITP, plusvalía, notary, Land Registry, valuation, agency fee and IBI: what the buyer pays, what the seller pays and what’s negotiable in Catalonia.',
        intro: 'Notary, Land Registry, plusvalía, ITP… It’s one of the questions we get asked most. In the video we turn it into a guessing game; here you have it in writing, cost by cost.',
        summary: 'The buyer pays the property transfer tax (ITP), or VAT if the home is new, plus the notary, the Land Registry and the valuation if they need a mortgage. The seller pays the plusvalía municipal (a local tax on the rise in land value), cancelling their mortgage and the certificates. The year’s IBI (council tax) is usually split, and the agency fee is paid by whoever hires the agency.',
        video: 'Who pays when you buy or sell a home?',
        sections: [
          {
            heading: 'What the buyer pays',
            paragraphs: ['Pretty much everything to do with making the purchase and putting the property in their name:'],
            list: [
              'ITP. On a resale home in Catalonia, the property transfer tax (Impuesto de Transmisiones Patrimoniales) is 10% of the price up to €600,000. On a new-build, instead of ITP you pay VAT (10%) plus stamp duty (actos jurídicos documentados).',
              'Valuation. If they’re buying with a mortgage, the bank asks for an official valuation and the buyer pays for it. It’s the only mortgage cost that falls on them: since Ley 5/2019, the bank pays the notary, Land Registry and paperwork agency (gestoría) fees for the loan.',
              'Notary. The buyer usually pays for the deed of sale. You can agree a different split, which is why it’s worth putting it in writing in the deposit contract (arras).',
              'Land Registry. Registering the purchase in the Registro de la Propiedad is down to the buyer: it’s what protects them as the new owner.',
            ],
          },
          {
            heading: 'What the seller pays',
            paragraphs: ['Everything to do with having been the owner up to now:'],
            list: [
              'Plusvalía municipal. The town hall charges it on the rise in the value of the land, and the seller pays it. If they sell for less than they paid, it isn’t due.',
              'IBI. Whoever owns the property on 1 January pays it. In the video we mark it as “negotiable”, because it’s normally split with the buyer according to the months each of them owns the home that year.',
              'Cancelling their mortgage, if there is one, and the certificates needed to sell: the energy certificate (EPC), the cédula de habitabilidad (certificate of habitability) and, since October 2026, [the asbestos certificate](/en/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'Income tax (IRPF) on the gain, if they sell for more than it cost them.',
            ],
          },
          {
            heading: 'Who pays the estate agent’s fee?',
            paragraphs: [
              'In the video the fee shows up on both sides, and that’s on purpose: it’s paid by whoever hires the agency. If the seller hires it to sell, the seller pays; if a buyer asks an agency to find them a home, the buyer pays.',
              'What matters is that it’s clear from the start, in writing: how much it is and who pays it. No surprises on signing day.',
            ],
          },
          {
            heading: 'Before you sign the arras',
            paragraphs: [
              'The arras (deposit contract) is the moment to tie everything up: price, signing date and who pays each cost. If anything on this list doesn’t fit your case, ask before you sign, not after.',
              'If you’re buying, do the full sum: price, plus 10% ITP, plus notary, Land Registry and valuation. You can see how far your budget stretches with our [“Can I afford to buy?” calculator](/en/comprar/puedo-comprar/).',
              'If you’re selling, have [the paperwork you’ll be asked for](/en/blog/papeles-para-vender-un-piso-en-cataluna/) ready before you get to the arras.',
            ],
          },
        ],
        cta: 'See if I can afford to buy',
      },
      ca: {
        title: 'Qui paga cada despesa en comprar o vendre un pis?',
        description: 'ITP, plusvàlua, notaria, registre, taxació, comissió i IBI: què paga el comprador, què paga el venedor i què es pot pactar a Catalunya.',
        intro: 'Notaria, registre, plusvàlua, ITP… És un dels dubtes que més ens arriben. Al vídeo hi juguem a veure si l’encertes; aquí ho tens per escrit, despesa per despesa.',
        summary: 'El comprador paga l’ITP (o l’IVA si el pis és nou), la notaria, el registre i la taxació si demana hipoteca. El venedor paga la plusvàlua municipal, la cancel·lació de la seva hipoteca i els certificats. L’IBI de l’any se sol repartir, i la comissió la paga qui contracta l’agència.',
        video: 'Qui paga quan compres o vens un habitatge?',
        sections: [
          {
            heading: 'El que paga el comprador',
            paragraphs: ['Gairebé tot el que té a veure amb fer la compra i posar-la al seu nom:'],
            list: [
              'ITP. En un pis de segona mà a Catalunya, l’impost de transmissions patrimonials és un 10% del preu fins a 600.000 €. Si és d’obra nova, en lloc d’ITP es paga IVA (10%) i actes jurídics documentats.',
              'Taxació. Si compra amb hipoteca, el banc demana una taxació oficial i la paga el comprador. És l’única despesa de la hipoteca que li toca: notaria, registre i gestoria del préstec els paga el banc des de la Llei 5/2019.',
              'Notaria. El més habitual és que l’escriptura de compravenda la pagui el comprador. Es pot pactar un altre repartiment, i per això convé deixar-ho per escrit a les arres.',
              'Registre. Inscriure la compra al Registre de la Propietat és cosa del comprador: és el que el protegeix com a nou propietari.',
            ],
          },
          {
            heading: 'El que paga el venedor',
            paragraphs: ['El que té a veure amb haver estat el propietari fins ara:'],
            list: [
              'Plusvàlua municipal. La cobra l’ajuntament per la pujada de valor del sòl i la paga qui ven. Si ven per menys del que va comprar, no es paga.',
              'IBI. El paga qui és propietari l’1 de gener. Al vídeo el marquem com a «pactable», perquè és habitual repartir-lo amb el comprador segons els mesos que cadascú té el pis aquell any.',
              'Cancel·lar la seva hipoteca, si en té, i els certificats per vendre: l’energètic, la cèdula d’habitabilitat i, des d’octubre de 2026, [el d’amiant](/ca/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'El guany a l’IRPF, si ven per més del que li va costar.',
            ],
          },
          {
            heading: 'Qui paga la comissió de la immobiliària?',
            paragraphs: [
              'Al vídeo la comissió surt als dos costats, i és expressament: la paga qui contracta l’agència. Si la contracta el venedor per vendre, la paga ell; si un comprador encarrega a una agència que li busqui pis, la paga el comprador.',
              'L’important és que quedi clar des del principi, per escrit, quant és i qui la paga. Sense sorpreses el dia de la signatura.',
            ],
          },
          {
            heading: 'Abans de signar les arres',
            paragraphs: [
              'Les arres són el moment de deixar-ho tot lligat: preu, data de la signatura i qui paga cada despesa. Si alguna cosa d’aquesta llista no et quadra amb el teu cas, pregunta-ho abans de signar, no després.',
              'Si compres, fes el compte complet: preu, més el 10% d’ITP, més notaria, registre i taxació. Pots veure fins on arribes amb la nostra [calculadora «Puc comprar?»](/ca/comprar/puedo-comprar/).',
              'Si vens, tingues a mà [els papers que et demanaran](/ca/blog/papeles-para-vender-un-piso-en-cataluna/) abans d’arribar a les arres.',
            ],
          },
        ],
        cta: 'Calcular si puc comprar',
      },
    }),
  },
  {
    slug: 'certificado-de-amianto-para-vender-o-alquilar-en-cataluna',
    category: 'Vender',
    date: '2026-11-18',
    draft: false,
    cta: '/es/contacto/',
    video: { instagram: 'DebtL2ftE-X', file: 'reel-amianto', uploaded: '2026-10-13', seconds: 36 },
    text: strings<PostText>({
      es: {
        title: 'Certificado de amianto para vender o alquilar en Cataluña',
        description: 'Desde el 3 de octubre de 2026, la Ley 8/2026 pide un certificado de amianto para vender o alquilar en Cataluña. Qué es, a quién afecta y quién lo hace.',
        intro: 'Es la nueva ley que más preguntas nos ha traído este otoño. Te contamos qué pide, a quién afecta y qué pasa si en tu edificio hay amianto.',
        summary: 'Desde el 3 de octubre de 2026, quien vende o alquila en Cataluña un inmueble construido antes de 2002 tiene que entregar un certificado de presencia o ausencia de amianto visible. Lo firma un arquitecto, arquitecto técnico o ingeniero tras una inspección a la vista. No entregarlo no anula la venta, pero es una infracción leve con multas de 100 a 3.000 €.',
        video: 'La nueva ley que ha afectado a la compraventa y el alquiler',
        sections: [
          {
            heading: 'Qué pide la Ley 8/2026 del amianto',
            paragraphs: [
              'La Ley 8/2026, de erradicación del amianto en Cataluña, está en vigor desde el 3 de octubre de 2026. Entre otras cosas, pide un certificado de presencia o ausencia de amianto visible cuando se vende o se alquila un inmueble.',
              'En una venta, lo entrega el vendedor al comprador. En un alquiler, el propietario al inquilino.',
            ],
          },
          {
            heading: 'A qué viviendas afecta',
            paragraphs: [
              'Según el criterio de la Agència de Residus de Catalunya, a los inmuebles construidos antes de 2002, que es cuando se prohibió vender productos con amianto. Y no solo a pisos: también a casas, locales, naves y terrenos.',
              'En el Maresme, buena parte de los pisos son de esos años, así que si vas a [vender](/es/vender/) o alquilar es muy probable que te toque.',
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
            heading: '¿Se puede vender o alquilar sin el certificado?',
            paragraphs: [
              'Se puede firmar, pero no es buena idea. Vender o alquilar sin entregarlo es una infracción leve, con multas de 100 a 3.000 €, y el Registro de la Propiedad puede pedirlo para inscribir la compra. Si hay prisa, se puede firmar con el compromiso de aportarlo después.',
              'Lo sensato es pedirlo en cuanto decidas vender, junto con [el certificado energético y la cédula](/es/blog/papeles-para-vender-un-piso-en-cataluna/). Así llega a tiempo para las arras.',
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
        cta: 'Pedir el certificado de amianto',
      },
      en: {
        title: 'Asbestos certificate to sell or rent in Catalonia',
        description: 'Since 3 October 2026, Ley 8/2026 requires an asbestos certificate to sell or rent out a property in Catalonia. What it is, who it affects and who issues it.',
        intro: 'It’s the new law that’s brought us the most questions this autumn. Here’s what it asks for, who it affects and what happens if there’s asbestos in your building.',
        summary: 'Since 3 October 2026, anyone selling or renting out a property in Catalonia built before 2002 has to hand over a certificate stating whether there is visible asbestos or not. It’s signed by an architect, building surveyor (arquitecto técnico) or engineer after a visual inspection. Not providing it doesn’t cancel the sale, but it’s a minor offence with fines of €100 to €3,000.',
        video: 'The new law that has changed buying, selling and renting',
        sections: [
          {
            heading: 'What Ley 8/2026 on asbestos requires',
            paragraphs: [
              'Ley 8/2026, on the eradication of asbestos in Catalonia, has been in force since 3 October 2026. Among other things, it requires a certificate of the presence or absence of visible asbestos whenever a property is sold or rented out.',
              'In a sale, the seller gives it to the buyer. In a rental, the landlord gives it to the tenant.',
            ],
          },
          {
            heading: 'Which properties it affects',
            paragraphs: [
              'According to the Agència de Residus de Catalunya, properties built before 2002, which is when selling products containing asbestos was banned. And not just flats: houses, commercial premises, industrial units and plots of land too.',
              'In the Maresme, a good share of flats date from those years, so if you’re going to [sell](/en/vender/) or rent out, it will very likely apply to you.',
            ],
          },
          {
            heading: 'What the specialist checks',
            paragraphs: [
              'It’s a visual inspection: the specialist looks at the places where asbestos usually turns up, such as uralita (asbestos cement) roofs, downpipes or water tanks, and notes their condition. No samples are taken and there’s no lab analysis.',
              'For a flat, the certificate only covers the home itself. The law doesn’t yet make clear whether the building’s communal areas will also need one, so when we arrange it we also ask for access to shared terraces, balconies and flat roofs.',
              'Right now it can be signed by architects, building surveyors and engineers. The Generalitat has a year to approve the regulations that set out the official format, so some details may still change.',
            ],
          },
          {
            heading: 'Can you sell or rent without the certificate?',
            paragraphs: [
              'You can sign, but it’s not a good idea. Selling or renting without handing it over is a minor offence, with fines of €100 to €3,000, and the Land Registry may ask for it before registering the purchase. If you’re in a hurry, you can sign with a commitment to provide it later.',
              'The sensible thing is to order it as soon as you decide to sell, along with [the energy certificate and the cédula](/en/blog/papeles-para-vender-un-piso-en-cataluna/). That way it’s ready in time for the arras (deposit contract).',
            ],
          },
          {
            heading: 'If asbestos turns up',
            paragraphs: [
              'Having asbestos doesn’t stop you selling or renting. The certificate is there to inform: it says where it is, what condition it’s in and whether it poses a risk, and it’s noted in the Land Registry.',
              'If it has to be removed, an authorised company has to do it. The buyer will know before signing, and that’s exactly what the law is after.',
            ],
          },
        ],
        cta: 'Ask for the asbestos certificate',
      },
      ca: {
        title: 'Certificat d’amiant per vendre o llogar a Catalunya',
        description: 'Des del 3 d’octubre de 2026, la Llei 8/2026 demana un certificat d’amiant per vendre o llogar a Catalunya. Què és, a qui afecta i qui el fa.',
        intro: 'És la llei nova que més preguntes ens ha portat aquesta tardor. T’expliquem què demana, a qui afecta i què passa si al teu edifici hi ha amiant.',
        summary: 'Des del 3 d’octubre de 2026, qui ven o lloga a Catalunya un immoble construït abans del 2002 ha de lliurar un certificat de presència o absència d’amiant visible. El signa un arquitecte, arquitecte tècnic o enginyer després d’una inspecció visual. No lliurar-lo no anul·la la venda, però és una infracció lleu amb multes de 100 a 3.000 €.',
        video: 'La nova llei que ha afectat la compravenda i el lloguer',
        sections: [
          {
            heading: 'Què demana la Llei 8/2026 de l’amiant',
            paragraphs: [
              'La Llei 8/2026, d’erradicació de l’amiant a Catalunya, és vigent des del 3 d’octubre de 2026. Entre altres coses, demana un certificat de presència o absència d’amiant visible quan es ven o es lloga un immoble.',
              'En una venda, el lliura el venedor al comprador. En un lloguer, el propietari a l’inquilí.',
            ],
          },
          {
            heading: 'A quins habitatges afecta',
            paragraphs: [
              'Segons el criteri de l’Agència de Residus de Catalunya, als immobles construïts abans del 2002, que és quan es va prohibir vendre productes amb amiant. I no només als pisos: també a cases, locals, naus i terrenys.',
              'Al Maresme, bona part dels pisos són d’aquells anys, així que si has de [vendre](/ca/vender/) o llogar és molt probable que et toqui.',
            ],
          },
          {
            heading: 'Què revisa el tècnic',
            paragraphs: [
              'És una inspecció visual: el tècnic mira els elements on sol haver-hi amiant, com cobertes d’uralita, baixants o dipòsits, i n’anota l’estat. No pren mostres ni fa anàlisis de laboratori.',
              'Per a un pis, el certificat es limita a l’habitatge. La llei encara no aclareix si caldrà també un de les zones comunes de l’edifici, així que quan el fem demanem accés també a terrasses, balcons i terrats comunitaris.',
              'Avui el poden signar arquitectes, arquitectes tècnics i enginyers. La Generalitat té un any per aprovar el reglament que concreti el model, així que alguns detalls encara poden canviar.',
            ],
          },
          {
            heading: 'Es pot vendre o llogar sense el certificat?',
            paragraphs: [
              'Es pot signar, però no és bona idea. Vendre o llogar sense lliurar-lo és una infracció lleu, amb multes de 100 a 3.000 €, i el Registre de la Propietat el pot demanar per inscriure la compra. Si hi ha pressa, es pot signar amb el compromís d’aportar-lo després.',
              'El més assenyat és demanar-lo tan bon punt decideixis vendre, juntament amb [el certificat energètic i la cèdula](/ca/blog/papeles-para-vender-un-piso-en-cataluna/). Així arriba a temps per a les arres.',
            ],
          },
          {
            heading: 'Si surt que hi ha amiant',
            paragraphs: [
              'Que hi hagi amiant no impedeix vendre ni llogar. El certificat serveix per informar: diu on és, en quin estat i si suposa un risc, i s’anota al Registre de la Propietat.',
              'Si s’ha de retirar, ho ha de fer una empresa autoritzada. El comprador ho sabrà abans de signar, i això és just el que busca la llei.',
            ],
          },
        ],
        cta: 'Demanar el certificat d’amiant',
      },
    }),
  },
  {
    slug: 'ayudas-al-alquiler-de-la-generalitat',
    category: 'Alquilar',
    date: '2026-11-18',
    draft: false,
    cta: '/es/alquilar/',
    video: { instagram: 'Dac63hXIAw7', file: 'reel-ayudas-alquiler', uploaded: '2026-07-06', seconds: 28 },
    text: strings<PostText>({
      es: {
        title: 'Ayudas al alquiler de la Generalitat: quién puede pedirlas',
        description: 'Las ayudas de la Generalitat para pagar el alquiler: quién puede pedirlas, cuánto dan, qué alquiler máximo se acepta en el Maresme y cuándo se piden.',
        intro: 'Muchas familias van justas cada mes con el alquiler y no saben que la Generalitat tiene ayudas pensadas para eso. El problema es que se piden en plazos cortos y se pasan.',
        summary: 'La Agència de l’Habitatge de Catalunya convoca cada año ayudas para pagar el alquiler de la vivienda habitual, por edades. En 2026, la de jóvenes de hasta 35 años daba de 20 a 250 € al mes y se pidió del 29 de junio al 10 de julio. En el Maresme se aceptaba un alquiler de hasta 750 € al mes por un piso entero.',
        video: 'Ayuda al alquiler de la Generalitat para jóvenes',
        sections: [
          {
            heading: 'Qué son las ayudas al alquiler de la Generalitat',
            paragraphs: [
              'Son subvenciones de la Agència de l’Habitatge de Catalunya para ayudarte a pagar el alquiler de tu vivienda habitual. Se convocan cada año por edades: una línea para jóvenes de hasta 35 años, otra de 36 a 64 y otra para mayores de 65.',
              'En 2026 no se daban por orden de llegada: se estudiaba y puntuaba cada caso con los requisitos de la convocatoria.',
            ],
          },
          {
            heading: 'La ayuda para jóvenes de hasta 35 años',
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
            heading: 'Cómo se pide la ayuda',
            paragraphs: [
              'Por internet, con el formulario de la Agència de l’Habitatge de Catalunya en su web. Necesitas el contrato de alquiler, los recibos pagados y los datos de ingresos de quienes viven en el piso. Las oficinas locales de vivienda suelen ayudar a tramitarla.',
              'Cada convocatoria fija sus propios límites de ingresos y documentos. Léelos antes de empezar: cambian de un año a otro.',
            ],
          },
          {
            heading: 'Cuándo se piden: los plazos de 2026',
            paragraphs: [
              'En 2026, las líneas de 36 a 64 años y de mayores de 65 se pidieron en primavera (la de 36 a 64 cerró el 30 de abril) y la de jóvenes, a principios de verano. Si vives de alquiler, apúntate esas fechas y mira la web de la Agència cuando se acerquen.',
              'Si tienes dudas o quieres que te echemos una mano con los papeles, [escríbenos](/es/contacto/).',
            ],
          },
        ],
        cta: 'Ver pisos en alquiler',
      },
      en: {
        title: 'Generalitat rent grants: who can apply',
        description: 'The Generalitat’s grants to help pay your rent: who can apply, how much they give, the maximum rent accepted in the Maresme and when to apply.',
        intro: 'Lots of families struggle to cover the rent every month and don’t know the Generalitat has grants meant for exactly that. The catch is that the application windows are short and easy to miss.',
        summary: 'Every year the Agència de l’Habitatge de Catalunya opens grants to help pay the rent on your main home, split by age group. In 2026, the one for young people aged 35 and under gave €20 to €250 a month, and applications ran from 29 June to 10 July. In the Maresme, rents of up to €750 a month for a whole flat were accepted.',
        video: 'Generalitat rent grant for young people',
        sections: [
          {
            heading: 'What the Generalitat rent grants are',
            paragraphs: [
              'They’re subsidies from the Agència de l’Habitatge de Catalunya to help you pay the rent on your main home. They open every year by age group: one line for young people aged 35 and under, another for 36 to 64, and another for over-65s.',
              'In 2026 they weren’t first come, first served: each case was assessed and scored against the requirements in the call.',
            ],
          },
          {
            heading: 'The grant for young people aged 35 and under',
            paragraphs: [
              'In 2026, the youth grant was for anyone aged 35 or under on 31 January who held a rental contract, for a flat or a room. It gave between €20 and €250 a month, depending on how much of your income goes on rent.',
              'The window was very short: from 29 June to 10 July 2026. That’s why we posted the video just before it closed.',
            ],
          },
          {
            heading: 'How much rent is accepted in the Maresme',
            paragraphs: ['The call sets a cap on the rent that can be subsidised. In 2026, for Malgrat de Mar and the rest of the Maresme (province of Barcelona, outside the metropolitan area):'],
            list: [
              'A whole flat: up to €750 a month.',
              'A room, under the youth line: up to €350 a month.',
              'Under the youth line, if you’re a large family, a single-parent family or a household with someone with a recognised disability: up to €900 a month.',
            ],
          },
          {
            heading: 'How to apply',
            paragraphs: [
              'Online, using the form on the Agència de l’Habitatge de Catalunya website. You’ll need the rental contract, the paid rent receipts and income details for everyone living in the flat. Local housing offices (oficines locals d’habitatge) can usually help with the application.',
              'Each call sets its own income limits and documents. Read them before you start: they change from one year to the next.',
            ],
          },
          {
            heading: 'When to apply: the 2026 dates',
            paragraphs: [
              'In 2026, the lines for 36 to 64 and over-65s opened in spring (the 36 to 64 one closed on 30 April) and the youth line at the start of summer. If you rent, make a note of those dates and check the Agència’s website as they get closer.',
              'If you have questions or want us to give you a hand with the paperwork, [message us](/en/contacto/).',
            ],
          },
        ],
        cta: 'See homes for rent',
      },
      ca: {
        title: 'Ajuts al lloguer de la Generalitat: qui els pot demanar',
        description: 'Els ajuts de la Generalitat per pagar el lloguer: qui els pot demanar, quant donen, quin lloguer màxim s’accepta al Maresme i quan es demanen.',
        intro: 'Moltes famílies van justes cada mes amb el lloguer i no saben que la Generalitat té ajuts pensats per a això. El problema és que es demanen en terminis curts i se’ls passen.',
        summary: 'L’Agència de l’Habitatge de Catalunya convoca cada any ajuts per pagar el lloguer de l’habitatge habitual, per edats. El 2026, el de joves de fins a 35 anys donava de 20 a 250 € al mes i es va demanar del 29 de juny al 10 de juliol. Al Maresme s’acceptava un lloguer de fins a 750 € al mes per un pis sencer.',
        video: 'Ajut al lloguer de la Generalitat per a joves',
        sections: [
          {
            heading: 'Què són els ajuts al lloguer de la Generalitat',
            paragraphs: [
              'Són subvencions de l’Agència de l’Habitatge de Catalunya per ajudar-te a pagar el lloguer del teu habitatge habitual. Es convoquen cada any per edats: una línia per a joves de fins a 35 anys, una altra de 36 a 64 i una altra per a més grans de 65.',
              'El 2026 no es donaven per ordre d’arribada: s’estudiava i puntuava cada cas amb els requisits de la convocatòria.',
            ],
          },
          {
            heading: 'L’ajut per a joves de fins a 35 anys',
            paragraphs: [
              'El 2026, l’ajut per a joves era per a qui tingués 35 anys o menys a 31 de gener i fos titular d’un contracte de lloguer, d’un pis o d’una habitació. Donava entre 20 i 250 € al mes, segons la part del sou que se t’emporta el lloguer.',
              'El termini va ser molt curt: del 29 de juny al 10 de juliol de 2026. Per això vam penjar el vídeo just abans que tanqués.',
            ],
          },
          {
            heading: 'Quant lloguer s’accepta al Maresme',
            paragraphs: ['La convocatòria posa un límit al lloguer que es pot subvencionar. El 2026, per a Malgrat de Mar i la resta del Maresme (demarcació de Barcelona, fora de l’àrea metropolitana):'],
            list: [
              'Un pis sencer: fins a 750 € al mes.',
              'Una habitació, a la línia de joves: fins a 350 € al mes.',
              'A la línia de joves, si sou família nombrosa, monoparental o amb una persona amb discapacitat reconeguda: fins a 900 € al mes.',
            ],
          },
          {
            heading: 'Com es demana l’ajut',
            paragraphs: [
              'Per internet, amb el formulari de l’Agència de l’Habitatge de Catalunya al seu web. Necessites el contracte de lloguer, els rebuts pagats i les dades d’ingressos de les persones que viuen al pis. Les oficines locals d’habitatge solen ajudar a tramitar-lo.',
              'Cada convocatòria fixa els seus propis límits d’ingressos i documents. Llegeix-los abans de començar: canvien d’un any a l’altre.',
            ],
          },
          {
            heading: 'Quan es demanen: els terminis del 2026',
            paragraphs: [
              'El 2026, les línies de 36 a 64 anys i de més grans de 65 es van demanar a la primavera (la de 36 a 64 va tancar el 30 d’abril) i la de joves, a principis d’estiu. Si vius de lloguer, apunta’t aquestes dates i mira el web de l’Agència quan s’acostin.',
              'Si tens dubtes o vols que et donem un cop de mà amb els papers, [escriu-nos](/ca/contacto/).',
            ],
          },
        ],
        cta: 'Veure pisos de lloguer',
      },
    }),
  },
  {
    slug: 'quiero-vender-mi-piso-por-donde-empiezo',
    category: 'Vender',
    date: '2026-10-13',
    updated: '2026-11-18',
    draft: false,
    cta: '/es/valoracion/',
    text: strings<PostText>({
      es: {
        title: 'Quiero vender mi piso: ¿por dónde empiezo?',
        description: 'Los pasos para vender un piso sin líos, en orden: saber cuánto vale, preparar los papeles, enseñarlo bien, firmar las arras y llegar a notaría.',
        intro: 'Vender un piso impone, sobre todo la primera vez. Te lo contamos fácil, en el orden en que pasa de verdad.',
        summary: 'Se empieza por saber cuánto vale el piso de verdad, mirando a cuánto se han vendido otros parecidos cerca, no a cuánto se anuncian. Después vienen los papeles, preparar y enseñar el piso, las arras y la firma en notaría, en ese orden.',
        sections: [
          {
            heading: '1. Saber cuánto vale',
            paragraphs: [
              'Todo empieza por el precio. Si sales demasiado alto, el piso se quema en los portales: la gente lo ve semana tras semana y acaba pensando que algo le pasa. Si sales bajo, pierdes dinero.',
              'Por eso lo primero es una [valoración](/es/valoracion/) hecha por alguien que conozca tu calle, no solo tu código postal. Lo que cuenta es a cuánto se han vendido pisos parecidos cerca del tuyo, no a cuánto están anunciados. Entre un piso y otro del mismo barrio pesan mucho la planta, si hay ascensor, la luz, el estado y si tiene terraza o parking.',
              'Si además vas a comprar otro, conviene saber las dos cifras antes de mover ficha: lo que te van a dar por el tuyo y lo que te costará el siguiente.',
            ],
          },
          {
            heading: '2. Tener los papeles a mano',
            paragraphs: [
              'No hace falta tenerlo todo el primer día, pero cuanto antes lo reúnas, menos sustos al final. Hay uno que necesitas ya para anunciar el piso: el certificado de eficiencia energética, porque la etiqueta tiene que salir en el anuncio. Y si el edificio es anterior a 2002, pide también [el certificado de amianto](/es/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'La lista completa, con lo que pasa si el piso tiene hipoteca o viene de una herencia, la tienes en nuestra [guía de papeles para vender un piso en Cataluña](/es/blog/papeles-para-vender-un-piso-en-cataluna/).',
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
              'En el contrato se dice qué tipo de arras son. Las más habituales son las penitenciales: si el comprador se echa atrás, pierde la señal; si te echas atrás tú, le devuelves el doble. Por eso conviene que el contrato lo diga claro, igual que [quién paga cada gasto](/es/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/) y qué pasa si el banco no le da la hipoteca al comprador.',
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
        cta: 'Saber cuánto vale mi piso',
      },
      en: {
        title: 'I want to sell my home: where do I start?',
        description: 'Selling a home without the hassle, step by step: find out what it’s worth, get the paperwork ready, show it well, sign the arras and complete at the notary.',
        intro: 'Selling a home can feel daunting, especially the first time. Here it is, plain and simple, in the order it really happens.',
        summary: 'You start by finding out what the home is really worth, by looking at what similar homes nearby have sold for, not what they’re advertised at. Then come the paperwork, getting the home ready and showing it, the arras (deposit contract) and signing at the notary, in that order.',
        sections: [
          {
            heading: '1. Find out what it’s worth',
            paragraphs: [
              'It all starts with the price. If you go in too high, the home goes stale on the property portals: people see it week after week and end up thinking something’s wrong with it. If you go in too low, you lose money.',
              'That’s why the first thing is a [valuation](/en/valoracion/) by someone who knows your street, not just your postcode. What counts is what similar homes near yours have sold for, not what they’re listed at. Between two homes in the same neighbourhood, the floor, whether there’s a lift, the light, the condition and whether it has a terrace or parking all make a big difference.',
              'If you’re also buying another one, it’s worth knowing both figures before you make a move: what you’ll get for yours and what the next one will cost you.',
            ],
          },
          {
            heading: '2. Have the paperwork to hand',
            paragraphs: [
              'You don’t need everything on day one, but the sooner you gather it, the fewer surprises at the end. There’s one you need straight away to advertise the home: the energy performance certificate (EPC), because the rating has to appear in the listing. And if the building dates from before 2002, order [the asbestos certificate](/en/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/) too.',
              'The full list, including what happens if the home has a mortgage or was inherited, is in our [guide to the paperwork for selling a home in Catalonia](/en/blog/papeles-para-vender-un-piso-en-cataluna/).',
            ],
          },
          {
            heading: '3. Get it ready and show it well',
            paragraphs: [
              'You don’t need to renovate to sell. It does help to declutter, fix the small things (a blind that won’t come down, a dripping tap) and air the place before each viewing. A tidy home looks bigger, in photos and in person.',
              'Then: good photos, an honest description and viewings with people who can actually buy. What the home doesn’t have gets mentioned too: it saves pointless viewings and stops the sale falling through later on.',
            ],
          },
          {
            heading: '4. Negotiate and sign the arras',
            paragraphs: [
              'When an offer comes in that works for you, you sign a deposit contract (contrato de arras): the buyer pays a deposit and you both commit to completing the sale by a set date.',
              'The contract states which type of arras it is. The most common are arras penitenciales: if the buyer pulls out, they lose the deposit; if you pull out, you pay them back double. That’s why the contract should spell it out, along with [who pays each cost](/en/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/) and what happens if the bank turns down the buyer’s mortgage.',
            ],
          },
          {
            heading: '5. Signing at the notary',
            paragraphs: [
              'On signing day, the notary reads out the deed, checks that the home is in your name and what charges are registered against it, and you hand over the keys. If there’s still a mortgage, it’s paid off there and then with part of the sale money.',
              'Afterwards, the buyer registers the purchase at the Land Registry, and the IBI, community fees and utility bills are switched to their name.',
            ],
          },
          {
            heading: '6. What you pay when you sell',
            paragraphs: ['Selling comes with its share of taxes too. So nothing catches you off guard:'],
            list: [
              'Income tax (IRPF). If you sell for more than it cost you (adding the costs and taxes from when you bought), the difference is a gain you declare in the following year’s tax return. If it’s your main home and you reinvest the money in another main home, or if you’re over 65, it may be exempt.',
              'Plusvalía municipal. The town hall charges it and the seller pays it. If you sell for less than you paid, it isn’t due, and you can choose whichever calculation works out cheaper.',
              'Cancelling the mortgage, if there is one. Paying off what’s left and removing it from the Land Registry has its own notary and registry costs.',
              'The year’s IBI (council tax). It’s paid by whoever owns the property on 1 January, although it’s common to split it with the buyer by months.',
            ],
          },
        ],
        cta: 'Find out what my home is worth',
      },
      ca: {
        title: 'Vull vendre el meu pis: per on començo?',
        description: 'Els passos per vendre un pis sense embolics, per ordre: saber quant val, preparar els papers, ensenyar-lo bé, signar les arres i arribar a la notaria.',
        intro: 'Vendre un pis fa respecte, sobretot la primera vegada. T’ho expliquem fàcil, en l’ordre en què passa de veritat.',
        summary: 'Es comença per saber quant val el pis de veritat, mirant a quant s’han venut altres pisos semblants a prop, no a quant s’anuncien. Després hi ha els papers, preparar i ensenyar el pis, les arres i la signatura a la notaria, en aquest ordre.',
        sections: [
          {
            heading: '1. Saber quant val',
            paragraphs: [
              'Tot comença pel preu. Si surts massa alt, el pis es crema als portals: la gent el veu setmana rere setmana i acaba pensant que alguna cosa li passa. Si surts baix, perds diners.',
              'Per això el primer és una [valoració](/ca/valoracion/) feta per algú que conegui el teu carrer, no només el teu codi postal. El que compta és a quant s’han venut pisos semblants a prop del teu, no a quant estan anunciats. Entre un pis i un altre del mateix barri pesen molt la planta, si hi ha ascensor, la llum, l’estat i si té terrassa o pàrquing.',
              'Si a més en compraràs un altre, convé saber les dues xifres abans de moure fitxa: el que et donaran pel teu i el que et costarà el següent.',
            ],
          },
          {
            heading: '2. Tenir els papers a mà',
            paragraphs: [
              'No cal tenir-ho tot el primer dia, però com més aviat ho reuneixis, menys ensurts al final. N’hi ha un que necessites ja per anunciar el pis: el certificat d’eficiència energètica, perquè l’etiqueta ha de sortir a l’anunci. I si l’edifici és anterior al 2002, demana també [el certificat d’amiant](/ca/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'La llista completa, amb el que passa si el pis té hipoteca o ve d’una herència, la tens a la nostra [guia de papers per vendre un pis a Catalunya](/ca/blog/papeles-para-vender-un-piso-en-cataluna/).',
            ],
          },
          {
            heading: '3. Preparar-lo i ensenyar-lo bé',
            paragraphs: [
              'No cal reformar per vendre. Sí que ajuda treure coses del mig, arreglar el que és petit (una persiana que no baixa, una aixeta que degota) i ventilar abans de cada visita. Un pis endreçat es veu més gran a les fotos i en persona.',
              'Després, bones fotos, una descripció honesta i visites amb gent que de veritat pot comprar. El que el pis no té també s’explica: estalvia visites inútils i evita que l’operació caigui més endavant.',
            ],
          },
          {
            heading: '4. Negociar i signar les arres',
            paragraphs: [
              'Quan arriba una oferta que t’encaixa, se signa un contracte d’arres: el comprador lliura una paga i senyal i tots dos us comprometeu a signar la venda abans d’una data.',
              'Al contracte es diu quin tipus d’arres són. Les més habituals són les penitencials: si el comprador es fa enrere, perd la paga i senyal; si te’n fas enrere tu, li tornes el doble. Per això convé que el contracte ho digui clar, igual que [qui paga cada despesa](/ca/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/) i què passa si el banc no li dona la hipoteca al comprador.',
            ],
          },
          {
            heading: '5. La signatura a la notaria',
            paragraphs: [
              'El dia de la signatura, el notari llegeix l’escriptura, comprova que el pis és al teu nom i quines càrregues té, i tu lliures les claus. Si queda hipoteca, es paga allà mateix amb part dels diners de la venda.',
              'Després, el comprador inscriu la compra al Registre de la Propietat i es canvien al seu nom els rebuts de l’IBI, la comunitat i els subministraments.',
            ],
          },
          {
            heading: '6. El que pagues tu en vendre',
            paragraphs: ['Vendre també té la seva part d’impostos. Perquè no t’agafi per sorpresa:'],
            list: [
              'IRPF. Si vens per més del que et va costar (sumant despeses i impostos de quan vas comprar), la diferència és un guany que es declara a la renda de l’any següent. Si és el teu habitatge habitual i reinverteixes els diners en un altre habitatge habitual, o si tens més de 65 anys, pot quedar exempt.',
              'Plusvàlua municipal. La cobra l’ajuntament i la paga qui ven. Si vens per menys del que vas comprar, no es paga, i pots triar el càlcul que et surti més barat.',
              'Cancel·lar la hipoteca, si n’hi ha. Pagar el que queda i treure-la del Registre té el seu cost de notaria i registre.',
              'L’IBI de l’any. El paga qui és propietari l’1 de gener, tot i que és habitual repartir-lo amb el comprador segons els mesos.',
            ],
          },
        ],
        cta: 'Saber quant val el meu pis',
      },
    }),
  },
  {
    slug: 'papeles-para-vender-un-piso-en-cataluna',
    category: 'Vender',
    date: '2026-10-13',
    updated: '2026-11-18',
    draft: false,
    cta: '/es/contacto/',
    text: strings<PostText>({
      es: {
        title: 'Papeles para vender un piso en Cataluña',
        description: 'Los papeles que te van a pedir para vender un piso en Cataluña, dónde se piden y qué pasa si tiene hipoteca, inquilino o viene de una herencia.',
        intro: 'No es la parte divertida, pero es la que más retrasa una venta cuando falta algo. Esta es la lista habitual, y dónde se pide cada cosa.',
        summary: 'Para vender un piso en Cataluña se suele pedir la escritura y una nota simple, el certificado energético, la cédula de habitabilidad, el último IBI, el certificado de la comunidad y el DNI de los propietarios. Si el edificio es anterior a 2002, también el certificado de amianto. Con hipoteca, inquilino o herencia hay pasos de más.',
        sections: [
          {
            heading: 'Lo que casi siempre hace falta',
            paragraphs: ['Cada operación tiene sus detalles, pero esto es lo que se suele pedir:'],
            list: [
              'Escritura de propiedad. Y una nota simple reciente del Registro, para ver que todo está a tu nombre y qué cargas tiene.',
              'Certificado de eficiencia energética. Hace falta ya para anunciar el piso.',
              'Cédula de habitabilidad en vigor.',
              'Certificado de amianto, si el edificio es anterior a 2002. Lo pide la Ley 8/2026 desde el 3 de octubre de 2026: te lo contamos en [la guía del certificado de amianto](/es/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
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
              'El de amianto lo firma un arquitecto, arquitecto técnico o ingeniero después de revisar el piso a la vista. Si encargas el energético, pregunta si te pueden hacer los dos en la misma visita.',
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
              'Antes de vender hay que tener la herencia aceptada ante notario y el piso a nombre de los herederos. Si estás en ese punto, [lo vemos contigo](/es/contacto/) con calma.',
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
        cta: 'Preguntarnos por tu caso',
      },
      en: {
        title: 'Paperwork for selling a home in Catalonia',
        description: 'The documents you’ll be asked for to sell a home in Catalonia, where to get them and what happens if it has a mortgage or a tenant, or was inherited.',
        intro: 'It’s not the fun part, but it’s what holds up a sale the most when something’s missing. Here’s the usual list, and where to get each document.',
        summary: 'To sell a home in Catalonia you’re usually asked for the title deed and a nota simple (Land Registry extract), the energy certificate, the cédula de habitabilidad, the latest IBI bill, the community of owners certificate and the owners’ ID. If the building is from before 2002, the asbestos certificate too. With a mortgage, a tenant or an inheritance there are extra steps.',
        sections: [
          {
            heading: 'What you almost always need',
            paragraphs: ['Every sale has its own details, but this is what you’re usually asked for:'],
            list: [
              'Title deed (escritura de propiedad). Plus a recent nota simple from the Land Registry, to check that everything is in your name and what charges are registered against it.',
              'Energy performance certificate (EPC). You need it from the start to advertise the home.',
              'A valid cédula de habitabilidad (certificate of habitability).',
              'Asbestos certificate, if the building dates from before 2002. Ley 8/2026 has required it since 3 October 2026: we explain it in [our asbestos certificate guide](/en/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'The latest IBI (council tax) receipt.',
              'A certificate from the community of owners showing you’re up to date with payments.',
              'DNI or NIE (Spanish ID or foreigner identification number) of all the owners.',
            ],
          },
          {
            heading: 'Where to get each one',
            paragraphs: [
              'You request the nota simple from the Land Registry, in person or online, and it arrives quickly. It’s the first thing any buyer or bank looks at, so it’s best to have a recent one.',
              'The energy certificate is done by a qualified specialist, who visits the home and registers it with the Institut Català d’Energia (ICAEN). It’s generally valid for ten years.',
              'The cédula de habitabilidad is issued by the Agència de l’Habitatge de Catalunya. For a resale home it’s valid for fifteen years: check the date, because if it has expired you need to apply for a new one, and that also requires a visit from a specialist.',
              'The asbestos certificate is signed by an architect, building surveyor or engineer after a visual check of the home. If you’re ordering the energy certificate, ask whether they can do both on the same visit.',
              'The community certificate is signed by the secretary or the property administrator. If you owe any fees, they’re settled before signing.',
            ],
          },
          {
            heading: 'If the home has a mortgage',
            paragraphs: [
              'You can still sell. The usual thing is to pay off what’s left on the day of signing, with part of the sale money. Beforehand, the bank gives you a certificate with the outstanding amount.',
              'After that it also has to be cancelled at the Land Registry. That’s a separate step, with its own cost.',
            ],
          },
          {
            heading: 'If it’s rented out',
            paragraphs: [
              'A rented home can be sold, and the buyer takes over as the new landlord, respecting the existing contract. But by law the tenant has the right to buy it before anyone else at the same price, unless they waived that right in the rental contract.',
              'That’s why you have to notify them in writing of the price and terms before selling. If you don’t, they can claim the purchase afterwards.',
            ],
          },
          {
            heading: 'If it’s an inheritance',
            paragraphs: [
              'Before selling, the inheritance has to be accepted before a notary and the home put in the heirs’ names. If that’s where you are, [we’ll go through it with you](/en/contacto/), no rush.',
              'Watch the deadlines: in Catalonia, inheritance tax (impuesto de sucesiones) has to be filed within six months of the death, and you can ask for an extension. The plusvalía municipal on the inheritance also has its own six-month deadline.',
            ],
          },
          {
            heading: 'If there are several owners',
            paragraphs: [
              'If the home belongs to several people (a couple, siblings, a shared inheritance), they all sign. If one of them can’t make it to the notary, they can give someone else power of attorney to sign for them.',
              'If it’s state-subsidised housing (protección oficial), first check whether it still has that status: if so, it has a maximum sale price and the Generalitat has to be notified.',
            ],
          },
        ],
        cta: 'Ask us about your case',
      },
      ca: {
        title: 'Papers per vendre un pis a Catalunya',
        description: 'Els papers que et demanaran per vendre un pis a Catalunya, on es demanen i què passa si té hipoteca, inquilí o ve d’una herència.',
        intro: 'No és la part divertida, però és la que més endarrereix una venda quan falta alguna cosa. Aquesta és la llista habitual, i on es demana cada cosa.',
        summary: 'Per vendre un pis a Catalunya se sol demanar l’escriptura i una nota simple, el certificat energètic, la cèdula d’habitabilitat, l’últim IBI, el certificat de la comunitat i el DNI dels propietaris. Si l’edifici és anterior al 2002, també el certificat d’amiant. Amb hipoteca, inquilí o herència hi ha passos de més.',
        sections: [
          {
            heading: 'El que gairebé sempre cal',
            paragraphs: ['Cada operació té els seus detalls, però això és el que se sol demanar:'],
            list: [
              'Escriptura de propietat. I una nota simple recent del Registre, per veure que tot és al teu nom i quines càrregues té.',
              'Certificat d’eficiència energètica. Cal ja per anunciar el pis.',
              'Cèdula d’habitabilitat vigent.',
              'Certificat d’amiant, si l’edifici és anterior al 2002. El demana la Llei 8/2026 des del 3 d’octubre de 2026: t’ho expliquem a [la guia del certificat d’amiant](/ca/blog/certificado-de-amianto-para-vender-o-alquilar-en-cataluna/).',
              'Últim rebut de l’IBI.',
              'Certificat de la comunitat de propietaris conforme estàs al corrent de pagament.',
              'DNI o NIE de tots els propietaris.',
            ],
          },
          {
            heading: 'On es demana cadascun',
            paragraphs: [
              'La nota simple es demana al Registre de la Propietat, en persona o per internet, i arriba en poc temps. És el primer que mira qualsevol comprador o banc, així que convé tenir-la recent.',
              'El certificat energètic el fa un tècnic habilitat, que visita el pis i l’inscriu al registre de l’Institut Català d’Energia (ICAEN). En general val deu anys.',
              'La cèdula d’habitabilitat l’expedeix l’Agència de l’Habitatge de Catalunya. La d’un pis de segona mà val quinze anys: mira’n la data, perquè si està caducada se n’ha de demanar una de nova i això també necessita la visita d’un tècnic.',
              'El d’amiant el signa un arquitecte, arquitecte tècnic o enginyer després de revisar el pis visualment. Si encarregues l’energètic, pregunta si te’ls poden fer tots dos en la mateixa visita.',
              'El certificat de la comunitat el signa el secretari o l’administrador de la finca. Si deus alguna quota, es liquida abans de signar.',
            ],
          },
          {
            heading: 'Si el pis té hipoteca',
            paragraphs: [
              'Es pot vendre igualment. El normal és pagar el que queda el mateix dia de la signatura, amb part dels diners de la venda. Abans, el banc et dona un certificat amb la quantitat pendent.',
              'Després s’ha de cancel·lar també al Registre. És un tràmit a part, amb el seu cost.',
            ],
          },
          {
            heading: 'Si està llogat',
            paragraphs: [
              'Un pis llogat es pot vendre, i el comprador passa a ser el nou arrendador respectant el contracte. Però l’inquilí té, per llei, dret a comprar-lo abans que ningú al mateix preu, llevat que hi renunciés al contracte de lloguer.',
              'Per això cal avisar-lo per escrit del preu i les condicions abans de vendre. Si no es fa, pot reclamar la compra després.',
            ],
          },
          {
            heading: 'Si és una herència',
            paragraphs: [
              'Abans de vendre cal tenir l’herència acceptada davant notari i el pis a nom dels hereus. Si ets en aquest punt, [ho mirem amb tu](/ca/contacto/) amb calma.',
              'Compte amb els terminis: a Catalunya, l’impost de successions es presenta en sis mesos des de la defunció, i es pot demanar una pròrroga. La plusvàlua municipal de l’herència també té el seu termini de sis mesos.',
            ],
          },
          {
            heading: 'Si sou diversos propietaris',
            paragraphs: [
              'Si el pis és de diverses persones (una parella, germans, una herència a mitges), signen totes. Si alguna no pot anar a la notaria, pot donar un poder a una altra persona perquè signi per ella.',
              'Si és de protecció oficial, cal mirar abans si encara està qualificat com a tal: en aquest cas té un preu màxim de venda i cal comunicar-ho a la Generalitat.',
            ],
          },
        ],
        cta: 'Preguntar-nos pel teu cas',
      },
    }),
  },
  {
    slug: 'comprar-piso-en-malgrat-de-mar-viviendo-fuera',
    category: 'Comprar',
    date: '2026-10-13',
    updated: '2026-11-18',
    draft: false,
    cta: '/es/venta/malgrat-de-mar/',
    text: strings<PostText>({
      es: {
        title: 'Comprar piso en Malgrat de Mar viviendo fuera',
        description: 'Cómo comprar una vivienda en Malgrat de Mar si vives en otro país: el NIE, los impuestos, la hipoteca y cómo firmar sin tener que venir.',
        intro: 'Mucha gente que compra en la costa no vive aquí. Se puede hacer bien y sin venir diez veces.',
        summary: 'Se puede comprar sin vivir en España: necesitas un NIE, pagas los mismos impuestos que un residente (un 10% de ITP en un piso de segunda mano) y puedes firmar con un poder notarial sin venir. Después declaras cada año el Impuesto sobre la Renta de No Residentes.',
        sections: [
          {
            heading: 'Lo que vas a necesitar: NIE y cuenta en España',
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
              'A eso se suman notaría, registro y, si la usas, gestoría. Haz la cuenta antes de ofertar: el precio del anuncio no es lo único que vas a pagar. Aquí tienes [quién paga cada gasto de la compraventa](/es/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/).',
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
              'Nosotros te atendemos en catalán, castellano, inglés y francés, para que entiendas bien todo lo que firmas.',
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
              'Si quieres hacerte una idea de precios, mira [los pisos en venta en Malgrat de Mar](/es/venta/malgrat-de-mar/).',
            ],
          },
        ],
        cta: 'Ver pisos en venta',
      },
      en: {
        title: 'Buying a home in Malgrat de Mar while living abroad',
        description: 'How to buy a home in Malgrat de Mar if you live in another country: the NIE, the taxes, getting a mortgage and how to sign without having to travel.',
        intro: 'Lots of people who buy on the coast don’t live here. It can be done properly, without flying over ten times.',
        summary: 'You can buy without living in Spain: you need an NIE, you pay the same taxes as a resident (10% property transfer tax, ITP, on a resale home) and you can sign through a power of attorney without travelling. After that, you file Non-Resident Income Tax (Impuesto sobre la Renta de No Residentes) every year.',
        sections: [
          {
            heading: 'What you’ll need: an NIE and a Spanish bank account',
            paragraphs: ['If you don’t have Spanish nationality, you’ll need the following:'],
            list: [
              'An NIE (foreigner identification number). The notary asks for it, and you need it to pay the taxes. You can apply for it in Spain or at the Spanish consulate in your country.',
              'A Spanish bank account. It isn’t a legal requirement, but it makes payments, taxes and bills easier.',
            ],
          },
          {
            heading: 'Taxes on the purchase',
            paragraphs: [
              'They’re the same as for someone who lives here. A resale home in Catalonia pays property transfer tax (Impuesto de Transmisiones Patrimoniales, ITP): 10% up to €600,000. A new-build pays VAT (10%) plus stamp duty (actos jurídicos documentados).',
              'On top of that come the notary, the Land Registry and, if you use one, a gestoría (an agency that handles the paperwork). Do the sums before you make an offer: the advertised price isn’t the only thing you’ll pay. Here’s [who pays each cost when you buy or sell](/en/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/).',
            ],
          },
          {
            heading: 'If you need a mortgage',
            paragraphs: [
              'Spanish banks do give mortgages to non-residents, but they usually lend less than to someone who lives here and ask for more paperwork: proof of income, tax returns from your country and credit reports.',
              'As with any mortgage, the bank has paid the notary, Land Registry and gestoría fees for the loan since Ley 5/2019. The valuation of the home is normally paid by you.',
            ],
          },
          {
            heading: 'If you can’t come to sign',
            paragraphs: [
              'You can sign through a notarised power of attorney in favour of someone you trust. If you grant it in your own country, it will usually need an apostille and a translation. We’ll explain how to get it ready.',
              'You can also sign before the Spanish consul, who acts as a notary in these cases.',
              'We can help you in Catalan, Spanish, English and French, so you understand everything you sign.',
            ],
          },
          {
            heading: 'After you buy',
            paragraphs: [
              'If you don’t live in Spain, every year you file Non-Resident Income Tax on the property, even if you don’t rent it out. If you do rent it out, you declare what you earn.',
              'You’ll also pay the IBI (council tax) and community fees, like any owner. And if you ever sell it as a non-resident, the buyer withholds 3% of the price and pays it to the Spanish tax office (Hacienda) on account of your taxes.',
              'Buying a home no longer gets you residency: the so-called golden visa was scrapped in April 2025. If you want to live here, you’ll need to apply for a permit another way.',
            ],
          },
          {
            heading: 'Why Malgrat de Mar',
            paragraphs: [
              'Malgrat is in the Alt Maresme, between Barcelona and Girona airports, with a train station on the R1 line and the beach within walking distance of the centre. And it’s a real town all year round, not just in summer.',
              'To get an idea of prices, have a look at [the homes for sale in Malgrat de Mar](/en/venta/malgrat-de-mar/).',
            ],
          },
        ],
        cta: 'See homes for sale',
      },
      ca: {
        title: 'Comprar pis a Malgrat de Mar vivint fora',
        description: 'Com comprar un habitatge a Malgrat de Mar si vius en un altre país: el NIE, els impostos, la hipoteca i com signar sense haver de venir.',
        intro: 'Molta gent que compra a la costa no viu aquí. Es pot fer bé i sense venir deu vegades.',
        summary: 'Es pot comprar sense viure a Espanya: necessites un NIE, pagues els mateixos impostos que un resident (un 10% d’ITP en un pis de segona mà) i pots signar amb un poder notarial sense venir. Després declares cada any l’impost sobre la renda de no residents.',
        sections: [
          {
            heading: 'El que necessitaràs: NIE i compte a Espanya',
            paragraphs: ['Si no tens nacionalitat espanyola, compta amb això:'],
            list: [
              'Un NIE (número d’identitat d’estranger). Te’l demanen a la notaria i per pagar els impostos. Es pot demanar a Espanya o al consolat espanyol del teu país.',
              'Un compte bancari a Espanya. No és obligatori per llei, però facilita els pagaments, els impostos i els rebuts.',
            ],
          },
          {
            heading: 'Els impostos de la compra',
            paragraphs: [
              'Són els mateixos que per a algú que viu aquí. Un pis de segona mà a Catalunya paga l’impost de transmissions patrimonials: un 10% fins a 600.000 €. Un d’obra nova paga IVA (10%) i actes jurídics documentats.',
              'A això s’hi sumen notaria, registre i, si la fas servir, gestoria. Fes el compte abans de fer una oferta: el preu de l’anunci no és l’únic que pagaràs. Aquí tens [qui paga cada despesa de la compravenda](/ca/blog/quien-paga-cada-gasto-al-comprar-o-vender-un-piso/).',
            ],
          },
          {
            heading: 'Si necessites hipoteca',
            paragraphs: [
              'Els bancs espanyols donen hipoteques a no residents, però solen finançar menys que a algú que viu aquí i demanen més papers: ingressos, declaracions d’impostos del teu país i informes de deutes.',
              'Com amb qualsevol hipoteca, les despeses de notaria, registre i gestoria del préstec les paga el banc des de la Llei 5/2019. La taxació del pis, normalment, la pagues tu.',
            ],
          },
          {
            heading: 'Si no pots venir a signar',
            paragraphs: [
              'Es pot signar amb un poder notarial a favor d’una persona de confiança. Si el fas al teu país, el normal és que hagi de venir apostillat i traduït. T’expliquem com preparar-lo.',
              'També pots signar davant el cònsol d’Espanya, que fa de notari en aquests casos.',
              'Nosaltres t’atenem en català, castellà, anglès i francès, perquè entenguis bé tot el que signes.',
            ],
          },
          {
            heading: 'Després de comprar',
            paragraphs: [
              'Si no vius a Espanya, cada any declares l’impost sobre la renda de no residents pel pis, encara que no el lloguis. Si el llogues, declares el que cobres.',
              'També pagaràs l’IBI i la comunitat, com qualsevol propietari. I si algun dia el vens sent no resident, el comprador reté un 3% del preu i l’ingressa a Hisenda a compte dels teus impostos.',
              'Comprar un habitatge ja no dona permís de residència: l’anomenada golden visa es va suprimir l’abril de 2025. Si vols viure aquí, s’ha de demanar el permís per una altra via.',
            ],
          },
          {
            heading: 'Per què Malgrat de Mar',
            paragraphs: [
              'Malgrat és a l’Alt Maresme, entre l’aeroport de Barcelona i el de Girona, amb estació de tren de la línia R1 i platja a peu des del centre. I és poble tot l’any, no només a l’estiu.',
              'Si et vols fer una idea de preus, mira [els pisos en venda a Malgrat de Mar](/ca/venta/malgrat-de-mar/).',
            ],
          },
        ],
        cta: 'Veure pisos en venda',
      },
    }),
  },
];

/** El artículo en un idioma, con la categoría, la firma y el botón ya localizados. */
export function localizePost(entry: BlogEntry, lang: Lang): BlogPost {
  const t = entry.text[lang];
  return {
    slug: entry.slug,
    title: t.title,
    description: t.description,
    category: categoryNames[lang][entry.category],
    date: entry.date,
    updated: entry.updated,
    author: { name: founder.name, role: founder.role[lang], href: localizePath(founder.href, lang) },
    draft: entry.draft,
    intro: t.intro,
    summary: t.summary,
    sections: t.sections,
    cta: { label: t.cta, href: localizePath(entry.cta, lang) },
    video: entry.video && { ...entry.video, title: t.video ?? t.title },
  };
}

/** Artículos publicados de una categoría (clave en español), del más reciente al más antiguo, ya en `lang`. */
export function postsIn(category: string, lang: Lang, limit = 3): BlogPost[] {
  return posts
    .filter((post) => post.category === category && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((post) => localizePost(post, lang));
}

/** Otros artículos para «Más guías»: primero los de la misma categoría, luego los más recientes. */
export function relatedPosts(post: BlogEntry, limit = 2): BlogEntry[] {
  return posts
    .filter((item) => item.slug !== post.slug && !item.draft)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category) || b.date.localeCompare(a.date))
    .slice(0, limit);
}

/** Parte un texto en trozos de texto y enlaces escritos como [texto](/ruta/). */
export function splitLinks(text: string): Array<string | { text: string; href: string }> {
  return text
    .split(/(\[[^\]]+\]\([^)]+\))/)
    .filter(Boolean)
    .map((part) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      return link ? { text: link[1], href: link[2] } : part;
    });
}

export function findPost(slug: string): BlogEntry | undefined {
  return posts.find((post) => post.slug === slug);
}
