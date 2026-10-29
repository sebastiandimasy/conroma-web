import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { hydrateStore, savedRefs } from '../lib/store';
import { Icon } from './Icon';

interface SavedLinkProps {
  className?: string;
  label?: boolean;
}

// Acceso a los pisos guardados, con contador. Sin esto el corazón de las fichas
// no llevaba a ningún sitio. Se monta con client:idle: no es crítico para pintar.
export default function SavedLink({ className, label = false }: SavedLinkProps) {
  const refs = useStore(savedRefs);

  useEffect(() => {
    hydrateStore();
  }, []);

  const count = refs.length;
  const text = count === 0 ? 'Pisos guardados' : `Pisos guardados (${count})`;

  return (
    <a className={className} href="/es/guardados/" aria-label={text}>
      <Icon name="heart" className="saved-link__icon" filled={count > 0} />
      {label && <span>Guardados</span>}
      {count > 0 && (
        <span className="saved-link__count" aria-hidden="true">
          {count}
        </span>
      )}
    </a>
  );
}
