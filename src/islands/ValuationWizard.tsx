import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Button } from '@heroui/react';
import { site } from '../data/site';
import { localizePath, strings, type Lang } from '../i18n';
import { formatRating } from '../lib/format';
import { createBrowserClient } from '../lib/supabase';
import { notifyLead, saveLead } from '../lib/leads';
import { Icon } from './Icon';
import { FlipLabel } from './FlipLabel';
import { LeadDone } from './LeadDone';

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

// Las claves (Moment, Condition, Issue, Channel) son internas; solo cambian las etiquetas por idioma.
const text = strings({
  es: {
    moments: {
      ya: { label: 'Quiero vender ya', hint: 'Te decimos precio y plan' },
      curiosidad: { label: 'Aún no, solo curiosidad', hint: 'Te orientamos y listo' },
      herencia: { label: 'Es una herencia o un lío', hint: 'Lo vemos con calma' },
    } as Record<Moment, { label: string; hint: string }>,
    conditions: {
      vivir: 'Para entrar a vivir',
      repaso: 'Necesita un repaso',
      reforma: 'Hay que reformarlo entero',
      nose: 'No lo sé',
    } as Record<Condition, string>,
    issues: {
      herencia: 'Es una herencia',
      'no-escriturada': 'No está escriturada',
      'sin-cedula': 'No tengo cédula de habitabilidad',
      documentacion: 'No sé qué documentación o impuestos necesito',
      otros: 'Otros, te lo cuento',
    } as Record<Issue, string>,
    // Textos del mensaje (WhatsApp y lead), en el idioma del visitante.
    issueText: {
      herencia: 'es una herencia',
      'no-escriturada': 'no está escriturada',
      'sin-cedula': 'no tiene cédula de habitabilidad',
      documentacion: 'no sé qué documentación o impuestos necesito',
      otros: 'otra situación',
    } as Record<Issue, string>,
    momentText: {
      ya: 'Quiero vender ya',
      curiosidad: 'De momento solo quiero saber cuánto vale',
      herencia: 'Es una herencia o una situación complicada',
    } as Record<Moment, string>,
    conditionText: {
      vivir: 'para entrar a vivir',
      repaso: 'necesita un repaso',
      reforma: 'hay que reformarlo entero',
      nose: 'no sé en qué estado está',
    } as Record<Condition, string>,
    message: {
      hello: (name: string) => `Hola, soy ${name}. Quiero saber cuánto vale mi piso.`,
      address: 'Dirección',
      moment: 'Situación',
      issue: 'Qué lo complica',
      condition: 'Estado',
      callMe: (phone: string) => `Prefiero que me llaméis al ${phone}`,
      whatsapp: 'Prefiero WhatsApp',
      news: 'Sí quiero recibir novedades de mi zona.',
    },
    titles: [
      'Vale, cuéntanos. ¿Cómo lo tienes?',
      '¿Dónde está el piso?',
      '¡Estás a un paso! ¿Cómo está por dentro?',
      'Último paso. ¿Cómo te contestamos?',
    ],
    issueTitle: '¿Qué lo complica? Cuéntanos',
    errors: {
      address: 'Pon la calle y el número, aunque sea aproximado.',
      name: 'Dinos cómo te llamas.',
      phone: 'Ese teléfono no parece completo. Revísalo.',
      privacy: 'Necesitamos que aceptes la política de privacidad para contestarte.',
    },
    pageTitle: '¿Cuánto vale mi piso?',
    done: {
      notSavedTitle: 'Uy, tu solicitud no nos ha llegado.',
      callTitle: (name: string) => `¡Gracias, ${name}! Te llamamos nosotros.`,
      waTitle: (name: string) => `¡Gracias, ${name}! Te escribimos por WhatsApp.`,
      notSavedText:
        'Algo ha fallado al enviarla. Mándanosla por WhatsApp, que ya está escrita: solo tienes que darle a enviar.',
      callText:
        'Ya tenemos la dirección del piso. Miramos a qué precio se está vendiendo de verdad en tu zona y te llamamos lo más pronto posible.',
      waText:
        'Ya tenemos la dirección del piso. Miramos a qué precio se está vendiendo de verdad en tu zona y te escribimos lo más pronto posible.',
      phone: '¿Te corre prisa? Llámanos al',
      failPhone: 'O llámanos al',
      continueWa: 'Enviar por WhatsApp',
      browse: 'Ver pisos en venta mientras tanto',
      home: 'Volver al inicio',
    },
    sectionLabel: 'Valoración de tu piso',
    exit: 'Salir y volver al inicio',
    step: (n: number) => `Paso ${n} de 4`,
    addressLabel: 'Dirección del piso (obligatorio)',
    addressPlaceholder: 'Ej. Carrer de Mar 24, Malgrat',
    addressHint: 'Con la calle sabemos a qué precio se está vendiendo de verdad en tu zona.',
    next: 'Seguir',
    otherLabel: 'Cuéntanos qué pasa',
    otherPlaceholder: 'Ej. somos tres hermanos y queremos vender la casa de los padres',
    nameLabel: 'Tu nombre',
    namePlaceholder: 'Ej. Ana',
    channelLabel: 'Cómo prefieres que te contestemos',
    byWhatsapp: 'Por WhatsApp',
    callMe: 'Llamadme',
    phoneLabel: 'Tu teléfono',
    phonePlaceholder: 'Ej. 612 345 678',
    privacyBefore: 'He leído la',
    privacyLink: 'política de privacidad',
    news: 'Avisadme de novedades de mi zona (si quiero).',
    sending: 'Enviando…',
    submit: 'Va, enviádmelo',
    callHint: 'Nos llega tu solicitud y te llamamos nosotros. No tienes que hacer nada más.',
    waHint: 'Nos llega tu solicitud y te escribimos nosotros por WhatsApp. No tienes que hacer nada más.',
    back: 'Atrás',
    trust: (rating: string, count: number) => `${rating} sobre 5 en ${count} reseñas de Google · Gratis y sin compromiso`,
  },
  en: {
    moments: {
      ya: { label: 'I want to sell now', hint: 'We give you a price and a plan' },
      curiosidad: { label: 'Not yet, just curious', hint: 'We give you a rough idea, that’s all' },
      herencia: { label: 'It’s an inheritance or it’s complicated', hint: 'We go through it calmly' },
    },
    conditions: {
      vivir: 'Ready to move into',
      repaso: 'Needs some freshening up',
      reforma: 'Needs a full renovation',
      nose: 'I’m not sure',
    },
    issues: {
      herencia: 'It’s an inheritance',
      'no-escriturada': 'There are no title deeds',
      'sin-cedula': 'I don’t have the cédula (habitability certificate)',
      documentacion: 'I don’t know what paperwork or taxes I need',
      otros: 'Something else, I’ll explain',
    },
    issueText: {
      herencia: 'it’s an inheritance',
      'no-escriturada': 'there are no title deeds',
      'sin-cedula': 'it has no cédula de habitabilidad',
      documentacion: 'I don’t know what paperwork or taxes I need',
      otros: 'something else',
    },
    momentText: {
      ya: 'I want to sell now',
      curiosidad: 'For now I just want to know what it’s worth',
      herencia: 'It’s an inheritance or a complicated situation',
    },
    conditionText: {
      vivir: 'ready to move into',
      repaso: 'needs some freshening up',
      reforma: 'needs a full renovation',
      nose: 'not sure what condition it’s in',
    },
    message: {
      hello: (name: string) => `Hi, I’m ${name}. I’d like to know what my home is worth.`,
      address: 'Address',
      moment: 'Situation',
      issue: 'What makes it complicated',
      condition: 'Condition',
      callMe: (phone: string) => `I’d rather you called me on ${phone}`,
      whatsapp: 'I prefer WhatsApp',
      news: 'Yes, I’d like news about my area.',
    },
    titles: [
      'Right, tell us. Where are you at?',
      'Where’s the property?',
      'Almost there. What’s it like inside?',
      'Last step. How should we get back to you?',
    ],
    issueTitle: 'What makes it complicated? Tell us',
    errors: {
      address: 'Put the street and number, even if it’s rough.',
      name: 'Tell us your name.',
      phone: 'That number doesn’t look complete. Check it.',
      privacy: 'We need you to accept the privacy policy before we can reply.',
    },
    pageTitle: 'What’s my home worth?',
    done: {
      notSavedTitle: 'Oops, your request didn’t reach us.',
      callTitle: (name: string) => `Thanks, ${name}! We’ll give you a call.`,
      waTitle: (name: string) => `Thanks, ${name}! We’ll message you on WhatsApp.`,
      notSavedText:
        'Something went wrong sending it. Send it on WhatsApp instead; it’s already written, you just need to hit send.',
      callText:
        'We’ve got the property’s address. We’ll check what homes are really selling for in your area and call you as soon as we can.',
      waText:
        'We’ve got the property’s address. We’ll check what homes are really selling for in your area and message you as soon as we can.',
      phone: 'In a hurry? Call us on',
      failPhone: 'Or call us on',
      continueWa: 'Send on WhatsApp',
      browse: 'Browse homes for sale in the meantime',
      home: 'Back to the home page',
    },
    sectionLabel: 'Your home valuation',
    exit: 'Leave and go back to the home page',
    step: (n: number) => `Step ${n} of 4`,
    addressLabel: 'Property address (required)',
    addressPlaceholder: 'E.g. Carrer de Mar 24, Malgrat',
    addressHint: 'The street tells us what homes are really selling for in your area.',
    next: 'Next',
    otherLabel: 'Tell us what’s going on',
    otherPlaceholder: 'E.g. there are three of us and we want to sell our parents’ house',
    nameLabel: 'Your name',
    namePlaceholder: 'E.g. Anna',
    channelLabel: 'How you’d like us to reply',
    byWhatsapp: 'On WhatsApp',
    callMe: 'Call me',
    phoneLabel: 'Your phone number',
    phonePlaceholder: 'E.g. +44 7700 900123',
    privacyBefore: 'I’ve read the',
    privacyLink: 'privacy policy',
    news: 'Let me know about news in my area (optional).',
    sending: 'Sending…',
    submit: 'Go on, send it to me',
    callHint: 'Your request comes straight to us and we call you. You don’t need to do anything else.',
    waHint: 'Your request comes straight to us and we message you on WhatsApp. You don’t need to do anything else.',
    back: 'Back',
    trust: (rating: string, count: number) => `${rating} out of 5 from ${count} Google reviews · Free, no obligation`,
  },
  ca: {
    moments: {
      ya: { label: 'Vull vendre ja', hint: 'Et diem preu i pla' },
      curiosidad: { label: 'Encara no, només curiositat', hint: 'T’orientem i llestos' },
      herencia: { label: 'És una herència o un embolic', hint: 'Ho mirem amb calma' },
    },
    conditions: {
      vivir: 'Per entrar a viure',
      repaso: 'Necessita una repassada',
      reforma: 'Cal reformar-lo sencer',
      nose: 'No ho sé',
    },
    issues: {
      herencia: 'És una herència',
      'no-escriturada': 'No està escripturada',
      'sin-cedula': 'No tinc cèdula d’habitabilitat',
      documentacion: 'No sé quina documentació o impostos necessito',
      otros: 'Una altra cosa, t’ho explico',
    },
    issueText: {
      herencia: 'és una herència',
      'no-escriturada': 'no està escripturada',
      'sin-cedula': 'no té cèdula d’habitabilitat',
      documentacion: 'no sé quina documentació o impostos necessito',
      otros: 'una altra situació',
    },
    momentText: {
      ya: 'Vull vendre ja',
      curiosidad: 'De moment només vull saber quant val',
      herencia: 'És una herència o una situació complicada',
    },
    conditionText: {
      vivir: 'per entrar a viure',
      repaso: 'necessita una repassada',
      reforma: 'cal reformar-lo sencer',
      nose: 'no sé en quin estat està',
    },
    message: {
      hello: (name: string) => `Hola, soc ${name}. Vull saber quant val el meu pis.`,
      address: 'Adreça',
      moment: 'Situació',
      issue: 'Què ho complica',
      condition: 'Estat',
      callMe: (phone: string) => `Prefereixo que em truqueu al ${phone}`,
      whatsapp: 'Prefereixo WhatsApp',
      news: 'Sí que vull rebre novetats de la meva zona.',
    },
    titles: [
      'Va, explica’ns. Com ho tens?',
      'On és el pis?',
      'Estàs a un pas! Com està per dins?',
      'Últim pas. Com et responem?',
    ],
    issueTitle: 'Què ho complica? Explica’ns-ho',
    errors: {
      address: 'Posa el carrer i el número, encara que sigui aproximat.',
      name: 'Digues-nos com et dius.',
      phone: 'Aquest telèfon no sembla complet. Revisa’l.',
      privacy: 'Cal que acceptis la política de privacitat perquè et puguem respondre.',
    },
    pageTitle: 'Quant val el meu pis?',
    done: {
      notSavedTitle: 'Vaja, la teva sol·licitud no ens ha arribat.',
      callTitle: (name: string) => `Gràcies, ${name}! Et truquem nosaltres.`,
      waTitle: (name: string) => `Gràcies, ${name}! T’escrivim per WhatsApp.`,
      notSavedText:
        'Alguna cosa ha fallat en enviar-la. Envia’ns-la per WhatsApp, que ja està escrita: només has de prémer enviar.',
      callText:
        'Ja tenim l’adreça del pis. Mirem a quin preu s’està venent de debò a la teva zona i et truquem tan aviat com puguem.',
      waText:
        'Ja tenim l’adreça del pis. Mirem a quin preu s’està venent de debò a la teva zona i t’escrivim tan aviat com puguem.',
      phone: 'Tens pressa? Truca’ns al',
      failPhone: 'O truca’ns al',
      continueWa: 'Envia per WhatsApp',
      browse: 'Mira pisos en venda mentrestant',
      home: 'Torna a l’inici',
    },
    sectionLabel: 'Valoració del teu pis',
    exit: 'Surt i torna a l’inici',
    step: (n: number) => `Pas ${n} de 4`,
    addressLabel: 'Adreça del pis (obligatori)',
    addressPlaceholder: 'Ex. Carrer de Mar 24, Malgrat',
    addressHint: 'Amb el carrer sabem a quin preu s’està venent de debò a la teva zona.',
    next: 'Continua',
    otherLabel: 'Explica’ns què passa',
    otherPlaceholder: 'Ex. som tres germans i volem vendre la casa dels pares',
    nameLabel: 'El teu nom',
    namePlaceholder: 'Ex. Anna',
    channelLabel: 'Com prefereixes que et responguem',
    byWhatsapp: 'Per WhatsApp',
    callMe: 'Truqueu-me',
    phoneLabel: 'El teu telèfon',
    phonePlaceholder: 'Ex. 612 345 678',
    privacyBefore: 'He llegit la',
    privacyLink: 'política de privacitat',
    news: 'Aviseu-me de novetats de la meva zona (si vull).',
    sending: 'Enviant…',
    submit: 'Va, envieu-m’ho',
    callHint: 'Ens arriba la teva sol·licitud i et truquem nosaltres. No has de fer res més.',
    waHint: 'Ens arriba la teva sol·licitud i t’escrivim nosaltres per WhatsApp. No has de fer res més.',
    back: 'Enrere',
    trust: (rating: string, count: number) => `${rating} sobre 5 en ${count} ressenyes de Google · Gratis i sense compromís`,
  },
});

type Text = (typeof text)['es'];

const momentIds: Moment[] = ['ya', 'curiosidad', 'herencia'];
const conditionIds: Condition[] = ['vivir', 'repaso', 'reforma', 'nose'];
const issueIds: Issue[] = ['herencia', 'no-escriturada', 'sin-cedula', 'documentacion', 'otros'];

function buildMessage(answers: Answers, t: Text): string {
  const m = t.message;
  const lines = [
    m.hello(answers.name.trim()),
    `${m.address}: ${answers.address.trim()}`,
    answers.moment ? `${m.moment}: ${t.momentText[answers.moment]}` : '',
    answers.moment === 'herencia' && answers.issue
      ? `${m.issue}: ${answers.issue === 'otros' ? answers.issueOther.trim() || t.issueText.otros : t.issueText[answers.issue]}`
      : '',
    answers.condition ? `${m.condition}: ${t.conditionText[answers.condition]}` : '',
    answers.channel === 'llamada' ? m.callMe(answers.phone.trim()) : m.whatsapp,
    answers.news ? m.news : '',
  ];
  return lines.filter(Boolean).join('\n');
}

// Para el correo a la oficina: siempre en español, aunque la web esté en otro idioma.
function emailDetails(answers: Answers): Record<string, string> {
  const es = text.es;
  const details: Record<string, string> = {};
  if (answers.moment) details[es.message.moment] = es.momentText[answers.moment];
  if (answers.moment === 'herencia' && answers.issue)
    details[es.message.issue] =
      answers.issue === 'otros' ? answers.issueOther.trim() || es.issueText.otros : es.issueText[answers.issue];
  if (answers.condition) details[es.message.condition] = es.conditionText[answers.condition];
  details['Quiere novedades de su zona'] = answers.news ? 'Sí' : 'No';
  return details;
}

function isValidPhone(value: string): boolean {
  return /^(\+?\d[\d\s]{7,14})$/.test(value.trim());
}

export default function ValuationWizard({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [doneOpen, setDoneOpen] = useState(true);
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
      setErrors({ address: t.errors.address });
      document.getElementById('valoracion-address')?.focus();
      return;
    }
    go(2);
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (answers.name.trim().length < 2) next.name = t.errors.name;
    if (!isValidPhone(answers.phone)) {
      next.phone = t.errors.phone;
    }
    if (!answers.privacy) next.privacy = t.errors.privacy;
    setErrors(next);
    const first = (['name', 'phone', 'privacy'] as const).find((k) => next[k]);
    if (first) {
      document.getElementById(`valoracion-${first}`)?.focus();
      return;
    }
    if (sending) return;
    setSending(true);

    // Se guarda en Supabase y se avisa por correo a gestion@ a la vez (public/api/aviso-lead.php).
    // Insert directo en Supabase (web estática, sin Worker): anon key + policy RLS solo-INSERT.
    const [stored, mailed] = await Promise.all([saveLead(() =>
      createBrowserClient()
        .from('lead')
        .insert({
          name: answers.name.trim(),
          phone: answers.phone.trim(),
          // El idioma de la web va al final del mensaje (campo libre): el esquema no cambia.
          message: buildMessage(answers, t) + (lang === 'es' ? '' : `\nIdioma de la web: ${lang}`),
          intent: 'valoracion',
          source: 'valoracion',
          zone: answers.address.trim().slice(0, 120) || null, // la policy acota zone a 120
          status: 'nuevo',
          consent_marketing: answers.news, // la casilla de novedades sí es consentimiento de marketing
          consent_at: new Date().toISOString(),
          consent_source: 'valoracion',
        }),
    ), notifyLead({
      form: 'valoracion',
      name: answers.name.trim(),
      phone: answers.phone.trim(),
      address: answers.address.trim(),
      channel: answers.channel === 'llamada' ? 'Llamada' : 'WhatsApp',
      details: emailDetails(answers),
      lang,
    })]);

    // Recibido si llegó por cualquiera de las dos vías: la base de datos o el correo.
    setSaved(stored || mailed);
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
    const firstName = answers.name.trim().split(' ')[0];
    const title = !saved ? t.done.notSavedTitle : callMe ? t.done.callTitle(firstName) : t.done.waTitle(firstName);
    const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(buildMessage(answers, t))}`;
    const waButton = (
      <a
        className="button button--primary button--large button--block"
        href={waHref}
        target="_blank"
        rel="noopener"
        data-contact="whatsapp"
        data-origin="valoracion-fallo"
      >
        <FlipLabel>{t.done.continueWa}</FlipLabel>
      </a>
    );
    const browse = (
      <a className="link-cta" href={localizePath('/es/venta/malgrat-de-mar/', lang)}>
        {t.done.browse}
      </a>
    );
    return (
      // Detrás de la confirmación queda la misma pantalla final, por si se cierra.
      <section className="wizard wizard--done" aria-live="polite">
        <h1 className="visually-hidden">{t.pageTitle}</h1>
        {doneOpen && (
          <LeadDone
            lang={lang}
            ok={saved}
            title={title}
            text={!saved ? t.done.notSavedText : callMe ? t.done.callText : t.done.waText}
            phoneLead={saved ? t.done.phone : t.done.failPhone}
            origin={saved ? 'valoracion-fin' : 'valoracion-fallo'}
            onClose={() => setDoneOpen(false)}
          >
            {saved ? (
              <a className="button button--primary button--large button--block" href={localizePath('/es/', lang)}>
                {t.done.home}
              </a>
            ) : (
              waButton
            )}
            {browse}
          </LeadDone>
        )}
        <h2 className="wizard__title">{title}</h2>
        {!saved && waButton}
        {browse}
      </section>
    );
  }

  return (
    <section className="wizard" aria-label={t.sectionLabel}>
      <header className="wizard__header">
        <a className="wizard__exit" href={localizePath('/es/', lang)} aria-label={t.exit}>
          <Icon name="close" />
        </a>
        <div
          className="wizard__progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step + 1}
          aria-label={t.step(step + 1)}
        >
          <motion.span
            className="wizard__progress-bar"
            initial={false}
            animate={{ scaleX: (step + 1) / 4 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.45, bounce: 0 }}
          />
        </div>
        <p className="wizard__step">{t.step(step + 1)}</p>
      </header>

      <h1 className="wizard__page-title">{t.pageTitle}</h1>

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
            {step === 2 && answers.moment === 'herencia' ? t.issueTitle : t.titles[step]}
          </h2>

          {step === 0 && (
            <div className="wizard__options">
              {momentIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="option"
                  aria-pressed={answers.moment === id}
                  onClick={() => {
                    setAnswers({ ...answers, moment: id });
                    go(1);
                  }}
                >
                  <span className="option__text">
                    <span className="option__label">{t.moments[id].label}</span>
                    <span className="option__hint">{t.moments[id].hint}</span>
                  </span>
                  <Icon name="arrow" className="option__icon" />
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <form className="wizard__form" onSubmit={submitAddress} noValidate>
              <label className="field">
                <span className="visually-hidden">{t.addressLabel}</span>
                <input
                  id="valoracion-address"
                  className="field__control"
                  type="text"
                  autoComplete="street-address"
                  required
                  aria-required="true"
                  placeholder={t.addressPlaceholder}
                  value={answers.address}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={`${errors.address ? 'valoracion-address-error ' : ''}direccion-ayuda`}
                  onChange={(event) => setAnswers({ ...answers, address: event.target.value })}
                />
                {errors.address && <span className="field__error" id="valoracion-address-error" role="alert">{errors.address}</span>}
                <span className="field__hint" id="direccion-ayuda">
                  {t.addressHint}
                </span>
              </label>
              <Button variant="primary" className="button--block" type="submit">
                {t.next}
              </Button>
            </form>
          )}

          {step === 2 && answers.moment !== 'herencia' && (
            <div className="wizard__options">
              {conditionIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="option"
                  aria-pressed={answers.condition === id}
                  onClick={() => {
                    setAnswers({ ...answers, condition: id });
                    go(3);
                  }}
                >
                  <span className="option__label">{t.conditions[id]}</span>
                  <Icon name="arrow" className="option__icon" />
                </button>
              ))}
            </div>
          )}

          {step === 2 && answers.moment === 'herencia' && (
            <div className="wizard__options">
              {issueIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="option"
                  aria-pressed={answers.issue === id}
                  onClick={() => {
                    if (id === 'otros') {
                      setAnswers({ ...answers, issue: 'otros' });
                      return;
                    }
                    setAnswers({ ...answers, issue: id });
                    go(3);
                  }}
                >
                  <span className="option__label">{t.issues[id]}</span>
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
                    <span className="field__label">{t.otherLabel}</span>
                    <textarea
                      className="field__control"
                      rows={3}
                      placeholder={t.otherPlaceholder}
                      value={answers.issueOther}
                      onChange={(event) => setAnswers({ ...answers, issueOther: event.target.value })}
                    />
                  </label>
                  <Button variant="primary" className="button--block" type="submit">
                    {t.next}
                  </Button>
                </form>
              )}
            </div>
          )}

          {step === 3 && (
            <form className="wizard__form" onSubmit={submitContact} noValidate>
              <label className="field">
                <span className="field__label">{t.nameLabel} <span aria-hidden="true">*</span></span>
                <input
                  id="valoracion-name"
                  required
                  aria-required="true"
                  aria-describedby={errors.name ? 'valoracion-name-error' : undefined}
                  className="field__control"
                  type="text"
                  autoComplete="given-name"
                  placeholder={t.namePlaceholder}
                  value={answers.name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => setAnswers({ ...answers, name: event.target.value })}
                />
                {errors.name && <span className="field__error" id="valoracion-name-error" role="alert">{errors.name}</span>}
              </label>

              <div className="segmented" role="group" aria-label={t.channelLabel}>
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
                    {channel === 'whatsapp' ? t.byWhatsapp : t.callMe}
                  </button>
                ))}
              </div>

              <label className="field">
                <span className="field__label">{t.phoneLabel} <span aria-hidden="true">*</span></span>
                <input
                  id="valoracion-phone"
                  required
                  aria-required="true"
                  aria-describedby={errors.phone ? 'valoracion-phone-error' : undefined}
                  className="field__control"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t.phonePlaceholder}
                  value={answers.phone}
                  aria-invalid={Boolean(errors.phone)}
                  onChange={(event) => setAnswers({ ...answers, phone: event.target.value })}
                />
                {errors.phone && <span className="field__error" id="valoracion-phone-error" role="alert">{errors.phone}</span>}
              </label>

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
                  {t.privacyBefore} <a href={localizePath('/es/privacidad/', lang)}>{t.privacyLink}</a>. <span aria-hidden="true">*</span>
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
                <span>{t.news}</span>
              </label>

              <Button variant="primary" className="button--block" type="submit" isDisabled={sending}>
                {sending ? t.sending : t.submit}
              </Button>
              <p className="field__hint">
                {answers.channel === 'llamada'
                  ? t.callHint
                  : t.waHint}
              </p>
            </form>
          )}

          {step > 0 && (
            <button type="button" className="wizard__back" onClick={() => go(step - 1)}>
              <Icon name="back" className="button__icon" />
              {t.back}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      {site.googleRating && (
        <p className="wizard__trust">
          {t.trust(formatRating(site.googleRating.value, lang), site.googleRating.count)}
        </p>
      )}
    </section>
  );
}
