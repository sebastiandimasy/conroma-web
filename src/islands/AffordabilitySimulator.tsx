import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { site } from '../data/site';
import { affordability } from '../lib/finance';
import { formatPrice } from '../lib/format';
import { Icon } from './Icon';

type Payrolls = 12 | 14;

function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Check que se dibuja al aparecer (éxito). Estático con prefers-reduced-motion.
function AnimatedCheck({ size = 76 }: { size?: number }) {
  const reduced = useReducedMotion();
  const line = reduced
    ? { initial: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 } }
    : { initial: { pathLength: 0, opacity: 0.2 }, animate: { pathLength: 1, opacity: 1 } };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={reduced ? {} : { scale: 0.85 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.4 }}
    >
      <motion.circle cx="12" cy="12" r="10" {...line} transition={{ duration: 0.5, ease: 'easeInOut' }} style={{ transformBox: 'view-box', transformOrigin: 'center', rotate: -90 }} />
      <motion.path d="m9 12 2 2 4-4" initial={reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }} />
    </motion.svg>
  );
}

// Alerta que se dibuja al aparecer. Estática con prefers-reduced-motion.
function AnimatedAlert({ size = 76 }: { size?: number }) {
  const reduced = useReducedMotion();
  const draw = (delay: number) =>
    reduced
      ? { initial: { pathLength: 1, opacity: 1 }, animate: { pathLength: 1, opacity: 1 } }
      : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.5, delay, ease: 'easeInOut' as const } };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial={reduced ? {} : { scale: 0.85 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
    >
      <motion.circle cx="12" cy="12" r="10" {...draw(0)} style={{ transformBox: 'view-box', transformOrigin: 'center', rotate: -90 }} />
      <motion.path d="M12 8v5" {...draw(0.3)} />
      <motion.path d="M12 16h0.01" {...draw(0.5)} />
    </motion.svg>
  );
}

export default function AffordabilitySimulator() {
  // Campos numéricos como texto: así el usuario borra el "0" al escribir y no quedan ceros a la izquierda.
  const [price, setPrice] = useState('200000');
  const [hasSavings, setHasSavings] = useState(true);
  const [savings, setSavings] = useState('40000');
  const [salary, setSalary] = useState('1800');
  const [payrolls, setPayrolls] = useState<Payrolls>(14);
  const [debts, setDebts] = useState('0');
  const [seniority, setSeniority] = useState('24');
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fromQuery = Number(new URLSearchParams(window.location.search).get('precio'));
    if (Number.isFinite(fromQuery) && fromQuery >= 60000 && fromQuery <= 900000) setPrice(String(Math.round(fromQuery / 5000) * 5000));
  }, []);

  const priceN = Number(price) || 0;
  const savingsN = Number(savings) || 0;
  const salaryN = Number(salary) || 0;
  const debtsN = Number(debts) || 0;
  const seniorityN = Number(seniority) || 0;

  const result = useMemo(
    () => affordability({ price: priceN, hasSavings, savings: savingsN, monthlySalary: salaryN, payrolls, monthlyDebts: debtsN, seniorityMonths: seniorityN }),
    [priceN, hasSavings, savingsN, salaryN, payrolls, debtsN, seniorityN],
  );

  // Quita ceros a la izquierda ("01000" → "1000") y deja vaciar el campo.
  const num = (setter: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value.replace(/^0+(?=\d)/, ''));
    if (submitted) setSubmitted(false);
  };

  const spring = reduceMotion ? { duration: 0 } : { type: 'spring' as const, duration: 0.4, bounce: 0.3 };

  const aptoMessage = [
    'Hola, he hecho el cálculo de "¿puedo comprar?" en vuestra web.',
    `Precio que miro: ${formatPrice(priceN)}`,
    `Presupuesto máximo que me sale: ${formatPrice(Math.round(result.maxBudget))}`,
    'Me sale pre-aprobado. ¿Lo confirmamos?',
  ].join('\n');
  const reviewMessage = 'Hola, he hecho el cálculo de "¿puedo comprar?" y me gustaría que lo miréis conmigo.';
  const financingMessage = 'Hola, no tengo ahorros para la entrada. Quiero información de vuestra financiación 100%.';

  // Pantalla de resultado (reemplaza el formulario).
  if (submitted) {
    return (
      <motion.div
        className="afford__result"
        aria-live="polite"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {result.status === 'apto' && (
          <>
            <span className="afford__icon afford__icon--ok"><AnimatedCheck /></span>
            <p className="afford__eyebrow">Buenas noticias</p>
            <h2 className="afford__headline">Crédito preaprobado</h2>
            <p className="afford__sub">
              Podrías llegar hasta <strong>{formatPrice(Math.round(result.maxBudget))}</strong>
              {result.reachesPrice ? `, así que esta vivienda de ${formatPrice(priceN)} te entra.` : `. Esta vivienda de ${formatPrice(priceN)} se te queda algo por encima, pero lo miramos.`}
            </p>
            <a className="button button--primary button--large afford__cta" href={waLink(aptoMessage)} data-contact="whatsapp" data-origin="puedo-comprar">
              <Icon name="whatsapp" className="button__icon" />
              Confirma tu préstamo con un asesor
            </a>
          </>
        )}

        {result.status === 'revisar' && (
          <>
            <span className="afford__icon afford__icon--ok"><AnimatedCheck /></span>
            <p className="afford__eyebrow">Casi lo tienes</p>
            <h2 className="afford__headline">Por números, sí</h2>
            <p className="afford__sub">
              Tu endeudamiento cabe en el 40%, pero con poca antigüedad en el trabajo el banco pide verlo con calma. No te preocupes, se mira.
            </p>
            <a className="button button--primary button--large afford__cta" href={waLink(reviewMessage)} data-contact="whatsapp" data-origin="puedo-comprar-revisar">
              <Icon name="whatsapp" className="button__icon" />
              Míralo con un asesor
            </a>
          </>
        )}

        {result.status === 'no-apto' && (
          <>
            <span className="afford__icon afford__icon--warn"><AnimatedAlert /></span>
            <p className="afford__eyebrow">Aún no es hora</p>
            <h2 className="afford__headline">Todavía no te daría</h2>
            <p className="afford__sub">
              Con estos números tu capacidad de endeudamiento aún no llega: el banco mira que entre la cuota y tus deudas no pases del 40% de tu sueldo, y hoy te pasas. No lo dejes correr: baja un poco las deudas o ahorra algo más para la entrada y vuelve a probar. Cada mes cuentas.
            </p>
            <a className="button button--primary button--large afford__cta" href={waLink(reviewMessage)} data-contact="whatsapp" data-origin="puedo-comprar-no">
              <Icon name="whatsapp" className="button__icon" />
              Búscale la vuelta con un asesor
            </a>
          </>
        )}

        {!hasSavings && result.status !== 'apto' && (
          <p className="afford__financing">
            ¿Sin ahorros para la entrada? <strong>PERO OJO</strong> —{' '}
            <a href={waLink(financingMessage)} data-contact="whatsapp" data-origin="financiacion-100">
              pulsa aquí para conocer nuestra financiación 100%
            </a>
            .
          </p>
        )}

        <p className="afford__note">
          Es un cálculo hipotético, un simulacro orientativo. No es una oferta de ningún banco ni una concesión de crédito; lo confirmamos contigo.
        </p>

        <button type="button" className="afford__back text-link" onClick={() => setSubmitted(false)}>
          Volver a calcular
        </button>
      </motion.div>
    );
  }

  // Formulario.
  return (
    <form className="afford__form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="float-field">
        <input id="af-price" className="float-field__control" type="number" inputMode="numeric" min={0} step={5000} placeholder=" " value={price} onChange={num(setPrice)} />
        <label className="float-field__label" htmlFor="af-price">Precio de la vivienda (€)</label>
      </div>

      <div className="field">
        <span className="field__label">¿Tienes ahorros para la entrada?</span>
        <div className="segmented" role="group" aria-label="¿Tienes ahorros?">
          {[true, false].map((value) => (
            <button key={String(value)} type="button" className="segmented__option" aria-pressed={hasSavings === value} onClick={() => { setHasSavings(value); if (submitted) setSubmitted(false); }}>
              {hasSavings === value && <motion.span className="segmented__indicator" layoutId="af-savings" transition={spring} />}
              {value ? 'Sí' : 'No'}
            </button>
          ))}
        </div>
      </div>

      {hasSavings && (
        <div className="float-field">
          <input id="af-savings" className="float-field__control" type="number" inputMode="numeric" min={0} step={1000} placeholder=" " value={savings} onChange={num(setSavings)} />
          <label className="float-field__label" htmlFor="af-savings">Ahorros disponibles (€)</label>
        </div>
      )}

      <div className="float-field">
        <input id="af-salary" className="float-field__control" type="number" inputMode="numeric" min={0} step={50} placeholder=" " value={salary} onChange={num(setSalary)} />
        <label className="float-field__label" htmlFor="af-salary">Tu salario neto, por paga (€)</label>
      </div>

      <div className="field">
        <span className="field__label">Número de pagas</span>
        <div className="segmented" role="group" aria-label="Número de pagas">
          {([12, 14] as Payrolls[]).map((value) => (
            <button key={value} type="button" className="segmented__option" aria-pressed={payrolls === value} onClick={() => { setPayrolls(value); if (submitted) setSubmitted(false); }}>
              {payrolls === value && <motion.span className="segmented__indicator" layoutId="af-payrolls" transition={spring} />}
              {value} pagas
            </button>
          ))}
        </div>
      </div>

      <div className="float-field">
        <input id="af-debts" className="float-field__control" type="number" inputMode="numeric" min={0} step={10} placeholder=" " value={debts} onChange={num(setDebts)} />
        <label className="float-field__label" htmlFor="af-debts">Préstamos o deudas al mes (€)</label>
      </div>

      <div className="float-field">
        <input id="af-seniority" className="float-field__control" type="number" inputMode="numeric" min={0} step={1} placeholder=" " value={seniority} onChange={num(setSeniority)} />
        <label className="float-field__label" htmlFor="af-seniority">Antigüedad en tu trabajo (meses)</label>
      </div>

      <button type="submit" className="button button--primary button--large button--block">Hacer mi cálculo</button>
    </form>
  );
}
