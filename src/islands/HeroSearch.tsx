import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Buscador del hero: operación (compra/alquiler) + tipo + buscar. Rutea a la sección elegida.
const modes = [
  { id: 'compra', label: 'Comprar', href: '/es/comprar/' },
  { id: 'alquiler', label: 'Alquilar', href: '/es/alquilar/' },
] as const;

const types = ['Piso', 'Ático', 'Casa', 'Local', 'Terreno'];

export default function HeroSearch() {
  const [mode, setMode] = useState<'compra' | 'alquiler'>('compra');
  const [type, setType] = useState('');
  const reduceMotion = useReducedMotion();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = modes.find((m) => m.id === mode)!.href;
    const suffix = type ? `?tipo=${encodeURIComponent(type)}` : '';
    window.location.assign(`${href}${suffix}`);
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
