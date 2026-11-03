import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Buscador del hero: operación (compra/alquiler) + dónde + tipo. Rutea a la sección elegida.
const modes = [
  { id: 'compra', label: 'Comprar', href: '/es/venta/' },
  { id: 'alquiler', label: 'Alquilar', href: '/es/alquilar/' },
] as const;

const types = ['Piso', 'Ático', 'Casa', 'Local', 'Terreno'];

export interface TownOption {
  slug: string;
  name: string;
}

interface HeroSearchProps {
  /** Pueblos con cartera, ordenados por número de inmuebles. */
  towns?: TownOption[];
}

export default function HeroSearch({ towns = [] }: HeroSearchProps) {
  const [mode, setMode] = useState<'compra' | 'alquiler'>('compra');
  const [town, setTown] = useState('');
  const [type, setType] = useState('');
  const reduceMotion = useReducedMotion();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const suffix = type ? `?tipo=${encodeURIComponent(type)}` : '';
    // "Dónde" es la primera pregunta de quien busca piso aquí: si elige pueblo,
    // va directo a su listado en vez de al catálogo entero.
    if (mode === 'compra' && town) {
      window.location.assign(`/es/venta/${town}/${suffix}`);
      return;
    }
    window.location.assign(`${modes.find((m) => m.id === mode)!.href}${suffix}`);
  }

  return (
    <form className="hero-search" role="search" aria-label="Buscar vivienda" onSubmit={submit}>
      <div className="segmented" role="tablist" aria-label="Qué buscas">
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
                layoutId="hero-mode"
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.3 }}
              />
            )}
            {item.label}
          </button>
        ))}
      </div>
      <div className="hero-search__row">
        {mode === 'compra' && towns.length > 0 && (
          <label className="field hero-search__field">
            <span className="field__label">Dónde</span>
            <select className="field__control" value={town} onChange={(e) => setTown(e.target.value)}>
              <option value="">Todo el Maresme y La Selva</option>
              {towns.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field hero-search__field">
          <span className="field__label">Tipo de vivienda</span>
          <select className="field__control" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Cualquiera</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="button button--primary button--large hero-search__submit">
          Buscar
        </button>
      </div>
    </form>
  );
}
