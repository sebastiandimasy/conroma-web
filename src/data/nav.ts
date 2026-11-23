import { strings } from '../i18n';

export interface NavLink {
  label: string;
  /** Ruta en español; quien la pinta la lleva al idioma de la página con localizePath. */
  href: string;
}

// "Inmuebles" entra la primera: el visitante que llega a comprar quiere ver la
// cartera, no una página de servicio. Antes solo se llegaba con un clic extra.
export const mainNav = strings<NavLink[]>({
  es: [
    { label: 'Inmuebles', href: '/es/venta/' },
    { label: 'Comprar', href: '/es/comprar/' },
    { label: 'Vender', href: '/es/vender/' },
    { label: 'Alquilar', href: '/es/alquilar/' },
    { label: 'Empresa', href: '/es/empresa/' },
    { label: 'Equipo', href: '/es/equipo/' },
    { label: 'Blog', href: '/es/blog/' },
  ],
  en: [
    { label: 'Properties', href: '/es/venta/' },
    { label: 'Buy', href: '/es/comprar/' },
    { label: 'Sell', href: '/es/vender/' },
    { label: 'Rent', href: '/es/alquilar/' },
    { label: 'About us', href: '/es/empresa/' },
    { label: 'Team', href: '/es/equipo/' },
    { label: 'Blog', href: '/es/blog/' },
  ],
  ca: [
    { label: 'Immobles', href: '/es/venta/' },
    { label: 'Comprar', href: '/es/comprar/' },
    { label: 'Vendre', href: '/es/vender/' },
    { label: 'Llogar', href: '/es/alquilar/' },
    { label: 'Empresa', href: '/es/empresa/' },
    { label: 'Equip', href: '/es/equipo/' },
    { label: 'Blog', href: '/es/blog/' },
  ],
});

// Dock móvil: las cinco cosas que alguien viene a hacer. Con siete entradas a 390 px las
// etiquetas se tocaban y los objetivos bajaban de 44 px. "Empresa" y "Equipo" siguen en la
// cabecera y en el pie.
export const dockNav = strings<(NavLink & { icon: 'home' | 'search' | 'tag' | 'key' | 'phone' })[]>({
  es: [
    { label: 'Inicio', href: '/es/', icon: 'home' },
    { label: 'Inmuebles', href: '/es/venta/', icon: 'search' },
    { label: 'Vender', href: '/es/vender/', icon: 'tag' },
    { label: 'Alquilar', href: '/es/alquilar/', icon: 'key' },
    { label: 'Contacto', href: '/es/contacto/', icon: 'phone' },
  ],
  en: [
    { label: 'Home', href: '/es/', icon: 'home' },
    { label: 'Properties', href: '/es/venta/', icon: 'search' },
    { label: 'Sell', href: '/es/vender/', icon: 'tag' },
    { label: 'Rent', href: '/es/alquilar/', icon: 'key' },
    { label: 'Contact', href: '/es/contacto/', icon: 'phone' },
  ],
  ca: [
    { label: 'Inici', href: '/es/', icon: 'home' },
    { label: 'Immobles', href: '/es/venta/', icon: 'search' },
    { label: 'Vendre', href: '/es/vender/', icon: 'tag' },
    { label: 'Llogar', href: '/es/alquilar/', icon: 'key' },
    { label: 'Contacte', href: '/es/contacto/', icon: 'phone' },
  ],
});
