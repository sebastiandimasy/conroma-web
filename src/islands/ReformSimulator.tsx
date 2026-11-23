import { useMemo, useState } from 'react';
import { site } from '../data/site';
import { reformRates, reformReference, simulateReform, type ReformQuality } from '../lib/finance';
import { formatPrice } from '../lib/format';
import { AnimatedNumber } from './AnimatedNumber';
import { Icon } from './Icon';
import { RangeField } from './RangeField';
import { FlipLabel } from './FlipLabel';
import { strings, type Lang } from '../i18n';

const qualities = Object.keys(reformRates) as ReformQuality[];

const text = strings({
  es: {
    qualities: { basica: 'Básica', media: 'Media', alta: 'Alta' } as Record<ReformQuality, string>,
    message: (area: number, quality: string, estimate: string) =>
      ['Hola, he usado el simulador de reformas de la web.', `Superficie: ${area} m²`, `Calidad: ${quality}`, `Estimación: ${estimate}`, '¿Me hacéis un presupuesto real?'].join('\n'),
    area: 'Metros del piso',
    finishes: 'Calidad de los acabados',
    source: 'Fuente',
    result: 'Coste estimado de una reforma integral',
    sub: (area: number, quality: string) => `${area} m² · calidad ${quality}`,
    range: (area: number) => `Horquilla habitual para ${area} m²`,
    between: (low: string, high: string) => `${low} a ${high}`,
    cta: 'Quiero un presupuesto real',
    note: 'Son medias de España, no nuestros precios. Sirve para hacerte una idea; el presupuesto de verdad sale de ver el piso.',
  },
  en: {
    qualities: { basica: 'Basic', media: 'Mid-range', alta: 'High-end' },
    message: (area: number, quality: string, estimate: string) =>
      ["Hi, I've used the renovation calculator on your website.", `Size: ${area} m²`, `Finish: ${quality}`, `Estimate: ${estimate}`, 'Could you give me a proper quote?'].join('\n'),
    area: 'Size of the home',
    finishes: 'Quality of the finishes',
    source: 'Source',
    result: 'Estimated cost of a full renovation',
    sub: (area: number, quality: string) => `${area} m² · ${quality} finish`,
    range: (area: number) => `Usual range for ${area} m²`,
    between: (low: string, high: string) => `${low} to ${high}`,
    cta: 'I want a proper quote',
    note: "These are averages for Spain, not our prices. They give you an idea; the real quote comes from seeing the property.",
  },
  ca: {
    qualities: { basica: 'Bàsica', media: 'Mitjana', alta: 'Alta' },
    message: (area: number, quality: string, estimate: string) =>
      ['Hola, he fet servir el simulador de reformes del web.', `Superfície: ${area} m²`, `Qualitat: ${quality}`, `Estimació: ${estimate}`, 'Em feu un pressupost real?'].join('\n'),
    area: 'Metres del pis',
    finishes: 'Qualitat dels acabats',
    source: 'Font',
    result: "Cost estimat d'una reforma integral",
    sub: (area: number, quality: string) => `${area} m² · qualitat ${quality}`,
    range: (area: number) => `Forquilla habitual per a ${area} m²`,
    between: (low: string, high: string) => `${low} a ${high}`,
    cta: 'Vull un pressupost real',
    note: "Són mitjanes d'Espanya, no els nostres preus. Serveix per fer-te'n una idea; el pressupost de debò surt de veure el pis.",
  },
});

export default function ReformSimulator({ lang }: { lang: Lang }) {
  const t = text[lang];
  const reference = reformReference[lang];
  const [area, setArea] = useState(80);
  const [quality, setQuality] = useState<ReformQuality>('media');
  const result = useMemo(() => simulateReform(area, quality), [area, quality]);
  const qualityName = t.qualities[quality].toLowerCase();
  const message = t.message(area, qualityName, formatPrice(result.estimate, lang));

  return (
    <div className="simulator">
      <form className="simulator__controls" onSubmit={(event) => event.preventDefault()}>
        <RangeField id="superficie" label={t.area} value={area} min={30} max={200} step={5} display={`${area} m²`} onChange={setArea} />
        <fieldset className="simulator__group">
          <legend className="field__label">{t.finishes}</legend>
          <div className="chip-row">
            {qualities.map((item) => (
              <button key={item} type="button" className="chip" aria-pressed={quality === item} onClick={() => setQuality(item)}>
                {`${t.qualities[item]} · ${formatPrice(reformRates[item].perSquareMetre, lang)}/m²`}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="simulator__reference">
          {`${reference.label}: ${reference.value}. ${t.source}: ${reference.source}, ${reference.date}.`}
        </p>
      </form>

      <div className="simulator__result" aria-live="polite">
        <p className="simulator__label">{t.result}</p>
        <p className="simulator__value">
          <AnimatedNumber value={result.estimate} lang={lang} />
        </p>
        <p className="simulator__sub">
          {t.sub(area, qualityName)}
        </p>
        <dl className="simulator__breakdown">
          <div>
            <dt>{t.range(area)}</dt>
            <dd>
              {t.between(formatPrice(result.low, lang), formatPrice(result.high, lang))}
            </dd>
          </div>
        </dl>
        <a
          className="button button--primary button--large button--block"
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`}
          data-contact="whatsapp"
          data-origin="simulador-reformas"
        >
          <FlipLabel>
            <Icon name="whatsapp" className="button__icon" />
            {t.cta}
          </FlipLabel>
        </a>
        <p className="simulator__note">
          {t.note}
        </p>
      </div>
    </div>
  );
}
