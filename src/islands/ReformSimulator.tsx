import { useMemo, useState } from 'react';
import { site } from '../data/site';
import { reformRates, reformReference, simulateReform, type ReformQuality } from '../lib/finance';
import { formatPrice } from '../lib/format';
import { AnimatedNumber } from './AnimatedNumber';
import { Icon } from './Icon';
import { RangeField } from './RangeField';

const qualities = Object.keys(reformRates) as ReformQuality[];

export default function ReformSimulator() {
  const [area, setArea] = useState(80);
  const [quality, setQuality] = useState<ReformQuality>('media');
  const result = useMemo(() => simulateReform(area, quality), [area, quality]);
  const message = [
    'Hola, he usado el simulador de reformas de la web.',
    `Superficie: ${area} m²`,
    `Calidad: ${reformRates[quality].label.toLowerCase()}`,
    `Estimación: ${formatPrice(result.estimate)}`,
    '¿Me hacéis un presupuesto real?',
  ].join('\n');

  return (
    <div className="simulator">
      <form className="simulator__controls" onSubmit={(event) => event.preventDefault()}>
        <RangeField id="superficie" label="Metros del piso" value={area} min={30} max={200} step={5} display={`${area} m²`} onChange={setArea} />
        <fieldset className="simulator__group">
          <legend className="field__label">Calidad de los acabados</legend>
          <div className="chip-row">
            {qualities.map((item) => (
              <button key={item} type="button" className="chip" aria-pressed={quality === item} onClick={() => setQuality(item)}>
                {`${reformRates[item].label} · ${reformRates[item].perSquareMetre} €/m²`}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="simulator__reference">
          {`${reformReference.label}: ${reformReference.value}. Fuente: ${reformReference.source}, ${reformReference.date}.`}
        </p>
      </form>

      <div className="simulator__result" aria-live="polite">
        <p className="simulator__label">Coste estimado de una reforma integral</p>
        <p className="simulator__value">
          <AnimatedNumber value={result.estimate} />
        </p>
        <p className="simulator__sub">
          {`${area} m² · calidad ${reformRates[quality].label.toLowerCase()}`}
        </p>
        <dl className="simulator__breakdown">
          <div>
            <dt>{`Horquilla habitual para ${area} m²`}</dt>
            <dd>
              {`${formatPrice(result.low)} a ${formatPrice(result.high)}`}
            </dd>
          </div>
        </dl>
        <a
          className="button button--primary button--large button--block"
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`}
          data-contact="whatsapp"
          data-origin="simulador-reformas"
        >
          <Icon name="whatsapp" className="button__icon" />
          Quiero un presupuesto real
        </a>
        <p className="simulator__note">
          Son medias de España, no nuestros precios. Sirve para hacerte una idea; el presupuesto de verdad sale de ver el
          piso.
        </p>
      </div>
    </div>
  );
}
