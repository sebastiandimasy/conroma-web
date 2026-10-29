import type { Property } from '../data/properties';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  townName: string;
  origin: string;
}

export default function PropertyGrid({ properties, townName, origin }: PropertyGridProps) {
  return (
    <ul className="property-grid">
      {properties.map((property) => (
        <li key={property.ref} className="property-grid__item">
          <PropertyCard property={property} townName={townName} origin={origin} />
        </li>
      ))}
    </ul>
  );
}
