export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: 'Comprar', href: '/es/comprar/' },
  { label: 'Vender', href: '/es/vender/' },
  { label: 'Alquilar', href: '/es/alquilar/' },
  { label: 'Empresa', href: '/es/empresa/' },
  { label: 'Equipo', href: '/es/equipo/' },
  { label: 'Blog', href: '/es/blog/' },
];

export const serviceNav: NavLink[] = [
  { label: 'Comprar vivienda', href: '/es/comprar/' },
  { label: 'Vender vivienda', href: '/es/vender/' },
  { label: 'Alquilar', href: '/es/alquilar/' },
  { label: 'Gestión de patrimonio', href: '/es/gestion-de-patrimonio/' },
  { label: 'Reformas', href: '/es/reformas/' },
  { label: '¿Cuánto vale mi piso?', href: '/es/valoracion/' },
  { label: '¿Puedo comprar un piso?', href: '/es/comprar/puedo-comprar/' },
  { label: 'Simulador de reformas', href: '/es/reformas/simulador/' },
];

export const companyNav: NavLink[] = [
  { label: 'Nuestra empresa', href: '/es/empresa/' },
  { label: 'Nuestro equipo', href: '/es/equipo/' },
  { label: 'Blog', href: '/es/blog/' },
  { label: 'Contacto', href: '/es/contacto/' },
  { label: 'Privacidad y cookies', href: '/es/privacidad/' },
];
