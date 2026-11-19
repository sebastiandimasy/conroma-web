import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from '@heroui/react';
import { site } from '../data/site';
import { formatRating } from '../lib/format';
import { createBrowserClient } from '../lib/supabase';
import { saveLead } from '../lib/leads';
import { Icon } from './Icon';
import { FlipLabel } from './FlipLabel';

type Moment = 'ya' | 'curiosidad' | 'herencia';
type Condition = 'vivir' | 'repaso' | 'reforma' | 'nose';
type Issue = 'herencia' | 'no-escriturada' | 'sin-cedula' | 'documentacion' | 'otros';
type Channel = 'whatsapp' | 'llamada';

interface Answers {
  moment: Moment | null;
  address: string;
  condition: Condition | null;
  issue: Issue | null;
  issueOther: string;
  name: string;
  channel: Channel;
  phone: string;
  privacy: boolean;
  news: boolean;
}

const moments: { id: Moment; label: string; hint: string }[] = [
  { id: 'ya', label: 'Quiero vender ya', hint: 'Te decimos precio y plan' },
  { id: 'curiosidad', label: 'Aún no, solo curiosidad', hint: 'Te orientamos y listo' },
  { id: 'herencia', label: 'Es una herencia o un lío', hint: 'Lo vemos con calma' },
];

const conditions: { id: Condition; label: string }[] = [
  { id: 'vivir', label: 'Para entrar a vivir' },
  { id: 'repaso', label: 'Necesita un repaso' },
  { id: 'reforma', label: 'Hay que reformarlo entero' },
  { id: 'nose', label: 'No lo sé' },
];

const issues: { id: Issue; label: string }[] = [
  { id: 'herencia', label: 'Es una herencia' },
  { id: 'no-escriturada', label: 'No está escriturada' },
  { id: 'sin-cedula', label: 'No tengo cédula de habitabilidad' },
  { id: 'documentacion', label: 'No sé qué documentación o impuestos necesito' },
  { id: 'otros', label: 'Otros, te lo cuento' },
];

const issueText: Record<Issue, string> = {
  herencia: 'es una herencia',
  'no-escriturada': 'no está escriturada',
  'sin-cedula': 'no tiene cédula de habitabilidad',
  documentacion: 'no sé qué documentación o impuestos necesito',
  otros: 'otra situación',
};

const momentText: Record<Moment, string> = {
  ya: 'Quiero vender ya',
  curiosidad: 'De momento solo quiero saber cuánto vale',
  herencia: 'Es una herencia o una situación complicada',
};

const conditionText: Record<Condition, string> = {
  vivir: 'para entrar a vivir',
  repaso: 'necesita un repaso',
  reforma: 'hay que reformarlo entero',
  nose: 'no sé en qué estado está',
};

const titles = [
  'Vale, cuéntanos. ¿Cómo lo tienes?',
  '¿Dónde está el piso?',
  '¡Estás a un paso! ¿Cómo está por dentro?',
  'Último paso. ¿Cómo te contestamos?',
];

function buildMessage(answers: Answers): string {
  const lines = [
    `Hola, soy ${answers.name.trim()}. Quiero saber cuánto vale mi piso.`,
    `Dirección: ${answers.address.trim()}`,
    answers.moment ? `Situación: ${momentText[answers.moment]}` : '',
    answers.moment === 'herencia' && answers.issue
      ? `Qué lo complica: ${answers.issue === 'otros' ? answers.issueOther.trim() || issueText.otros : issueText[answers.issue]}`
      : '',
    answers.condition ? `Estado: ${conditionText[answers.condition]}` : '',
    answers.channel === 'llamada' ? `Prefiero que me llaméis al ${answers.phone.trim()}` : 'Prefiero WhatsApp',
    answers.news ? 'Sí quiero recibir novedades de mi zona.' : '',
  ];
  return lines.filter(Boolean).join('\n');
}

function isValidPhone(value: string): boolean {
  return /^(\+?\d[\d\s]{7,14})$/.test(value.trim());
}

export default function ValuationWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState<Answers>({
    moment: null,
    address: '',
    condition: null,
    issue: null,
    issueOther: '',
    name: '',
    channel: 'whatsapp',
    phone: '',
    privacy: false,
    news: false,
  });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const address = new URLSearchParams(window.location.search).get('direccion');
    if (address) setAnswers((previous) => ({ ...previous, address }));
  }, []);

  useEffect(() => {
    if (step > 0) titleRef.current?.focus();
  }, [step]);

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setErrors({});
    setStep(next);
  }

  function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answers.address.trim().length < 5) {
      setErrors({ address: 'Pon la calle y el número, aunque sea aproximado.' });
      document.getElementById('valoracion-address')?.focus();
      return;
    }
    go(2);
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (answers.name.trim().length < 2) next.name = 'Dinos cómo te llamas.';
    if (answers.channel === 'llamada' && !isValidPhone(answers.phone)) {
      next.phone = 'Ese teléfono no parece completo. Revísalo.';
    }
    if (!answers.privacy) next.privacy = 'Necesitamos que aceptes la política de privacidad para contestarte.';
    setErrors(next);
    const first = (['name', 'phone', 'privacy'] as const).find((k) => next[k]);
    if (first) {
      document.getElementById(`valoracion-${first}`)?.focus();
      return;
    }
    if (sending) return;
    setSending(true);

    // El lead se guarda SIEMPRE, antes de ofrecer WhatsApp: si el visitante no llega a enviar
    // el WhatsApp, la solicitud no se pierde.
    // Insert directo en Supabase (web estática, sin Worker): anon key + policy RLS solo-INSERT.
    const stored = await saveLead(() =>
      createBrowserClient()
        .from('lead')
        .insert({
          name: answers.name.trim(),
          phone: answers.phone.trim(),
          message: buildMessage(answers),
          intent: 'valoracion',
          source: 'valoracion',
          zone: answers.address.trim().slice(0, 120) || null, // la policy acota zone a 120
          status: 'nuevo',
          consent_marketing: answers.news, // la casilla de novedades sí es consentimiento de marketing
          consent_at: new Date().toISOString(),
          consent_source: 'valoracion',
        }),
    );

    setSaved(stored);
    setSending(false);
    setSent(true);
  }

  const variants = reduceMotion
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir * -48 }),
      };

  if (sent) {
    const callMe = answers.channel === 'llamada';
    const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildMessage(answers))}`;
    return (
      <section className="wizard wizard--done" aria-live="polite">
        <h1 className="visually-hidden">¿Cuánto vale mi piso?</h1>
        <h2 className="wizard__title">
          {!saved
            ? 'Tu solicitud aún no nos ha llegado. Envíala por WhatsApp.'
            : callMe
              ? `Recibido, ${answers.name.trim().split(' ')[0]}. Te llamamos nosotros.`
              : 'Recibido. Pulsa para continuar por WhatsApp.'}
        </h2>
        <p className="wizard__text">
          {!saved ? (
            <>
              No hemos podido guardarla. Pulsa el botón: se abre WhatsApp con la solicitud ya escrita y solo tienes que
              darle a enviar. O llámanos al{' '}
              <a href={`tel:${site.phone}`} data-contact="llamada" data-origin="valoracion-fallo">
                {site.phoneDisplay}
              </a>
              .
            </>
          ) : callMe ? (
            <>
              Tenemos tu teléfono y la dirección del piso. Te llamamos en horario de oficina, normalmente el mismo
              día. Si prefieres adelantarlo, llámanos tú al{' '}
              <a href={`tel:${site.phone}`} data-contact="llamada" data-origin="valoracion-fin">
                {site.phoneDisplay}
              </a>
              .
            </>
          ) : (
            <>
              Se abre WhatsApp con tu solicitud ya escrita: dale a enviar y te contestamos nosotros, en persona. Si
              prefieres, llámanos al{' '}
              <a href={`tel:${site.phone}`} data-contact="llamada" data-origin="valoracion-fin">
                {site.phoneDisplay}
              </a>
              .
            </>
          )}
        </p>
        {(!callMe || !saved) && (
          <a
            className="button button--primary button--large button--block"
            href={waHref}
            target="_blank"
            rel="noopener"
            data-contact="whatsapp"
            data-origin={saved ? 'valoracion-whatsapp' : 'valoracion-fallo'}
          >
            <FlipLabel>Continuar por WhatsApp</FlipLabel>
          </a>
        )}
        <a className="link-cta" href="/es/venta/malgrat-de-mar/">
          Ver pisos en venta mientras tanto
        </a>
      </section>
    );
  }

  return (
    <section className="wizard" aria-label="Valoración de tu piso">
      <header className="wizard__header">
        <a className="wizard__exit" href="/es/" aria-label="Salir y volver al inicio">
          <Icon name="close" />
        </a>
        <div
          className="wizard__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step + 1}
          aria-label={`Paso ${step + 1} de 4`}
        >
          <motion.span
            className="wizard__progress-bar"
            initial={false}
            animate={{ scaleX: (step + 1) / 4 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.45, bounce: 0 }}
          />
        </div>
        <p className="wizard__step">{`Paso ${step + 1} de 4`}</p>
      </header>

      <h1 className="wizard__page-title">¿Cuánto vale mi piso?</h1>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={step}
          className="wizard__panel"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="wizard__title" ref={titleRef} tabIndex={-1}>
            {step === 2 && answers.moment === 'herencia' ? '¿Qué lo complica? Cuéntanos' : titles[step]}
          </h2>

          {step === 0 && (
            <div className="wizard__options">
              {moments.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option"
                  aria-pressed={answers.moment === item.id}
                  onClick={() => {
                    setAnswers({ ...answers, moment: item.id });
                    go(1);
                  }}
                >
                  <span className="option__text">
                    <span className="option__label">{item.label}</span>
                    <span className="option__hint">{item.hint}</span>
                  </span>
                  <Icon name="arrow" className="option__icon" />
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <form className="wizard__form" onSubmit={submitAddress} noValidate>
              <label className="field">
                <span className="visually-hidden">Dirección del piso (obligatorio)</span>
                <input
                  id="valoracion-address"
                  className="field__control"
                  type="text"
                  autoComplete="street-address"
                  required
                  aria-required="true"
                  placeholder="Ej. Carrer de Mar 24, Malgrat"
                  value={answers.address}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={`${errors.address ? 'valoracion-address-error ' : ''}direccion-ayuda`}
                  onChange={(event) => setAnswers({ ...answers, address: event.target.value })}
                />
                {errors.address && <span className="field__error" id="valoracion-address-error" role="alert">{errors.address}</span>}
                <span className="field__hint" id="direccion-ayuda">
                  Con la calle sabemos a qué precio se está vendiendo de verdad en tu zona.
                </span>
              </label>
              <Button variant="primary" className="button--block" type="submit">
                Seguir
              </Button>
            </form>
          )}

          {step === 2 && answers.moment !== 'herencia' && (
            <div className="wizard__options">
              {conditions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option"
                  aria-pressed={answers.condition === item.id}
                  onClick={() => {
                    setAnswers({ ...answers, condition: item.id });
                    go(3);
                  }}
                >
                  <span className="option__label">{item.label}</span>
                  <Icon name="arrow" className="option__icon" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && answers.moment === 'herencia' && (
            <div className="wizard__options">
              {issues.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option"
                  aria-pressed={answers.issue === item.id}
                  onClick={() => {
                    if (item.id === 'otros') {
                      setAnswers({ ...answers, issue: 'otros' });
                      return;
                    }
                    setAnswers({ ...answers, issue: item.id });
                    go(3);
                  }}
                >
                  <span className="option__label">{item.label}</span>
                  <Icon name="arrow" className="option__icon" />
                </button>
              ))}
              {answers.issue === 'otros' && (
                <form
                  className="wizard__form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    go(3);
                  }}
                >
                  <label className="field">
                    <span className="field__label">Cuéntanos qué pasa</span>
                    <textarea
                      className="field__control"
                      rows={3}
                      placeholder="Ej. somos tres hermanos y queremos vender la casa de los padres"
                      value={answers.issueOther}
                      onChange={(event) => setAnswers({ ...answers, issueOther: event.target.value })}
                    />
                  </label>
                  <Button variant="primary" className="button--block" type="submit">
                    Seguir
                  </Button>
                </form>
              )}
            </div>
          )}

          {step === 3 && (
            <form className="wizard__form" onSubmit={submitContact} noValidate>
              <label className="field">
                <span className="field__label">Tu nombre <span aria-hidden="true">*</span></span>
                <input
                  id="valoracion-name"
                  required
                  aria-required="true"
                  aria-describedby={errors.name ? 'valoracion-name-error' : undefined}
                  className="field__control"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Ej. Ana"
                  value={answers.name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => setAnswers({ ...answers, name: event.target.value })}
                />
                {errors.name && <span className="field__error" id="valoracion-name-error" role="alert">{errors.name}</span>}
              </label>

              <div className="segmented" role="group" aria-label="Cómo prefieres que te contestemos">
                {(['whatsapp', 'llamada'] as Channel[]).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    className="segmented__option"
                    aria-pressed={answers.channel === channel}
                    onClick={() => setAnswers({ ...answers, channel })}
                  >
                    {answers.channel === channel && (
                      <motion.span
                        className="segmented__indicator"
                        layoutId="wizard-channel"
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.4, bounce: 0.3 }}
                      />
                    )}
                    {channel === 'whatsapp' ? 'Por WhatsApp' : 'Llamadme'}
                  </button>
                ))}
              </div>

              {answers.channel === 'llamada' && (
                <label className="field">
                  <span className="field__label">Tu teléfono <span aria-hidden="true">*</span></span>
                  <input
                    id="valoracion-phone"
                    required
                    aria-required="true"
                    aria-describedby={errors.phone ? 'valoracion-phone-error' : undefined}
                    className="field__control"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Ej. 612 345 678"
                    value={answers.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(event) => setAnswers({ ...answers, phone: event.target.value })}
                  />
                  {errors.phone && <span className="field__error" id="valoracion-phone-error" role="alert">{errors.phone}</span>}
                </label>
              )}

              <label className="check">
                <input
                  id="valoracion-privacy"
                  className="check__input"
                  type="checkbox"
                  required
                  aria-required="true"
                  aria-invalid={Boolean(errors.privacy)}
                  aria-describedby={errors.privacy ? 'valoracion-privacy-error' : undefined}
                  checked={answers.privacy}
                  onChange={(event) => setAnswers({ ...answers, privacy: event.target.checked })}
                />
                <span>
                  He leído la <a href="/es/privacidad/">política de privacidad</a>. <span aria-hidden="true">*</span>
                </span>
              </label>
              {errors.privacy && <span className="field__error" id="valoracion-privacy-error" role="alert">{errors.privacy}</span>}
              <label className="check">
                <input
                  className="check__input"
                  type="checkbox"
                  checked={answers.news}
                  onChange={(event) => setAnswers({ ...answers, news: event.target.checked })}
                />
                <span>Avisadme de novedades de mi zona (si quiero).</span>
              </label>

              <Button variant="primary" className="button--block" type="submit" isDisabled={sending}>
                {sending ? 'Enviando…' : 'Va, enviádmelo'}
              </Button>
              <p className="field__hint">
                {answers.channel === 'llamada'
                  ? 'Nos llega tu solicitud y te llamamos nosotros. No tienes que hacer nada más.'
                  : 'Guardamos tu solicitud y te damos un botón para seguir por WhatsApp.'}
              </p>
            </form>
          )}

          {step > 0 && (
            <button type="button" className="wizard__back" onClick={() => go(step - 1)}>
              <Icon name="back" className="button__icon" />
              Atrás
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {site.googleRating && (
        <p className="wizard__trust">
          {`${formatRating(site.googleRating.value)} sobre 5 en ${site.googleRating.count} reseñas de Google · Gratis y sin compromiso`}
        </p>
      )}
    </section>
  );
}
