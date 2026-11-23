import type { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';
import type { Lang } from '../i18n';

interface PropertyGridProps {
  properties: Property[];
  townName: string;
  origin: string;
  lang: Lang;
}

export default function PropertyGrid({ properties, townName, origin, lang }: PropertyGridProps) {
  return (
    <ul className="property-grid">
      {properties.map((property) => (
        <li key={property.ref} className="property-grid__item">
          <PropertyCard property={property} townName={townName} origin={origin} lang={lang} />
        </li>
      ))}
    </ul>
  );
}
