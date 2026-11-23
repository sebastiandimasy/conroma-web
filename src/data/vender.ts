import type { ImageMetadata } from 'astro';
import type { FaqItem } from './faq';
import { strings } from '../i18n';
import borisPhoto from '../assets/equipo/boris-conde-jr.jpg';
import deskPhoto from '../assets/equipo/conroma-91.jpg';
import officePhoto from '../assets/equipo/conroma-102.jpg';
import teamPortrait from '../assets/equipo/conroma-82-vertical.jpg';
import reformPhoto from '../assets/reformas/reforma-17.jpg';

export interface StoryStep {
  title: string;
  text: string;
  image: ImageMetadata;
  alt: string;
}

/** Una opción de venta y a quién le encaja, por temas. Las dos son válidas: no se compara
    «bien contra mal», se ayuda a elegir. */
export interface CompareOption {
  title: string;
  groups: { title: string; items: string[] }[];
}

/* Textos de /es/vender/ en los tres idiomas (quien los usa hace `venderFaq[lang]`). Solo datos que ya están en el repo (faq.ts, blog.ts, site.ts):
   ni plazos de venta, ni porcentajes, ni pisos vendidos. */

/** Respuesta corta arriba de la página: la que pueden citar Google y las IA. */
export const venderAnswer = strings({
  es: 'Para vender tu piso con Conroma, primero pasamos a verlo y te decimos cuánto vale, gratis y sin compromiso. Si el precio te encaja, nos encargamos de las fotos, los portales, las visitas y los papeles. La misma persona te acompaña hasta la firma en notaría.',
  en: 'To sell your home with Conroma, we first come round to see it and tell you what it’s worth, free and with no obligation. If the price works for you, we take care of the photos, the property portals, the viewings and the paperwork. The same person stays with you right up to signing at the notary.',
  ca: 'Per vendre el teu pis amb Conroma, primer venim a veure’l i et diem quant val, gratis i sense compromís. Si el preu et quadra, ens encarreguem de les fotos, els portals, les visites i els papers. La mateixa persona t’acompanya fins a la signatura a la notaria.',
});

export const venderSteps = strings<StoryStep[]>({
  es: [
    {
      title: 'Vemos tu piso',
      text: 'Pasamos a verlo y te decimos un precio realista. Es gratis y no te obliga a vender con nosotros.',
      image: borisPhoto,
      alt: 'Boris Conde Jr., fundador de Conroma Asesores',
    },
    {
      title: 'Lo dejamos a punto',
      text: 'Hacemos fotos y vídeo del piso. Si un arreglo pequeño ayudaría a venderlo, te lo decimos, y si quieres lo hacemos nosotros.',
      image: reformPhoto,
      alt: 'Salón y cocina abiertos de un piso reformado por Conroma',
    },
    {
      title: 'Lo enseñamos',
      text: 'Lo publicamos en los portales y en nuestras redes, @conromaasesores en Instagram y TikTok.',
      image: deskPhoto,
      alt: 'Una persona del equipo de Conroma trabajando en el ordenador',
    },
    {
      title: 'Hacemos las visitas',
      text: 'Enseñamos el piso a gente que de verdad puede comprarlo. Atendemos en catalán, castellano, inglés y francés.',
      image: officePhoto,
      alt: 'Dos personas del equipo de Conroma en la oficina',
    },
    {
      title: 'Arras y notaría',
      text: 'Negociamos el precio, preparamos las arras y vamos contigo a notaría. Y seguimos ahí después de la firma.',
      image: teamPortrait,
      alt: 'Tres personas del equipo de Conroma revisando una operación en la oficina',
    },
  ],
  en: [
    {
      title: 'We see your home',
      text: 'We come round to see it and give you a realistic price. It’s free and doesn’t tie you to selling with us.',
      image: borisPhoto,
      alt: 'Boris Conde Jr., founder of Conroma Asesores',
    },
    {
      title: 'We get it ready',
      text: 'We take photos and video of your home. If a small repair would help it sell, we tell you, and if you like, we do it ourselves.',
      image: reformPhoto,
      alt: 'Open-plan living room and kitchen in a flat renovated by Conroma',
    },
    {
      title: 'We get it seen',
      text: 'We list it on the property portals and on our social media, @conromaasesores on Instagram and TikTok.',
      image: deskPhoto,
      alt: 'A member of the Conroma team working at the computer',
    },
    {
      title: 'We do the viewings',
      text: 'We show your home to people who can genuinely buy it. We speak Catalan, Spanish, English and French.',
      image: officePhoto,
      alt: 'Two members of the Conroma team at the office',
    },
    {
      title: 'Deposit contract and notary',
      text: 'We negotiate the price, draw up the deposit contract (arras) and go with you to the notary. And we’re still around after you sign.',
      image: teamPortrait,
      alt: 'Three members of the Conroma team going over a sale at the office',
    },
  ],
  ca: [
    {
      title: 'Veiem el teu pis',
      text: 'Venim a veure’l i et diem un preu realista. És gratis i no t’obliga a vendre amb nosaltres.',
      image: borisPhoto,
      alt: 'Boris Conde Jr., fundador de Conroma Asesores',
    },
    {
      title: 'El deixem a punt',
      text: 'Fem fotos i vídeo del pis. Si un petit arranjament ajudaria a vendre’l, t’ho diem, i si vols el fem nosaltres.',
      image: reformPhoto,
      alt: 'Saló i cuina oberts d’un pis reformat per Conroma',
    },
    {
      title: 'El mostrem',
      text: 'El publiquem als portals i a les nostres xarxes, @conromaasesores a Instagram i TikTok.',
      image: deskPhoto,
      alt: 'Una persona de l’equip de Conroma treballant a l’ordinador',
    },
    {
      title: 'Fem les visites',
      text: 'Ensenyem el pis a gent que de debò el pot comprar. T’atenem en català, castellà, anglès i francès.',
      image: officePhoto,
      alt: 'Dues persones de l’equip de Conroma a l’oficina',
    },
    {
      title: 'Arres i notaria',
      text: 'Negociem el preu, preparem les arres i venim amb tu a la notaria. I després de signar, encara hi som.',
      image: teamPortrait,
      alt: 'Tres persones de l’equip de Conroma revisant una operació a l’oficina',
    },
  ],
});

// Cada punto sale de lo ya publicado en esta página (pasos y respuesta), nada nuevo.
export const venderCompare = strings<[CompareOption, CompareOption]>({
  es: [
    {
      title: 'Lo que tienes con Conroma',
      groups: [
        {
          title: 'Tiempo',
          items: [
            'Las llamadas y las visitas pasan por nosotros.',
            'Atendemos en catalán, castellano, inglés y francés.',
          ],
        },
        {
          title: 'Papeles',
          items: ['Te decimos qué hace falta y lo preparamos contigo.', 'Preparamos las arras por ti.'],
        },
        {
          title: 'Precio',
          items: ['Valoración en persona, gratis y sin compromiso.', 'Sales con un precio realista desde el primer día.'],
        },
        {
          title: 'Seguridad',
          items: [
            'Enseñamos el piso a gente que de verdad puede comprarlo.',
            'Vamos contigo a notaría y seguimos ahí después de la firma.',
          ],
        },
        {
          title: 'Difusión',
          items: ['Fotos y vídeo de tu piso.', 'Lo publicamos en los portales y en @conromaasesores (Instagram y TikTok).'],
        },
      ],
    },
    {
      title: 'Venderlo por tu cuenta te encaja si…',
      groups: [
        { title: 'Tiempo', items: ['Tienes tiempo para atender llamadas y enseñar el piso.'] },
        { title: 'Papeles', items: ['Ya tienes la cédula, el certificado energético y la nota simple.'] },
        { title: 'Precio', items: ['Conoces bien los precios de tu zona.'] },
        { title: 'Seguridad', items: ['Te manejas bien con las visitas y con el contrato de arras.'] },
      ],
    },
  ],
  en: [
    {
      title: 'What you get with Conroma',
      groups: [
        {
          title: 'Time',
          items: ['Calls and viewings go through us.', 'We speak Catalan, Spanish, English and French.'],
        },
        {
          title: 'Paperwork',
          items: ['We tell you what’s needed and get it ready with you.', 'We draw up the deposit contract (arras) for you.'],
        },
        {
          title: 'Price',
          items: ['An in-person valuation, free and with no obligation.', 'You go on the market at a realistic price from day one.'],
        },
        {
          title: 'Peace of mind',
          items: [
            'We show your home to people who can genuinely buy it.',
            'We go with you to the notary and stay around after signing.',
          ],
        },
        {
          title: 'Getting it seen',
          items: ['Photos and video of your home.', 'Listed on the property portals and @conromaasesores (Instagram and TikTok).'],
        },
      ],
    },
    {
      title: 'Selling it yourself works for you if…',
      groups: [
        { title: 'Time', items: ['You have time to take calls and show the property.'] },
        { title: 'Paperwork', items: ['You have the cédula, energy certificate and land registry extract ready.'] },
        { title: 'Price', items: ['You know the prices in your area well.'] },
        { title: 'Peace of mind', items: ['You’re comfortable handling viewings and the deposit contract.'] },
      ],
    },
  ],
  ca: [
    {
      title: 'El que tens amb Conroma',
      groups: [
        {
          title: 'Temps',
          items: ['Les trucades i les visites passen per nosaltres.', 'T’atenem en català, castellà, anglès i francès.'],
        },
        {
          title: 'Papers',
          items: ['Et diem què cal i ho preparem amb tu.', 'Et preparem les arres.'],
        },
        {
          title: 'Preu',
          items: ['Valoració en persona, gratuïta i sense compromís.', 'Surts amb un preu realista des del primer dia.'],
        },
        {
          title: 'Seguretat',
          items: [
            'Ensenyem el pis a gent que de debò el pot comprar.',
            'Venim amb tu a la notaria i hi som també després de signar.',
          ],
        },
        {
          title: 'Difusió',
          items: ['Fotos i vídeo del teu pis.', 'El publiquem als portals i a @conromaasesores (Instagram i TikTok).'],
        },
      ],
    },
    {
      title: 'Vendre’l pel teu compte et va bé si…',
      groups: [
        { title: 'Temps', items: ['Tens temps per atendre trucades i ensenyar el pis.'] },
        { title: 'Papers', items: ['Ja tens la cèdula, el certificat energètic i la nota simple.'] },
        { title: 'Preu', items: ['Coneixes bé els preus de la teva zona.'] },
        { title: 'Seguretat', items: ['Saps portar les visites i el contracte d’arres.'] },
      ],
    },
  ],
});

export const venderFaq = strings<FaqItem[]>({
  es: [
    {
      question: '¿Cuánto cobráis de honorarios?',
      answer:
        'Un porcentaje sobre el precio de venta que pactamos contigo antes de empezar, sin letra pequeña. Dentro van las fotos, la publicación, las visitas, la negociación y el acompañamiento hasta notaría. La valoración es gratis.',
    },
    {
      question: '¿Cuánto se tarda en vender un piso?',
      answer:
        'Depende sobre todo del precio y de la zona. Un piso que sale a un precio realista se mueve antes que uno que sale caro, por eso empezamos por la valoración. Te decimos qué esperar cuando lo hayamos visto.',
    },
    {
      question: '¿Tengo que firmar en exclusiva?',
      answer:
        'Te lo explicamos en la valoración, con las condiciones por escrito, antes de que firmes nada. Si algo no te encaja, nos lo dices.',
    },
    {
      question: '¿Necesito la cédula y el certificado energético?',
      answer:
        'Sí. El certificado de eficiencia energética hace falta ya para anunciar el piso, y la cédula de habitabilidad tiene que estar en vigor para venderlo. Si te falta alguno, te decimos cómo pedirlo.',
    },
    {
      question: '¿Valorar mi piso me compromete a algo?',
      answer: 'No. La valoración es gratis y no te obliga a vender con nosotros.',
    },
    {
      question: 'Es un piso heredado, ¿qué hago?',
      answer:
        'Antes de venderlo hay que aceptar la herencia ante notario y poner el piso a nombre de los herederos. Si estás en ese punto, lo vemos contigo con calma.',
    },
  ],
  en: [
    {
      question: 'What do you charge?',
      answer:
        'A percentage of the sale price, agreed with you before we start, with no small print. It covers the photos, the listing, the viewings, the negotiation and going with you to the notary. The valuation is free.',
    },
    {
      question: 'How long does it take to sell a home?',
      answer:
        'Mostly it depends on the price and the area. A home that goes on the market at a realistic price sells sooner than an overpriced one, which is why we start with the valuation. Once we’ve seen it, we’ll tell you what to expect.',
    },
    {
      question: 'Do I have to sign an exclusive agreement?',
      answer:
        'We explain it at the valuation, with the terms in writing, before you sign anything. If something doesn’t work for you, just tell us.',
    },
    {
      question: 'Do I need the cédula and the energy certificate?',
      answer:
        'Yes. You need the energy certificate (EPC) just to advertise the home, and the cédula de habitabilidad, the certificate that says it’s fit to live in, has to be valid to sell it. If you’re missing either, we’ll tell you how to get it.',
    },
    {
      question: 'Does a valuation commit me to anything?',
      answer: 'No. The valuation is free and doesn’t tie you to selling with us.',
    },
    {
      question: 'I’ve inherited a property. What do I do?',
      answer:
        'Before selling, the inheritance has to be accepted before a notary and the property put in the heirs’ names. If that’s where you are, we’ll go through it with you, no rush.',
    },
  ],
  ca: [
    {
      question: 'Quant cobreu d’honoraris?',
      answer:
        'Un percentatge sobre el preu de venda que pactem amb tu abans de començar, sense lletra petita. Hi entren les fotos, la publicació, les visites, la negociació i l’acompanyament fins a la notaria. La valoració és gratis.',
    },
    {
      question: 'Quant es triga a vendre un pis?',
      answer:
        'Depèn sobretot del preu i de la zona. Un pis que surt a un preu realista es mou abans que un que surt car, per això comencem per la valoració. Quan l’haguem vist, et direm què pots esperar.',
    },
    {
      question: 'He de signar en exclusiva?',
      answer:
        'T’ho expliquem a la valoració, amb les condicions per escrit, abans que signis res. Si alguna cosa no et quadra, ens ho dius.',
    },
    {
      question: 'Necessito la cèdula i el certificat energètic?',
      answer:
        'Sí. El certificat d’eficiència energètica ja cal per anunciar el pis, i la cèdula d’habitabilitat ha d’estar vigent per vendre’l. Si te’n falta algun dels dos, et diem com demanar-lo.',
    },
    {
      question: 'Valorar el meu pis em compromet a res?',
      answer: 'No. La valoració és gratis i no t’obliga a vendre amb nosaltres.',
    },
    {
      question: 'És un pis heretat, què faig?',
      answer:
        'Abans de vendre’l cal acceptar l’herència davant notari i posar el pis a nom dels hereus. Si estàs en aquest punt, ho mirem amb tu amb calma.',
    },
  ],
});
