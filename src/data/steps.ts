import type { IconName } from '../lib/icons';

export interface StepItem {
  title: string;
  text: string;
  icon: IconName;
}

export const processSteps: StepItem[] = [
  { title: 'Nos conocemos', text: 'Nos cuentas qué buscas o qué quieres vender. Sin prisa y sin compromiso.', icon: 'user' },
  { title: 'Ponemos números', text: 'Precio realista y gastos explicados antes de dar ningún paso.', icon: 'eye' },
  { title: 'Lo movemos', text: 'Fotos, portales, redes y visitas con gente que de verdad puede comprar o alquilar.', icon: 'camera' },
  { title: 'Cerramos contigo', text: 'Papeles, negociación y notaría. Y seguimos ahí después de la firma.', icon: 'key' },
];

export const sellSteps: StepItem[] = [
  { title: 'Vemos tu piso', text: 'Pasamos a verlo y te decimos un precio realista.', icon: 'eye' },
  { title: 'Lo enseñamos bien', text: 'Fotos, vídeo, portales y nuestras redes.', icon: 'camera' },
  { title: 'Contigo hasta notaría', text: 'Papeles, visitas y negociación. Una misma persona todo el rato.', icon: 'key' },
];

export const buySteps: StepItem[] = [
  { title: 'Nos dices qué buscas', text: 'Zona, presupuesto y lo que no puede faltar. Con eso filtramos por ti.', icon: 'search' },
  { title: 'Lo visitas con nosotros', text: 'Te enseñamos el piso y te decimos también lo que no nos gusta.', icon: 'eye' },
  { title: 'Te acompañamos a firmar', text: 'Arras, hipoteca si la necesitas y notaría. Los papeles los llevamos contigo.', icon: 'key' },
];

export const rentSteps: StepItem[] = [
  { title: 'Nos cuentas tu caso', text: 'Si buscas piso o si tienes uno para alquilar. Son dos caminos distintos.', icon: 'user' },
  { title: 'Buscamos lo que te cuadra', text: 'Un piso que te vaya bien, o un buen inquilino para el tuyo.', icon: 'search' },
  { title: 'Contrato claro', text: 'Todo explicado antes de firmar.', icon: 'shield' },
];
