import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { site } from '../data/site';
import { affordability } from '../lib/finance';
import { formatPrice } from '../lib/format';
import { Icon } from './Icon';
import { FlipLabel } from './FlipLabel';
import { strings, type Lang } from '../i18n';

type Payrolls = 12 | 14;

function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

// Check que se dibuja al aparecer (éxito). Estático con prefers-reduced-motion.
function AnimatedCheck({ size = 60 }: { size?: number }) {
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
      strokeWidth={2.25}
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
function AnimatedAlert({ size = 60 }: { size?: number }) {
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
      strokeWidth={2.25}
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

const text = strings({
  es: {
    aptoMessage: (price: string, budget: string) =>
      ['Hola, he hecho el cálculo de "¿puedo comprar?" en vuestra web.', `Precio que miro: ${price}`, `Presupuesto máximo que me sale: ${budget}`, 'Me sale pre-aprobado. ¿Lo confirmamos?'].join('\n'),
    reviewMessage: 'Hola, he hecho el cálculo de "¿puedo comprar?" y me gustaría que lo miréis conmigo.',
    financingMessage: 'Hola, no tengo ahorros para la entrada. Quiero información de vuestra financiación 100%.',
    aptoTitle: 'Crédito preaprobado',
    upTo: 'Podrías llegar hasta ',
    fits: (price: string) => `, así que esta vivienda de ${price} te entra.`,
    over: (price: string) => `. Esta vivienda de ${price} se te queda algo por encima, pero lo miramos.`,
    aptoCta: 'Confirma tu préstamo con un asesor',
    reviewTitle: 'Por números, sí',
    reviewText: 'Tu endeudamiento cabe en el 40%, pero con poca antigüedad en el trabajo el banco pide verlo con calma. No te preocupes, se mira.',
    reviewCta: 'Míralo con un asesor',
    noTitle: 'Todavía no te daría',
    noText:
      'Con estos números tu capacidad de endeudamiento aún no llega: el banco mira que entre la cuota y tus deudas no pases del 40% de tu sueldo, y hoy te pasas. No lo dejes correr: baja un poco las deudas o ahorra algo más para la entrada y vuelve a probar. Cada mes cuentas.',
    noCta: 'Búscale la vuelta con un asesor',
    financingQuestion: '¿Sin ahorros para la entrada?',
    financingWarn: 'Pero ojo:',
    financingLink: 'pulsa aquí para conocer nuestra financiación 100%',
    note: 'Es un cálculo hipotético, un simulacro orientativo. No es una oferta de ningún banco ni una concesión de crédito; lo confirmamos contigo.',
    back: 'Volver a calcular',
    price: 'Precio de la vivienda (€)',
    hasSavings: '¿Tienes ahorros para la entrada?',
    hasSavingsAria: '¿Tienes ahorros?',
    yes: 'Sí',
    no: 'No',
    savings: 'Ahorros disponibles (€)',
    salary: 'Tu salario neto, por paga (€)',
    payrolls: 'Número de pagas',
    payrollsUnit: 'pagas',
    debts: 'Préstamos o deudas al mes (€)',
    seniority: 'Antigüedad en tu trabajo (meses)',
    submit: 'Hacer mi cálculo',
  },
  // Inglés: explica lo que un comprador extranjero no da por sabido (las 14 pagas, «entrada» = deposit).
  en: {
    aptoMessage: (price: string, budget: string) =>
      ['Hi, I\'ve done the "can I buy?" calculation on your website.', `Price I'm looking at: ${price}`, `Maximum budget I get: ${budget}`, "It says I'm pre-approved. Can we confirm it?"].join('\n'),
    reviewMessage: 'Hi, I\'ve done the "can I buy?" calculation and I\'d like you to go through it with me.',
    financingMessage: "Hi, I don't have savings for the deposit. I'd like information about your 100% financing.",
    aptoTitle: 'Loan pre-approved',
    upTo: 'You could go up to ',
    fits: (price: string) => `, so this ${price} home is within reach.`,
    over: (price: string) => `. This ${price} home is a bit above that, but we'll look into it.`,
    aptoCta: 'Confirm your loan with an adviser',
    reviewTitle: 'On the numbers, yes',
    reviewText: "Your debt fits within the 40%, but you haven't been in your job long, so the bank will want a closer look. Don't worry, we'll look at it together.",
    reviewCta: 'Go through it with an adviser',
    noTitle: 'Not quite yet',
    noText:
      "With these numbers you can't borrow enough yet. The bank checks that your mortgage payment plus your other debts stay under 40% of your salary, and right now you're over. Don't give up on it: pay down some debt or save a bit more for the deposit and try again. Every month counts.",
    noCta: 'Find a way round it with an adviser',
    financingQuestion: 'No savings for the deposit?',
    financingWarn: 'Hold on, though:',
    financingLink: 'tap here to find out about our 100% financing',
    note: "This is a hypothetical calculation, a rough guide only. It isn't an offer from any bank or a loan approval; we confirm it with you.",
    back: 'Calculate again',
    price: 'Price of the home (€)',
    hasSavings: 'Do you have savings for the deposit?',
    hasSavingsAria: 'Do you have savings?',
    yes: 'Yes',
    no: 'No',
    savings: 'Savings available (€)',
    salary: 'Your net pay per payment (€)',
    payrolls: 'Payments a year (in Spain, often 14)',
    payrollsUnit: 'payments',
    debts: 'Monthly loan or debt repayments (€)',
    seniority: 'Time in your current job (months)',
    submit: 'Work it out',
  },
  ca: {
    aptoMessage: (price: string, budget: string) =>
      ['Hola, he fet el càlcul de "puc comprar?" al vostre web.', `Preu que miro: ${price}`, `Pressupost màxim que em surt: ${budget}`, 'Em surt preaprovat. Ho confirmem?'].join('\n'),
    reviewMessage: 'Hola, he fet el càlcul de "puc comprar?" i m\'agradaria que el miréssiu amb mi.',
    financingMessage: "Hola, no tinc estalvis per a l'entrada. Vull informació del vostre finançament al 100%.",
    aptoTitle: 'Crèdit preaprovat',
    upTo: 'Podries arribar fins a ',
    fits: (price: string) => `, així que aquest habitatge de ${price} t'entra.`,
    over: (price: string) => `. Aquest habitatge de ${price} se't queda una mica per sobre, però ho mirem.`,
    aptoCta: 'Confirma el teu préstec amb un assessor',
    reviewTitle: 'Pels números, sí',
    reviewText: "El teu endeutament cap dins del 40%, però amb poca antiguitat a la feina el banc s'ho vol mirar amb calma. No pateixis, es mira.",
    reviewCta: 'Mira-ho amb un assessor',
    noTitle: "Encara no te'l donaria",
    noText:
      "Amb aquests números la teva capacitat d'endeutament encara no hi arriba: el banc mira que entre la quota i els teus deutes no passis del 40% del teu sou, i avui te'n passes. No ho deixis córrer: rebaixa una mica els deutes o estalvia una mica més per a l'entrada i torna-ho a provar. Cada mes compta.",
    noCta: 'Busca-hi la volta amb un assessor',
    financingQuestion: "Sense estalvis per a l'entrada?",
    financingWarn: 'Però compte:',
    financingLink: 'prem aquí per conèixer el nostre finançament al 100%',
    note: 'És un càlcul hipotètic, un simulacre orientatiu. No és una oferta de cap banc ni una concessió de crèdit; ho confirmem amb tu.',
    back: 'Tornar a calcular',
    price: "Preu de l'habitatge (€)",
    hasSavings: "Tens estalvis per a l'entrada?",
    hasSavingsAria: 'Tens estalvis?',
    yes: 'Sí',
    no: 'No',
    savings: 'Estalvis disponibles (€)',
    salary: 'El teu sou net, per paga (€)',
    payrolls: 'Nombre de pagues',
    payrollsUnit: 'pagues',
    debts: 'Préstecs o deutes al mes (€)',
    seniority: 'Antiguitat a la feina (mesos)',
    submit: 'Fer el meu càlcul',
  },
});

export default function AffordabilitySimulator({ lang }: { lang: Lang }) {
  const t = text[lang];
  const euros = (value: number) => formatPrice(value, lang);
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

  const aptoMessage = t.aptoMessage(euros(priceN), euros(Math.round(result.maxBudget)));
  const reviewMessage = t.reviewMessage;
  const financingMessage = t.financingMessage;

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
            <h2 className="afford__headline">{t.aptoTitle}</h2>
            <p className="afford__sub">
              {t.upTo}<strong>{euros(Math.round(result.maxBudget))}</strong>
              {result.reachesPrice ? t.fits(euros(priceN)) : t.over(euros(priceN))}
            </p>
            <a className="button button--primary button--large afford__cta" href={waLink(aptoMessage)} data-contact="whatsapp" data-origin="puedo-comprar">
              <FlipLabel>
                <Icon name="whatsapp" className="button__icon" />
                {t.aptoCta}
              </FlipLabel>
            </a>
          </>
        )}

        {result.status === 'revisar' && (
          <>
            <span className="afford__icon afford__icon--ok"><AnimatedCheck /></span>
            <h2 className="afford__headline">{t.reviewTitle}</h2>
            <p className="afford__sub">{t.reviewText}</p>
            <a className="button button--primary button--large afford__cta" href={waLink(reviewMessage)} data-contact="whatsapp" data-origin="puedo-comprar-revisar">
              <FlipLabel>
                <Icon name="whatsapp" className="button__icon" />
                {t.reviewCta}
              </FlipLabel>
            </a>
          </>
        )}

        {result.status === 'no-apto' && (
          <>
            <span className="afford__icon afford__icon--warn"><AnimatedAlert /></span>
            <h2 className="afford__headline">{t.noTitle}</h2>
            <p className="afford__sub">{t.noText}</p>
            <a className="button button--primary button--large afford__cta" href={waLink(reviewMessage)} data-contact="whatsapp" data-origin="puedo-comprar-no">
              <FlipLabel>
                <Icon name="whatsapp" className="button__icon" />
                {t.noCta}
              </FlipLabel>
            </a>
          </>
        )}

        {!hasSavings && result.status !== 'apto' && (
          <p className="afford__financing">
            {t.financingQuestion} <strong>{t.financingWarn}</strong>{' '}
            <a href={waLink(financingMessage)} data-contact="whatsapp" data-origin="financiacion-100">
              {t.financingLink}
            </a>
            .
          </p>
        )}

        <p className="afford__note">{t.note}</p>

        <button type="button" className="afford__back text-link" onClick={() => setSubmitted(false)}>
          {t.back}
        </button>
      </motion.div>
    );
  }

  // Formulario.
  return (
    <form className="afford__form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <div className="float-field">
        <input id="af-price" className="float-field__control" type="number" inputMode="numeric" min={0} step={5000} placeholder=" " value={price} onChange={num(setPrice)} />
        <label className="float-field__label" htmlFor="af-price">{t.price}</label>
      </div>

      <div className="field">
        <span className="field__label">{t.hasSavings}</span>
        <div className="segmented" role="group" aria-label={t.hasSavingsAria}>
          {[true, false].map((value) => (
            <button key={String(value)} type="button" className="segmented__option" aria-pressed={hasSavings === value} onClick={() => { setHasSavings(value); if (submitted) setSubmitted(false); }}>
              {hasSavings === value && <motion.span className="segmented__indicator" layoutId="af-savings" transition={spring} />}
              {value ? t.yes : t.no}
            </button>
          ))}
        </div>
      </div>

      {hasSavings && (
        <div className="float-field">
          <input id="af-savings" className="float-field__control" type="number" inputMode="numeric" min={0} step={1000} placeholder=" " value={savings} onChange={num(setSavings)} />
          <label className="float-field__label" htmlFor="af-savings">{t.savings}</label>
        </div>
      )}

      <div className="float-field">
        <input id="af-salary" className="float-field__control" type="number" inputMode="numeric" min={0} step={50} placeholder=" " value={salary} onChange={num(setSalary)} />
        <label className="float-field__label" htmlFor="af-salary">{t.salary}</label>
      </div>

      <div className="field">
        <span className="field__label">{t.payrolls}</span>
        <div className="segmented" role="group" aria-label={t.payrolls}>
          {([12, 14] as Payrolls[]).map((value) => (
            <button key={value} type="button" className="segmented__option" aria-pressed={payrolls === value} onClick={() => { setPayrolls(value); if (submitted) setSubmitted(false); }}>
              {payrolls === value && <motion.span className="segmented__indicator" layoutId="af-payrolls" transition={spring} />}
              {value} {t.payrollsUnit}
            </button>
          ))}
        </div>
      </div>

      <div className="float-field">
        <input id="af-debts" className="float-field__control" type="number" inputMode="numeric" min={0} step={10} placeholder=" " value={debts} onChange={num(setDebts)} />
        <label className="float-field__label" htmlFor="af-debts">{t.debts}</label>
      </div>

      <div className="float-field">
        <input id="af-seniority" className="float-field__control" type="number" inputMode="numeric" min={0} step={1} placeholder=" " value={seniority} onChange={num(setSeniority)} />
        <label className="float-field__label" htmlFor="af-seniority">{t.seniority}</label>
      </div>

      <button type="submit" className="button button--primary button--large button--block">
        <FlipLabel>{t.submit}</FlipLabel>
      </button>
    </form>
  );
}
