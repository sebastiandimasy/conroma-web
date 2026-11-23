import { strings } from '../i18n';

export interface TeamMember {
  name: string;
  role: string;
  bio: string[];
  /** Foto de presentación (public/img/equipo/<photo>). */
  photo: string;
  /** Foto "en acción" trabajando, opcional. */
  actionPhoto?: string;
}

export const team = strings<TeamMember[]>({
  es: [
    {
      name: 'Boris Conde Jr.',
      role: 'CEO y fundador',
      bio: [
        'Empezó a los 18 años en la inmobiliaria de su padre y tres años después montó Conroma con una visión más moderna y tecnológica del sector.',
        'En estos siete años ha tocado el negocio desde todos los lados —compraventa, inversión, flipping, alquiler y reforma—. De aquí, resolutivo y cercano: su trabajo es que tú tomes cada decisión con tranquilidad.',
      ],
      photo: '/img/equipo/boris.jpg',
      actionPhoto: '/img/equipo/boris-trabajando.jpg',
    },
    {
      name: 'Herman Orrego',
      role: 'Asesor inmobiliario y responsable comercial',
      bio: [
        'Con 8 años de experiencia en el sector inmobiliario y una amplia trayectoria comercial —hostelería, máquinas recreativas, exportación—, Herman sabe tratar con las personas, negociar y encontrar oportunidades donde otros no las ven.',
        'Es parte de Conroma desde el primer día y hoy lidera el área comercial. Cercano, honesto y siempre con una sonrisa: para él, los buenos resultados empiezan por escuchar, generar confianza y tratar a cada cliente como se merece.',
      ],
      photo: '/img/equipo/herman.jpg',
      actionPhoto: '/img/equipo/herman-trabajando.jpg',
    },
    {
      name: 'Katherine Vargas',
      role: 'Administración y atención al cliente',
      bio: [
        'Katherine lleva dos años con nosotros y es de esas personas que te reciben siempre con una sonrisa. Empática y cercana, le encanta escuchar a la gente.',
        'Está al otro lado del teléfono y en recepción, atendiendo a cada cliente con las mismas ganas. Si algo la define, es que nunca te dirá que no sin antes intentarlo: siempre busca la manera de ayudar y de hacerlo un poco mejor cada día.',
      ],
      photo: '/img/equipo/kathe.jpg',
      actionPhoto: '/img/equipo/kathe-trabajando.jpg',
    },
  ],
  en: [
    {
      name: 'Boris Conde Jr.',
      role: 'CEO and founder',
      bio: [
        "He started at 18 in his father’s estate agency and three years later set up Conroma with a more modern, tech-minded view of the business.",
        "In these seven years he’s worked every side of the business: sales, investment, flipping, rentals and renovation. A local, practical and approachable, he sees his job as helping you take every decision calmly.",
      ],
      photo: '/img/equipo/boris.jpg',
      actionPhoto: '/img/equipo/boris-trabajando.jpg',
    },
    {
      name: 'Herman Orrego',
      role: 'Property adviser and head of sales',
      bio: [
        "With 8 years in property and a long sales background (hospitality, arcade machines, exports), Herman knows how to deal with people, negotiate and spot opportunities where others don’t.",
        "He’s been part of Conroma since day one and now runs the sales side. Friendly, honest and always smiling, he believes good results start with listening, building trust and treating every client the way they deserve.",
      ],
      photo: '/img/equipo/herman.jpg',
      actionPhoto: '/img/equipo/herman-trabajando.jpg',
    },
    {
      name: 'Katherine Vargas',
      role: 'Admin and customer service',
      bio: [
        "Katherine has been with us for two years and she’s one of those people who always greet you with a smile. Warm and empathetic, she loves listening to people.",
        "She’s the voice on the phone and the face at reception, giving every client the same care. If one thing sums her up, it’s that she’ll never say no without trying first. She always looks for a way to help, and to do it a little better every day.",
      ],
      photo: '/img/equipo/kathe.jpg',
      actionPhoto: '/img/equipo/kathe-trabajando.jpg',
    },
  ],
  ca: [
    {
      name: 'Boris Conde Jr.',
      role: 'CEO i fundador',
      bio: [
        'Va començar als 18 anys a la immobiliària del seu pare i tres anys després va muntar Conroma amb una visió més moderna i tecnològica del sector.',
        "En aquests set anys ha tocat el negoci per tots els costats (compravenda, inversió, flipping, lloguer i reforma). D’aquí, resolutiu i proper: la seva feina és que prenguis cada decisió amb tranquil·litat.",
      ],
      photo: '/img/equipo/boris.jpg',
      actionPhoto: '/img/equipo/boris-trabajando.jpg',
    },
    {
      name: 'Herman Orrego',
      role: 'Assessor immobiliari i responsable comercial',
      bio: [
        "Amb 8 anys d’experiència al sector immobiliari i una llarga trajectòria comercial (hostaleria, màquines recreatives, exportació), en Herman sap tractar amb la gent, negociar i trobar oportunitats on els altres no les veuen.",
        "És part de Conroma des del primer dia i avui lidera l’àrea comercial. Proper, honest i sempre amb un somriure: per a ell, els bons resultats comencen per escoltar, generar confiança i tractar cada client com es mereix.",
      ],
      photo: '/img/equipo/herman.jpg',
      actionPhoto: '/img/equipo/herman-trabajando.jpg',
    },
    {
      name: 'Katherine Vargas',
      role: 'Administració i atenció al client',
      bio: [
        "La Katherine fa dos anys que és amb nosaltres i és d’aquelles persones que sempre et reben amb un somriure. Empàtica i propera, li encanta escoltar la gent.",
        "És a l’altra banda del telèfon i a recepció, i atén cada client amb les mateixes ganes. Si alguna cosa la defineix és que mai et dirà que no sense haver-ho intentat abans: sempre busca la manera d’ajudar i de fer-ho una mica millor cada dia.",
      ],
      photo: '/img/equipo/kathe.jpg',
      actionPhoto: '/img/equipo/kathe-trabajando.jpg',
    },
  ],
});
