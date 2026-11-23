import type { IconName } from '../lib/icons';
import { strings } from '../i18n';

export interface StepItem {
  title: string;
  text: string;
  icon: IconName;
}

export const processSteps = strings<StepItem[]>({
  es: [
    { title: 'Nos conocemos', text: 'Nos cuentas qué buscas o qué quieres vender. Sin prisa y sin compromiso.', icon: 'user' },
    { title: 'Ponemos números', text: 'Precio realista y gastos explicados antes de dar ningún paso.', icon: 'eye' },
    { title: 'Lo movemos', text: 'Fotos, portales, redes y visitas con gente que de verdad puede comprar o alquilar.', icon: 'camera' },
    { title: 'Cerramos contigo', text: 'Papeles, negociación y notaría. Y seguimos ahí después de la firma.', icon: 'key' },
  ],
  en: [
    { title: 'We get to know you', text: 'Tell us what you’re looking for or what you want to sell. No rush and no obligation.', icon: 'user' },
    { title: 'We run the numbers', text: 'A realistic price and every cost explained before you take a single step.', icon: 'eye' },
    { title: 'We get it moving', text: 'Photos, portals, social media and viewings with people who can genuinely buy or rent.', icon: 'camera' },
    { title: 'We close it with you', text: 'Paperwork, negotiation and the notary. And we’re still around after you sign.', icon: 'key' },
  ],
  ca: [
    { title: 'Ens coneixem', text: 'Ens expliques què busques o què vols vendre. Sense presses i sense compromís.', icon: 'user' },
    { title: 'Fem números', text: 'Preu realista i despeses explicades abans de fer cap pas.', icon: 'eye' },
    { title: 'El movem', text: 'Fotos, portals, xarxes i visites amb gent que de debò pot comprar o llogar.', icon: 'camera' },
    { title: 'Tanquem amb tu', text: 'Papers, negociació i notaria. I després de signar, encara hi som.', icon: 'key' },
  ],
});

export const sellSteps = strings<StepItem[]>({
  es: [
    { title: 'Vemos tu piso', text: 'Pasamos a verlo y te decimos un precio realista.', icon: 'eye' },
    { title: 'Lo enseñamos bien', text: 'Fotos, vídeo, portales y nuestras redes.', icon: 'camera' },
    { title: 'Contigo hasta notaría', text: 'Papeles, visitas y negociación. Una misma persona todo el rato.', icon: 'key' },
  ],
  en: [
    { title: 'We see your home', text: 'We come round to see it and give you a realistic price.', icon: 'eye' },
    { title: 'We show it off properly', text: 'Photos, video, the property portals and our social media.', icon: 'camera' },
    { title: 'With you up to the notary', text: 'Paperwork, viewings and negotiation. The same person the whole way.', icon: 'key' },
  ],
  ca: [
    { title: 'Veiem el teu pis', text: 'Venim a veure’l i et diem un preu realista.', icon: 'eye' },
    { title: 'El mostrem bé', text: 'Fotos, vídeo, portals i les nostres xarxes.', icon: 'camera' },
    { title: 'Amb tu fins a la notaria', text: 'Papers, visites i negociació. La mateixa persona tota l’estona.', icon: 'key' },
  ],
});

export const rentSteps = strings<StepItem[]>({
  es: [
    { title: 'Nos cuentas tu caso', text: 'Si buscas piso o si tienes uno para alquilar. Son dos caminos distintos.', icon: 'user' },
    { title: 'Buscamos lo que te cuadra', text: 'Un piso que te vaya bien, o un buen inquilino para el tuyo.', icon: 'search' },
    { title: 'Contrato claro', text: 'Todo explicado antes de firmar.', icon: 'shield' },
  ],
  en: [
    { title: 'Tell us your situation', text: 'Whether you’re looking for a home or have one to rent out. They’re two different paths.', icon: 'user' },
    { title: 'We find what fits', text: 'A home that suits you, or a good tenant for yours.', icon: 'search' },
    { title: 'A clear contract', text: 'Everything explained before you sign.', icon: 'shield' },
  ],
  ca: [
    { title: 'Ens expliques el teu cas', text: 'Si busques pis o si en tens un per llogar. Són dos camins diferents.', icon: 'user' },
    { title: 'Busquem el que et quadra', text: 'Un pis que et vagi bé, o un bon llogater per al teu.', icon: 'search' },
    { title: 'Contracte clar', text: 'Tot explicat abans de signar.', icon: 'shield' },
  ],
});
