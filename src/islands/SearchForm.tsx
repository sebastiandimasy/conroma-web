import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import gsap from 'gsap';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@heroui/react';
import type { Property } from '../data/properties';
import { applyFilters, emptyFilters } from '../lib/filters';
import { whatsappUrl } from '../lib/links';

type Mode = 'comprar' | 'alquilar' | 'vender';

interface SearchFormProps {
  properties: Property[];
  townName: string;
  listingUrl: string;
}

const modes: { id: Mode; label: string }[] = [
  { id: 'comprar', label: 'Comprar' },
  { id: 'alquilar', label: 'Alquilar' },
  { id: 'vender', label: 'Vender' },
];

const priceSteps = [150000, 200000, 250000, 300000, 400000];

export default function SearchForm({ properties, townName, listingUrl }: SearchFormProps) {
  const [mode, setMode] = useState<Mode>('comprar');
  const [type, setType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [address, setAddress] = useState('');
  const [displayed, setDisplayed] = useState(properties.length);
  const shown = useRef(properties.length);
  const reduceMotion = useReducedMotion();

  const types = useMemo(() => [...new Set(properties.map((property) => property.type))], [properties]);
  const count = useMemo(
    () =>
      applyFilters(properties, {
        ...emptyFilters,
        type: type || null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
      }).length,
    [properties, type, maxPrice],
  );

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(count);
      shown.current = count;
      return;
    }
    const state = { value: shown.current };
    const tween = gsap.to(state, {
      value: count,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => {
        shown.current = Math.round(state.value);
        setDisplayed(shown.current);
      },
    });
    return () => {
      tween.kill();
    };
  }, [count, reduceMotion]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === 'vender') {
      const query = address.trim() ? `?direccion=${encodeURIComponent(address.trim())}` : '';
      window.location.assign(`/es/valoracion/${query}`);
      return;
    }
    const query = new URLSearchParams();
    if (type) query.set('tipo', type);
    if (maxPrice) query.set('precio', maxPrice);
    const suffix = query.size ? `?${query.toString()}` : '';
    window.location.assign(`${listingUrl}${suffix}`);
  }

  return (
    <form className="search-form" role="search" aria-label="Buscar vivienda" onSubmit={submit}>
      <div className="segmented" role="tablist" aria-label="Qué quieres hacer">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className="segmented__option"
            aria-selected={mode === item.id}
            onClick={() => setMode(item.id)}
          >
            {mode === item.id && (
              <motion.span
                className="segmented__indicator"
                layoutId="search-mode"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.3 }}
              />
            )}
            {item.label}
          </button>
        ))}
      </div>

      {mode === 'comprar' && (
        <div className="search-form__panel" role="tabpanel">
          <label className="field">
            <span className="field__label">Dónde</span>
            <select className="field__control" name="pueblo" defaultValue={townName}>
              <option>{townName}</option>
            </select>
          </label>
          <div className="search-form__row">
            <label className="field">
              <span className="field__label">Tipo</span>
              <select className="field__control" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="">Cualquiera</option>
                {types.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Precio hasta</span>
              <select className="field__control" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
                <option value="">Sin tope</option>
                {priceSteps.map((step) => (
                  <option key={step} value={step}>
                    {`${step.toLocaleString('es-ES')} €`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button variant="primary" className="button--block" type="submit" isDisabled={count === 0}>
            {count === 0 ? (
              'No hay ninguna así ahora'
            ) : (
              `Ver ${displayed} ${count === 1 ? 'vivienda' : 'viviendas'}`
            )}
          </Button>
        </div>
      )}

      {mode === 'alquilar' && (
        <div className="search-form__panel search-form__panel--wide" role="tabpanel">
          <p className="search-form__note">
            El alquiler todavía no está en la web. Escríbenos y te decimos qué tenemos ahora mismo.
          </p>
          <a
            className="button button--ink button--block"
            href={whatsappUrl({ reason: 'general' })}
            data-contact="whatsapp"
            data-origin="buscador-alquiler"
          >
            Preguntar por alquiler
          </a>
        </div>
      )}

      {mode === 'vender' && (
        <div className="search-form__panel search-form__panel--wide" role="tabpanel">
          <label className="field">
            <span className="field__label">¿Dónde está tu piso?</span>
            <input
              className="field__control"
              type="text"
              name="direccion"
              autoComplete="street-address"
              placeholder="Ej. Carrer de Mar 24, Malgrat"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <Button variant="primary" className="button--block" type="submit">
            Saber cuánto vale
          </Button>
          <p className="field__hint">Gratis y sin compromiso.</p>
        </div>
      )}
    </form>
  );
}
