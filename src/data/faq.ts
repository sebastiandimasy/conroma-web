import { strings, type Lang } from '../i18n';

export interface FaqItem {
  question: string;
  answer: string;
}

export const homeFaq = strings<FaqItem[]>({
  es: [
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
    {
      question: '¿Qué zonas cubre Conroma Asesores?',
      answer:
        'Trabajamos en el Alt Maresme y el sur de la Costa Brava: Malgrat de Mar (donde está la oficina), Santa Susanna, Pineda de Mar, Calella, Palafolls, Blanes, Lloret de Mar y Tordera, además de pueblos de La Selva como Maçanet de la Selva.',
    },
    {
      question: '¿Dónde está Conroma Asesores?',
      answer:
        'En Malgrat de Mar (Alt Maresme, provincia de Barcelona), en la Avenida Mediterránea. Nos tienes en la oficina de lunes a viernes, y por teléfono y WhatsApp en el +34 626 378 687.',
    },
    {
      question: '¿Conroma hace reformas?',
      answer:
        'Sí. Con Conroma en Obras reformamos la vivienda antes de venderla o de que entres a vivir, de la cocina al último detalle.',
    },
    {
      question: '¿Conroma gestiona patrimonio inmobiliario?',
      answer:
        'Sí. Administramos inmuebles y ayudamos a sacarles rentabilidad, además de la compraventa y el alquiler de viviendas.',
    },
  ],
  en: [
    {
      question: 'What’s my home in Malgrat de Mar worth?',
      answer:
        'It depends on the area, the size, the floor and the condition. We come round to see it and give you a realistic price based on the latest homes sold in your street. The valuation is free and doesn’t commit you to anything.',
    },
    {
      question: 'How much does it cost to sell a home through an estate agent?',
      answer:
        'We charge a fee based on the sale price, agreed before we start and with no small print. It covers the photos, the listing, the viewings, the negotiation and going with you all the way to signing at the notary.',
    },
    {
      question: 'How long does it take to sell a home in the Maresme?',
      answer:
        'A well-priced home in Malgrat de Mar, Palafolls or Santa Susanna usually sells within a few weeks. What drags a sale out most is going on the market above the going rate, which is why we always start with an honest valuation.',
    },
    {
      question: 'What paperwork do I need to sell my house?',
      answer:
        'The title deeds, the latest IBI (council tax) receipt, the energy certificate and the cédula de habitabilidad (certificate of habitability). If you’re missing any of them, we sort it out so it doesn’t hold up the sale.',
    },
    {
      question: 'I’m looking for a home in Malgrat, Blanes or Lloret de Mar. How do I go about it?',
      answer:
        'Tell us the area, your budget and when you need it. We’ll show you what we have for sale and let you know as soon as something suitable comes in, including homes that aren’t on the portals yet.',
    },
    {
      question: 'I live abroad. Can you handle everything?',
      answer:
        'Yes. We speak Catalan, Spanish, English and French, and we take care of viewings, paperwork and the notary so you don’t have to fly over for every step.',
    },
    {
      question: 'I have an empty flat. Can you find me a tenant?',
      answer:
        'We find a tenant, show the flat, check they can afford it and draw up the contract. You decide who you rent it to.',
    },
    {
      question: 'Does a valuation commit me to anything?',
      answer: 'No. The valuation is free and doesn’t tie you to selling with us.',
    },
    {
      question: 'Which areas does Conroma Asesores cover?',
      answer:
        'We work across the Alt Maresme and the southern Costa Brava: Malgrat de Mar (where our office is), Santa Susanna, Pineda de Mar, Calella, Palafolls, Blanes, Lloret de Mar and Tordera, plus villages in La Selva such as Maçanet de la Selva.',
    },
    {
      question: 'Where is Conroma Asesores?',
      answer:
        'In Malgrat de Mar (Alt Maresme, province of Barcelona), on Avenida Mediterránea. You’ll find us at the office Monday to Friday, and on the phone and WhatsApp at +34 626 378 687.',
    },
    {
      question: 'Does Conroma do renovations?',
      answer:
        'Yes. With Conroma en Obras we renovate the home before you sell it or before you move in, from the kitchen to the last detail.',
    },
    {
      question: 'Does Conroma manage property portfolios?',
      answer:
        'Yes. We manage properties and help you get a return from them, as well as buying, selling and renting homes.',
    },
  ],
  ca: [
    {
      question: 'Quant val el meu pis a Malgrat de Mar?',
      answer:
        'Depèn de la zona, els metres, la planta i l’estat. Venim a veure’l i et donem un preu realista amb els últims pisos venuts al teu carrer. La valoració és gratis i no et compromet a res.',
    },
    {
      question: 'Quant costa vendre un pis amb immobiliària?',
      answer:
        'Treballem amb honoraris sobre el preu de venda, que pactem abans de començar i sense lletra petita. Hi entren les fotos, la publicació, les visites, la negociació i l’acompanyament fins a la signatura a la notaria.',
    },
    {
      question: 'Quant es triga a vendre un pis al Maresme?',
      answer:
        'Un pis ben valorat a Malgrat de Mar, Palafolls o Santa Susanna se sol vendre en unes setmanes. El que més allarga una venda és sortir amb un preu per sobre de mercat; per això sempre comencem per una valoració honesta.',
    },
    {
      question: 'Quins papers necessito per vendre la meva casa?',
      answer:
        'L’escriptura, l’últim rebut de l’IBI, el certificat energètic i la cèdula d’habitabilitat. Si te’n falta algun, el tramitem nosaltres perquè no aturi la venda.',
    },
    {
      question: 'Busco pis a Malgrat, Blanes o Lloret de Mar, com ho faig?',
      answer:
        'Digues-nos zona, pressupost i per quan el vols. T’ensenyem el que tenim en venda i t’avisem tan bon punt entra alguna cosa que encaixi, també el que encara no és als portals.',
    },
    {
      question: 'Visc a l’estranger, us podeu encarregar de tot?',
      answer:
        'Sí. T’atenem en català, castellà, anglès i francès, i ens ocupem de les visites, els papers i la notaria perquè no hagis de venir a cada pas.',
    },
    {
      question: 'Tinc un pis buit, em busqueu llogater?',
      answer:
        'Busquem llogater, ensenyem el pis, revisem la solvència i preparem el contracte. Tu decideixes a qui el llogues.',
    },
    {
      question: 'Valorar el meu pis em compromet a res?',
      answer: 'No. La valoració és gratis i no t’obliga a vendre amb nosaltres.',
    },
    {
      question: 'Quines zones cobreix Conroma Asesores?',
      answer:
        'Treballem a l’Alt Maresme i al sud de la Costa Brava: Malgrat de Mar (on tenim l’oficina), Santa Susanna, Pineda de Mar, Calella, Palafolls, Blanes, Lloret de Mar i Tordera, a més de pobles de La Selva com Maçanet de la Selva.',
    },
    {
      question: 'On és Conroma Asesores?',
      answer:
        'A Malgrat de Mar (Alt Maresme, província de Barcelona), a l’Avinguda Mediterránea. Ens trobes a l’oficina de dilluns a divendres, i per telèfon i WhatsApp al +34 626 378 687.',
    },
    {
      question: 'Conroma fa reformes?',
      answer:
        'Sí. Amb Conroma en Obras reformem l’habitatge abans de vendre’l o abans que hi entris a viure, de la cuina fins a l’últim detall.',
    },
    {
      question: 'Conroma gestiona patrimoni immobiliari?',
      answer:
        'Sí. Administrem immobles i t’ajudem a treure’n rendibilitat, a més de la compravenda i el lloguer d’habitatges.',
    },
  ],
});

export const guarantees = strings<FaqItem[]>({
  es: [
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
  ],
  en: [
    {
      question: 'One person from start to finish',
      answer: 'No starting with one person and ending up with another. Whoever looks after you on day one stays with you until you sign.',
    },
    {
      question: 'We speak four languages',
      answer: 'Catalan, Spanish, English and French. Whichever suits you best.',
    },
    {
      question: 'If a home isn’t right for you, we say so',
      answer: 'Including what we don’t like about it. Better to know before you sign than after.',
    },
  ],
  ca: [
    {
      question: 'Una mateixa persona tot el procés',
      answer: 'Res de començar amb algú i acabar amb un altre. Qui t’atén el primer dia t’acompanya fins a la signatura.',
    },
    {
      question: 'T’atenem en quatre idiomes',
      answer: 'Català, castellà, anglès i francès. Parlem com et vagi millor.',
    },
    {
      question: 'Si un pis no et convé, t’ho diem',
      answer: 'I també el que no ens agrada del pis. Més val saber-ho abans de signar que després.',
    },
  ],
});

/** FAQ de cada pueblo, en el idioma de la página. */
export function townFaq(town: string, lang: Lang): FaqItem[] {
  return strings<FaqItem[]>({
    es: [
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
    ],
    en: [
      {
        question: `How do I sell my home in ${town}?`,
        answer: `Give us the address, we come round to see it and tell you what it’s worth. If the price works for you, we take care of photos, viewings, negotiation and paperwork.`,
      },
      {
        question: `How much does a valuation in ${town} cost?`,
        answer: 'Nothing. The valuation is free and with no obligation.',
      },
      {
        question: `Do you have an office in ${town}?`,
        answer: `Our office is in Malgrat de Mar, at Av. Mediterránea 16. We come to ${town} to see your home and for the viewings.`,
      },
    ],
    ca: [
      {
        question: `Com venc el meu pis a ${town}?`,
        answer: `Ens dius l’adreça, venim a veure’l i et diem quant val. Si et quadra, ens encarreguem de fotos, visites, negociació i papers.`,
      },
      {
        question: `Quant costa valorar un pis a ${town}?`,
        answer: 'Res. La valoració és gratis i sense compromís.',
      },
      {
        question: `Teniu oficina a ${town}?`,
        answer: `L’oficina és a Malgrat de Mar, a l’Av. Mediterránea 16. Ens desplacem a ${town} per veure el teu pis i per a les visites.`,
      },
    ],
  })[lang];
}
