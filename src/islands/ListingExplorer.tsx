import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { Button } from '@heroui/react';
import type { Property } from '../data/properties';
import { findTown } from '../data/towns';
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
import { intlLocale, strings, type Lang } from '../i18n';

interface ListingExplorerProps {
  properties: Property[];
  townName: string;
  lang: Lang;
}

const texts = strings({
  es: {
    upTo: (price: string) => `Hasta ${price}`,
    rooms3: '3 hab o más',
    terrace: 'Terraza',
    elevator: 'Ascensor',
    filters: 'Filtros',
    count: (n: number) => `${n} ${n === 1 ? 'inmueble' : 'inmuebles'}`,
    restore: (n: number) => `Recuperar ${n} ${n === 1 ? 'descartada' : 'descartadas'}`,
    sort: 'Ordenar',
    newest: 'Más recientes',
    priceAsc: 'Precio, de menos a más',
    priceDesc: 'Precio, de más a menos',
    emptyTitle: 'Ahora mismo no tenemos ninguna así.',
    emptyText: 'Prueba a quitar algún filtro, o dinos qué buscas y te avisamos cuando entre.',
    clearFilters: 'Quitar filtros',
    tellUs: 'Decidnos qué buscas',
    more: (n: number) => `Ver más (${n} restantes)`,
    showingUpTo: (price: string) => `Mostrando inmuebles hasta ${price}.`,
  },
  en: {
    upTo: (price: string) => `Up to ${price}`,
    rooms3: '3+ bedrooms',
    terrace: 'Terrace',
    elevator: 'Lift',
    filters: 'Filters',
    count: (n: number) => `${n} ${n === 1 ? 'property' : 'properties'}`,
    restore: (n: number) => `Bring back ${n} hidden`,
    sort: 'Sort',
    newest: 'Newest first',
    priceAsc: 'Price, low to high',
    priceDesc: 'Price, high to low',
    emptyTitle: "We've got nothing like that right now.",
    emptyText: "Try removing a filter, or tell us what you're after and we'll let you know when something comes in.",
    clearFilters: 'Clear filters',
    tellUs: "Tell us what you're after",
    more: (n: number) => `Show more (${n} left)`,
    showingUpTo: (price: string) => `Showing properties up to ${price}.`,
  },
  ca: {
    upTo: (price: string) => `Fins a ${price}`,
    rooms3: '3 hab. o més',
    terrace: 'Terrassa',
    elevator: 'Ascensor',
    filters: 'Filtres',
    count: (n: number) => `${n} ${n === 1 ? 'immoble' : 'immobles'}`,
    restore: (n: number) => `Recuperar ${n} ${n === 1 ? 'descartat' : 'descartats'}`,
    sort: 'Ordenar',
    newest: 'Més recents',
    priceAsc: 'Preu, de menys a més',
    priceDesc: 'Preu, de més a menys',
    emptyTitle: 'Ara mateix no en tenim cap així.',
    emptyText: "Prova de treure algun filtre, o digues-nos què busques i t'avisem quan n'entri algun.",
    clearFilters: 'Treure filtres',
    tellUs: 'Digues-nos què busques',
    more: (n: number) => `Veure'n més (en queden ${n})`,
    showingUpTo: (price: string) => `Mostrant immobles fins a ${price}.`,
  },
});

const PAGE = 24;

export default function ListingExplorer({ properties, townName, lang }: ListingExplorerProps) {
  const t = texts[lang];
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [order, setOrder] = useState<SortOrder>('recientes');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const hidden = useStore(hiddenRefs);

  useEffect(() => {
    hydrateStore();
    setFilters(filtersFromQuery(new URLSearchParams(window.location.search)));
  }, []);

  const types = useMemo(() => [...new Set(properties.map((property) => property.type))], [properties]);
  // Pueblos presentes en esta cartera, de mas a menos inmuebles. En la pagina de un pueblo
  // concreto sale uno solo, y entonces el filtro no se pinta.
  const towns = useMemo(() => {
    const counts = new Map<string, number>();
    for (const property of properties) counts.set(property.town, (counts.get(property.town) ?? 0) + 1);
    return [...counts.entries()]
      .map(([slug, count]) => ({ slug, name: findTown(slug)?.name ?? slug, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, intlLocale[lang]));
  }, [properties]);
  const townName_ = towns.find((town) => town.slug === filters.town)?.name ?? null;
  const matching = useMemo(() => applyFilters(properties, filters), [properties, filters]);
  const visible = useMemo(
    () => sortProperties(matching.filter((property) => !hidden.includes(property.ref)), order),
    [matching, hidden, order],
  );
  useEffect(() => setShown(PAGE), [filters, order]);
  const active = countActive(filters);
  const hiddenCount = matching.length - visible.length;

  const quick: { label: string; active: boolean; toggle: () => void }[] = [
    ...(townName_
      ? [{ label: townName_, active: true, toggle: () => setFilters({ ...filters, town: null }) }]
      : []),
    {
      label: t.upTo(formatPrice(250000, lang)),
      active: filters.maxPrice === 250000,
      toggle: () => setFilters({ ...filters, maxPrice: filters.maxPrice === 250000 ? null : 250000 }),
    },
    {
      label: t.rooms3,
      active: filters.minRooms === 3,
      toggle: () => setFilters({ ...filters, minRooms: filters.minRooms === 3 ? null : 3 }),
    },
    { label: t.terrace, active: filters.terrace, toggle: () => setFilters({ ...filters, terrace: !filters.terrace }) },
    { label: t.elevator, active: filters.elevator, toggle: () => setFilters({ ...filters, elevator: !filters.elevator }) },
  ];

  return (
    <div className="listing">
      <div className="chip-row chip-row--scroll listing__filters">
        <button
          type="button"
          className="chip chip--active"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
        >
          <Icon name="filter" className="button__icon" />
          {`${t.filters}${active > 0 ? ` · ${active}` : ''}`}
        </button>
        {quick.map((item) => (
          <button key={item.label} type="button" className="chip" aria-pressed={item.active} onClick={item.toggle}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="listing__bar">
        <p className="listing__count" aria-live="polite">
          {t.count(visible.length)}
          {hiddenCount > 0 && (
            <>
              {' · '}
              <button type="button" className="listing__restore" onClick={restoreHidden}>
                {t.restore(hiddenCount)}
              </button>
            </>
          )}
        </p>
        <label className="listing__sort">
          <span className="visually-hidden">{t.sort}</span>
          <select value={order} onChange={(event) => setOrder(event.target.value as SortOrder)}>
            <option value="recientes">{t.newest}</option>
            <option value="precio-asc">{t.priceAsc}</option>
            <option value="precio-desc">{t.priceDesc}</option>
          </select>
          <Icon name="chevron" className="listing__sort-icon" />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="listing__empty">
          <h2 className="listing__empty-title">{t.emptyTitle}</h2>
          <p>{t.emptyText}</p>
          <div className="listing__empty-actions">
            <Button variant="ghost" onPress={() => setFilters(emptyFilters)}>
              {t.clearFilters}
            </Button>
            <a
              className="button button--ink"
              href={whatsappUrl(lang, { reason: 'general' })}
              data-contact="whatsapp"
              data-origin="listado-vacio"
            >
              {t.tellUs}
            </a>
          </div>
        </div>
      ) : (
        <ul className="property-grid">
          {visible.slice(0, shown).map((property, index) => (
            <li key={property.ref} className="property-grid__item">
              <PropertyCard
                property={property}
                townName={townName}
                origin="listado"
                eager={index === 0}
                headingLevel="h2"
                onHide={hideProperty}
                lang={lang}
              />
            </li>
          ))}
        </ul>
      )}

      {visible.length > shown && (
        <div className="listing__more">
          <Button variant="ghost" onPress={() => setShown(shown + PAGE)}>
            {t.more(visible.length - shown)}
          </Button>
        </div>
      )}

      {filters.maxPrice !== null && visible.length > 0 && (
        <p className="visually-hidden">{t.showingUpTo(formatPrice(filters.maxPrice, lang))}</p>
      )}

      <FilterSheet
        open={sheetOpen}
        filters={filters}
        towns={towns}
        types={types}
        count={matching.length}
        onChange={setFilters}
        onClose={() => setSheetOpen(false)}
        lang={lang}
      />
    </div>
  );
}
