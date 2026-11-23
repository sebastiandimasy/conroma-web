import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { hydrateStore, savedRefs } from '../lib/store';
import { Icon } from './Icon';
import { localizePath, strings, type Lang } from '../i18n';

interface SavedLinkProps {
  className?: string;
  label?: boolean;
  lang: Lang;
}

const texts = strings({
  es: { saved: 'Pisos guardados', short: 'Guardados' },
  en: { saved: 'Saved homes', short: 'Saved' },
  ca: { saved: 'Pisos desats', short: 'Desats' },
});

// Acceso a los pisos guardados, con contador. Sin esto el corazón de las fichas
// no llevaba a ningún sitio. Se monta con client:idle: no es crítico para pintar.
export default function SavedLink({ className, label = false, lang }: SavedLinkProps) {
  const t = texts[lang];
  const refs = useStore(savedRefs);

  useEffect(() => {
    hydrateStore();
  }, []);

  const count = refs.length;
  const text = count === 0 ? t.saved : `${t.saved} (${count})`;

  return (
    <a className={className} href={localizePath('/es/guardados/', lang)} aria-label={text}>
      <Icon name="heart" className="saved-link__icon" filled={count > 0} />
      {label && <span>{t.short}</span>}
      {count > 0 && (
        <span className="saved-link__count" aria-hidden="true">
          {count}
        </span>
      )}
    </a>
  );
}
