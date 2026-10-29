import { Link } from '@heroui/react';
import { Icon } from './Icon';

interface HeroCtaProps {
  href: string;
  label: string;
}

// CTA del héroe sobre el Link de HeroUI (react-aria): se usa Link y NO Button
// porque esto navega a otra página — así se conserva el <a href> real en el HTML
// servido (SEO, clic central, abrir en pestaña nueva) y funciona sin JS.
// El aspecto lo sigue dando .hero-cta del sistema de diseño, intacto.
export default function HeroCta({ href, label }: HeroCtaProps) {
  return (
    <Link className="hero-cta" href={href}>
      <span>{label}</span>
      <span className="hero-cta__icon">
        <Icon name="arrow" className="hero-cta__arrow" />
      </span>
    </Link>
  );
}
