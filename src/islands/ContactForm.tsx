import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@heroui/react';
import { site } from '../data/site';
import { createBrowserClient } from '../lib/supabase';
import { notifyLead, saveLead } from '../lib/leads';
import { FlipLabel } from './FlipLabel';
import { LeadDone } from './LeadDone';
import { localizePath, strings, type Lang } from '../i18n';

// `intent` es el valor que se guarda en Supabase: no se traduce. `wa` es la línea del WhatsApp.
type Intent = 'comprar' | 'vender' | 'alquilar' | 'reformar' | 'otro';
const intents: Intent[] = ['comprar', 'vender', 'alquilar', 'reformar', 'otro'];

const text = strings({
  es: {
    needs: { comprar: 'Comprar', vender: 'Vender', alquilar: 'Alquilar', reformar: 'Reformar', otro: 'Otra cosa' },
    wa: {
      comprar: 'Necesito: comprar.',
      vender: 'Necesito: vender.',
      alquilar: 'Necesito: alquilar.',
      reformar: 'Necesito: reformar.',
      otro: 'Necesito: otra cosa.',
    },
    hello: (name: string) => `Hola, soy ${name}.`,
    errName: 'Dinos cómo te llamas.',
    errPhone: 'Déjanos un teléfono para poder contestarte.',
    errPrivacy: 'Necesitamos que aceptes la política de privacidad para contestarte.',
    savedTitle: (name: string) => `¡Gracias, ${name}! Ya nos ha llegado.`,
    savedText: 'Te respondemos lo más pronto posible al número que nos has dejado, por llamada o por WhatsApp.',
    savedPhone: '¿Te corre prisa? Llámanos al',
    failTitle: 'Uy, tu mensaje no nos ha llegado.',
    failText: 'Algo ha fallado al enviarlo. Mándanoslo por WhatsApp, que ya está escrito: solo tienes que darle a enviar.',
    failPhone: 'O llámanos al',
    continueWa: 'Enviar por WhatsApp',
    backToSite: 'Volver a la web',
    backToForm: 'Volver al formulario',
    name: 'Nombre',
    namePlaceholder: 'Ej. Ana',
    phone: 'Teléfono',
    phonePlaceholder: 'Ej. 612 345 678',
    phoneHint: 'Te contestamos a este número, por llamada o WhatsApp.',
    need: '¿Qué necesitas?',
    message: 'Cuéntanos (si quieres)',
    messagePlaceholder: 'Ej. Busco un piso de 3 habitaciones cerca de la playa',
    honeypot: 'No rellenar',
    privacyBefore: 'He leído la',
    privacyLink: 'política de privacidad',
    submit: 'Enviar',
    submitHint: 'Nos llega al momento y te respondemos lo más pronto posible.',
  },
  en: {
    needs: { comprar: 'Buy', vender: 'Sell', alquilar: 'Rent', reformar: 'Renovate', otro: 'Something else' },
    wa: {
      comprar: 'I’m looking to buy.',
      vender: 'I’m looking to sell.',
      alquilar: 'I’m looking to rent.',
      reformar: 'I’m looking to renovate.',
      otro: 'It’s about something else.',
    },
    hello: (name: string) => `Hi, I’m ${name}.`,
    errName: 'Tell us your name.',
    errPhone: 'Leave us a phone number so we can get back to you.',
    errPrivacy: 'We need you to accept the privacy policy before we can reply.',
    savedTitle: (name: string) => `Thanks, ${name}! We’ve got your message.`,
    savedText: 'We’ll get back to you as soon as we can on the number you gave us, by phone or WhatsApp.',
    savedPhone: 'In a hurry? Call us on',
    failTitle: 'Oops, your message didn’t reach us.',
    failText: 'Something went wrong sending it. Send it on WhatsApp instead; it’s already written, you just need to hit send.',
    failPhone: 'Or call us on',
    continueWa: 'Send on WhatsApp',
    backToSite: 'Back to the site',
    backToForm: 'Back to the form',
    name: 'Name',
    namePlaceholder: 'e.g. Ana',
    phone: 'Phone',
    phonePlaceholder: 'e.g. 612 345 678',
    phoneHint: 'We’ll reply on this number, by phone or WhatsApp.',
    need: 'What do you need?',
    message: 'Tell us more (if you like)',
    messagePlaceholder: 'e.g. I’m looking for a 3-bedroom apartment near the beach',
    honeypot: 'Do not fill in',
    privacyBefore: 'I’ve read the',
    privacyLink: 'privacy policy',
    submit: 'Send',
    submitHint: 'It reaches us straight away and we’ll get back to you as soon as we can.',
  },
  ca: {
    needs: { comprar: 'Comprar', vender: 'Vendre', alquilar: 'Llogar', reformar: 'Reformar', otro: 'Una altra cosa' },
    wa: {
      comprar: 'Necessito: comprar.',
      vender: 'Necessito: vendre.',
      alquilar: 'Necessito: llogar.',
      reformar: 'Necessito: reformar.',
      otro: 'Necessito: una altra cosa.',
    },
    hello: (name: string) => `Hola, soc ${name}.`,
    errName: 'Digues-nos com et dius.',
    errPhone: 'Deixa’ns un telèfon per poder-te respondre.',
    errPrivacy: 'Cal que acceptis la política de privacitat perquè et puguem respondre.',
    savedTitle: (name: string) => `Gràcies, ${name}! Ja ens ha arribat.`,
    savedText: 'Et responem tan aviat com puguem al número que ens has deixat, per trucada o per WhatsApp.',
    savedPhone: 'Tens pressa? Truca’ns al',
    failTitle: 'Vaja, el teu missatge no ens ha arribat.',
    failText: 'Alguna cosa ha fallat en enviar-lo. Envia’ns-el per WhatsApp, que ja està escrit: només has de prémer enviar.',
    failPhone: 'O truca’ns al',
    continueWa: 'Envia per WhatsApp',
    backToSite: 'Torna al web',
    backToForm: 'Torna al formulari',
    name: 'Nom',
    namePlaceholder: 'Ex. Anna',
    phone: 'Telèfon',
    phonePlaceholder: 'Ex. 612 345 678',
    phoneHint: 'Et responem a aquest número, per trucada o WhatsApp.',
    need: 'Què necessites?',
    message: 'Explica’ns-ho (si vols)',
    messagePlaceholder: 'Ex. Busco un pis de 3 habitacions a prop de la platja',
    honeypot: 'No ho omplis',
    privacyBefore: 'He llegit la',
    privacyLink: 'política de privacitat',
    submit: 'Envia',
    submitHint: 'Ens arriba a l’instant i et responem tan aviat com puguem.',
  },
});

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [need, setNeed] = useState<Intent>(intents[0]);
  const [message, setMessage] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [company, setCompany] = useState(''); // honeypot (oculto); los humanos lo dejan vacío
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = t.errName;
    if (!/^(\+?\d[\d\s]{7,14})$/.test(phone.trim())) next.phone = t.errPhone;
    if (!privacy) next.privacy = t.errPrivacy;
    setErrors(next);
    const first = (['name', 'phone', 'privacy'] as const).find((k) => next[k]);
    if (first) {
      document.getElementById(`contacto-${first}`)?.focus();
      return;
    }

    // Guardamos el lead directo en Supabase (web estática: sin Worker). Insert con anon key y
    // policy RLS solo-INSERT (migrations/0003). El honeypot filtra bots: si está relleno, no se
    // guarda. Si no se guarda, la pantalla final NO dice «Recibido»: manda a WhatsApp.
    // Bots (honeypot relleno): no se guarda, pero ven la pantalla normal.
    const lead = { name: name.trim(), phone: phone.trim(), message: message.trim(), intent: need };
    const [stored, mailed] = company.trim()
      ? [true, true]
      : await Promise.all([saveLead(() =>
          createBrowserClient()
            .from('lead')
            .insert({
              name: name.trim(),
              phone: phone.trim(),
              message: message.trim() || null,
              intent: need,
              source: 'web',
              status: 'nuevo',
              consent_marketing: false, // aceptar privacidad ≠ consentimiento de marketing
              consent_at: new Date().toISOString(),
              consent_source: 'web',
            }),
        ), notifyLead({ form: 'contacto', ...lead, intent: text.es.needs[need], lang })]);
    // Recibido si llegó por cualquiera de las dos vías: la base de datos o el correo.
    setSaved(stored || mailed);
    setSent(true);
  }

  // Enlace real (no window.open): funciona en iOS y el listener global de BaseLayout lo mide.
  const waLines = [t.hello(name.trim()), t.wa[need], message.trim()];
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waLines.filter(Boolean).join('\n'))}`;

  function close() {
    // Si llegó, el formulario vuelve vacío; si no, conserva lo escrito para reintentar.
    if (saved) {
      setName('');
      setPhone('');
      setNeed(intents[0]);
      setMessage('');
      setPrivacy(false);
    }
    setSent(false);
  }

  return (
    <>
    {sent && (
      <LeadDone
        lang={lang}
        ok={saved}
        title={saved ? t.savedTitle(name.trim().split(' ')[0]) : t.failTitle}
        text={saved ? t.savedText : t.failText}
        phoneLead={saved ? t.savedPhone : t.failPhone}
        origin={saved ? 'formulario-contacto' : 'formulario-contacto-fallo'}
        onClose={close}
      >
        {saved ? (
          <Button variant="primary" className="button--large button--block" onPress={close}>
            {t.backToSite}
          </Button>
        ) : (
          <>
            <a
              className="button button--primary button--large button--block"
              href={waHref}
              target="_blank"
              rel="noopener"
              data-contact="whatsapp"
              data-origin="formulario-contacto-fallo"
            >
              <FlipLabel>{t.continueWa}</FlipLabel>
            </a>
            <button type="button" className="link-cta" onClick={close}>
              {t.backToForm}
            </button>
          </>
        )}
      </LeadDone>
    )}
    <form className="contact-form" onSubmit={submit} noValidate>
      <label className="field">
        <span className="field__label">{t.name} <span aria-hidden="true">*</span></span>
        <input
          id="contacto-name"
          className="field__control"
          type="text"
          autoComplete="given-name"
          placeholder={t.namePlaceholder}
          value={name}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contacto-name-error' : undefined}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <span className="field__error" id="contacto-name-error" role="alert">{errors.name}</span>}
      </label>
      <label className="field">
        <span className="field__label">{t.phone} <span aria-hidden="true">*</span></span>
        <input
          id="contacto-phone"
          className="field__control"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.phonePlaceholder}
          value={phone}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={`${errors.phone ? 'contacto-phone-error ' : ''}contacto-telefono-ayuda`}
          onChange={(event) => setPhone(event.target.value)}
        />
        {errors.phone && <span className="field__error" id="contacto-phone-error" role="alert">{errors.phone}</span>}
        <span className="field__hint" id="contacto-telefono-ayuda">
          {t.phoneHint}
        </span>
      </label>
      <label className="field">
        <span className="field__label">{t.need}</span>
        <select className="field__control" value={need} onChange={(event) => setNeed(event.target.value as Intent)}>
          {intents.map((item) => (
            <option key={item} value={item}>
              {t.needs[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field__label">{t.message}</span>
        <textarea
          className="field__control"
          placeholder={t.messagePlaceholder}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      {/* Campo trampa anti-spam: oculto para personas, invisible en pantalla y lectores. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          {t.honeypot}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>
      </div>
      <label className="check">
        <input
          id="contacto-privacy"
          className="check__input"
          type="checkbox"
          required
          aria-required="true"
          aria-invalid={Boolean(errors.privacy)}
          aria-describedby={errors.privacy ? 'contacto-privacy-error' : undefined}
          checked={privacy}
          onChange={(event) => setPrivacy(event.target.checked)}
        />
        <span>
          {t.privacyBefore} <a href={localizePath('/es/privacidad/', lang)}>{t.privacyLink}</a>. <span aria-hidden="true">*</span>
        </span>
      </label>
      {errors.privacy && <span className="field__error" id="contacto-privacy-error" role="alert">{errors.privacy}</span>}
      <Button variant="primary" className="button--large button--block" type="submit">
        {t.submit}
      </Button>
      <p className="field__hint">{t.submitHint}</p>
    </form>
    </>
  );
}
