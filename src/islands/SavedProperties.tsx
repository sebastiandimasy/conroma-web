import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import type { Property } from '../data/properties';
import { findTown } from '../data/towns';
import { hydrateStore, savedRefs } from '../lib/store';
import { PropertyCard } from './PropertyCard';
import { FlipLabel } from './FlipLabel';
import { strings, type Lang } from '../i18n';

interface SavedPropertiesProps {
  properties: Property[];
  listingUrl: string;
  lang: Lang;
}

const texts = strings({
  es: {
    loading: 'Cargando tus pisos guardados',
    emptyTitle: 'Todavía no has guardado ninguno.',
    emptyText:
      'Dale al corazón de cualquier piso y se queda aquí, para que puedas compararlos con calma o enseñárselos a quien decida contigo.',
    cta: 'Ver pisos en venta',
    count: (n: number) => (n === 1 ? 'Tienes 1 piso guardado.' : `Tienes ${n} pisos guardados.`),
  },
  en: {
    loading: 'Loading your saved homes',
    emptyTitle: "You haven't saved any yet.",
    emptyText:
      "Tap the heart on any home and it stays here, so you can compare them calmly or show them to whoever's deciding with you.",
    cta: 'See homes for sale',
    count: (n: number) => (n === 1 ? 'You have 1 saved home.' : `You have ${n} saved homes.`),
  },
  ca: {
    loading: 'Carregant els teus pisos desats',
    emptyTitle: "Encara no n'has desat cap.",
    emptyText:
      'Toca el cor de qualsevol pis i es queda aquí, perquè els puguis comparar amb calma o ensenyar-los a qui decideixi amb tu.',
    cta: 'Veure pisos en venda',
    count: (n: number) => (n === 1 ? 'Tens 1 pis desat.' : `Tens ${n} pisos desats.`),
  },
});

// Lista de pisos guardados. Lee el store (localStorage), así que va con client:load:
// sin esto los favoritos eran un callejón sin salida — se guardaban y no había dónde verlos.
export default function SavedProperties({ properties, listingUrl, lang }: SavedPropertiesProps) {
  const t = texts[lang];
  const refs = useStore(savedRefs);
  // Hasta leer el localStorage no se sabe qué hay guardado: esqueleto, no «no has guardado ninguno».
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <ul className="property-grid" aria-busy="true" aria-label={t.loading}>
        {[0, 1].map((key) => (
          <li key={key} className="property-grid__item">
            <div className="skeleton-card" aria-hidden="true">
              <span className="skeleton skeleton-card__media" />
              <span className="skeleton skeleton-line" style={{ width: '45%', height: '1.75rem' }} />
              <span className="skeleton skeleton-line" style={{ width: '70%' }} />
              <span className="skeleton skeleton-line" style={{ width: '55%' }} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  const saved = properties.filter((property) => refs.includes(property.ref));

  if (saved.length === 0) {
    return (
      <div className="saved-empty">
        <h2 className="saved-empty__title">{t.emptyTitle}</h2>
        <p className="saved-empty__text">{t.emptyText}</p>
        <a className="button button--primary button--large" href={listingUrl}>
          <FlipLabel>{t.cta}</FlipLabel>
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="saved-count" aria-live="polite">
        {t.count(saved.length)}
      </p>
      <ul className="property-grid">
        {saved.map((property) => (
          <li key={property.ref} className="property-grid__item">
            <PropertyCard
              property={property}
              townName={findTown(property.town)?.name ?? property.town}
              origin="guardados"
              headingLevel="h2"
              lang={lang}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
