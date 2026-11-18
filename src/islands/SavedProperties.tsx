import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import type { Property } from '../data/properties';
import { findTown } from '../data/towns';
import { hydrateStore, savedRefs } from '../lib/store';
import { PropertyCard } from './PropertyCard';
import { FlipLabel } from './FlipLabel';

interface SavedPropertiesProps {
  properties: Property[];
  listingUrl: string;
}

// Lista de pisos guardados. Lee el store (localStorage), así que va con client:load:
// sin esto los favoritos eran un callejón sin salida — se guardaban y no había dónde verlos.
export default function SavedProperties({ properties, listingUrl }: SavedPropertiesProps) {
  const refs = useStore(savedRefs);
  // Hasta leer el localStorage no se sabe qué hay guardado: esqueleto, no «no has guardado ninguno».
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateStore();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <ul className="property-grid" aria-busy="true" aria-label="Cargando tus pisos guardados">
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
        <h2 className="saved-empty__title">Todavía no has guardado ninguno.</h2>
        <p className="saved-empty__text">
          Dale al corazón de cualquier piso y se queda aquí, para que puedas compararlos con calma o enseñárselos a
          quien decida contigo.
        </p>
        <a className="button button--primary button--large" href={listingUrl}>
          <FlipLabel>Ver pisos en venta</FlipLabel>
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="saved-count" aria-live="polite">
        {saved.length === 1 ? 'Tienes 1 piso guardado.' : `Tienes ${saved.length} pisos guardados.`}
      </p>
      <ul className="property-grid">
        {saved.map((property) => (
          <li key={property.ref} className="property-grid__item">
            <PropertyCard
              property={property}
              townName={findTown(property.town)?.name ?? property.town}
              origin="guardados"
              headingLevel="h2"
            />
          </li>
        ))}
      </ul>
    </>
  );
}
