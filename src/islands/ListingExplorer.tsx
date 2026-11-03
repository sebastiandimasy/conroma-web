import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from '@heroui/react';
import type { Property } from '../data/properties';
import {
  applyFilters,
  countActive,
  emptyFilters,
  filtersFromQuery,
  sortProperties,
  type Filters,
  type SortOrder,
} from '../lib/filters';
import { formatPrice } from '../lib/format';
import { whatsappUrl } from '../lib/links';
import { hiddenRefs, hideProperty, hydrateStore, restoreHidden } from '../lib/store';
import { FilterSheet } from './FilterSheet';
import { Icon } from './Icon';
import { PropertyCard } from './PropertyCard';

interface ListingExplorerProps {
  properties: Property[];
  townName: string;
}

export default function ListingExplorer({ properties, townName }: ListingExplorerProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [order, setOrder] = useState<SortOrder>('recientes');
  const [sheetOpen, setSheetOpen] = useState(false);
  const hidden = useStore(hiddenRefs);

  useEffect(() => {
    hydrateStore();
    setFilters(filtersFromQuery(new URLSearchParams(window.location.search)));
  }, []);

  const types = useMemo(() => [...new Set(properties.map((property) => property.type))], [properties]);
  const matching = useMemo(() => applyFilters(properties, filters), [properties, filters]);
  const visible = useMemo(
    () => sortProperties(matching.filter((property) => !hidden.includes(property.ref)), order),
    [matching, hidden, order],
  );
  const active = countActive(filters);
  const hiddenCount = matching.length - visible.length;

  const quick: { label: string; active: boolean; toggle: () => void }[] = [
    {
      label: 'Hasta 250.000 €',
      active: filters.maxPrice === 250000,
      toggle: () => setFilters({ ...filters, maxPrice: filters.maxPrice === 250000 ? null : 250000 }),
    },
    {
      label: '3 hab o más',
      active: filters.minRooms === 3,
      toggle: () => setFilters({ ...filters, minRooms: filters.minRooms === 3 ? null : 3 }),
    },
    { label: 'Terraza', active: filters.terrace, toggle: () => setFilters({ ...filters, terrace: !filters.terrace }) },
    { label: 'Ascensor', active: filters.elevator, toggle: () => setFilters({ ...filters, elevator: !filters.elevator }) },
  ];

  return (
    <div className="listing">
      <div className="chip-row chip-row--scroll listing__filters">
        <button type="button" className="chip chip--active" onClick={() => setSheetOpen(true)}>
          <Icon name="filter" className="button__icon" />
          {`Filtros${active > 0 ? ` · ${active}` : ''}`}
        </button>
        {quick.map((item) => (
          <button key={item.label} type="button" className="chip" aria-pressed={item.active} onClick={item.toggle}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="listing__bar">
        <p className="listing__count" aria-live="polite">
          {`${visible.length} ${visible.length === 1 ? 'inmueble' : 'inmuebles'}`}
          {hiddenCount > 0 && (
            <>
              {' · '}
              <button type="button" className="listing__restore" onClick={restoreHidden}>
                {`Recuperar ${hiddenCount} ${hiddenCount === 1 ? 'descartada' : 'descartadas'}`}
              </button>
            </>
          )}
        </p>
        <label className="listing__sort">
          <span className="visually-hidden">Ordenar</span>
          <select value={order} onChange={(event) => setOrder(event.target.value as SortOrder)}>
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio, de menos a más</option>
            <option value="precio-desc">Precio, de más a menos</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="listing__empty">
          <h2 className="listing__empty-title">Ahora mismo no tenemos ninguna así.</h2>
          <p>Prueba a quitar algún filtro, o dinos qué buscas y te avisamos cuando entre.</p>
          <div className="listing__empty-actions">
            <Button variant="ghost" onPress={() => setFilters(emptyFilters)}>
              Quitar filtros
            </Button>
            <a
              className="button button--ink"
              href={whatsappUrl({ reason: 'general' })}
              data-contact="whatsapp"
              data-origin="listado-vacio"
            >
              Decidnos qué buscas
            </a>
          </div>
        </div>
      ) : (
        <ul className="property-grid">
          {visible.map((property, index) => (
            <li key={property.ref} className="property-grid__item">
              <PropertyCard
                property={property}
                townName={townName}
                origin="listado"
                eager={index === 0}
                headingLevel="h2"
                onHide={hideProperty}
              />
            </li>
          ))}
        </ul>
      )}

      {filters.maxPrice !== null && visible.length > 0 && (
        <p className="visually-hidden">{`Mostrando inmuebles hasta ${formatPrice(filters.maxPrice)}.`}</p>
      )}

      <FilterSheet
        open={sheetOpen}
        filters={filters}
        types={types}
        count={matching.length}
        onChange={setFilters}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
