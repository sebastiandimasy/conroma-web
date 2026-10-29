export interface TeamMember {
  name: string;
  role: string;
  bio: string[];
  /** Foto de presentación (public/img/equipo/<photo>). */
  photo: string;
  /** Foto "en acción" trabajando, opcional. */
  actionPhoto?: string;
}

export const team: TeamMember[] = [
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
];
