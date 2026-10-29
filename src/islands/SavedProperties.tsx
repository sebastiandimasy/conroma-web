import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type { Property } from '../data/properties';
import { findTown } from '../data/towns';
import { hydrateStore, savedRefs } from '../lib/store';
import { PropertyCard } from './PropertyCard';

interface SavedPropertiesProps {
  properties: Property[];
  listingUrl: string;
}

// Lista de pisos guardados. Lee el store (localStorage), así que va con client:load:
// sin esto los favoritos eran un callejón sin salida — se guardaban y no había dónde verlos.
export default function SavedProperties({ properties, listingUrl }: SavedPropertiesProps) {
  const refs = useStore(savedRefs);

  useEffect(() => {
    hydrateStore();
  }, []);

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
          Ver pisos en venta
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
