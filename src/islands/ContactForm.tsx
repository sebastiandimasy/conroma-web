import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@heroui/react';
import { site } from '../data/site';
import { createBrowserClient } from '../lib/supabase';
import { FlipLabel } from './FlipLabel';

const needs = ['Comprar', 'Vender', 'Alquilar', 'Reformar', 'Otra cosa'];
const intentByNeed: Record<string, string> = {
  Comprar: 'comprar',
  Vender: 'vender',
  Alquilar: 'alquilar',
  Reformar: 'reformar',
  'Otra cosa': 'otro',
};

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [need, setNeed] = useState(needs[0]);
  const [message, setMessage] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [company, setCompany] = useState(''); // honeypot (oculto); los humanos lo dejan vacío
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Dinos cómo te llamas.';
    if (!/^(\+?\d[\d\s]{7,14})$/.test(phone.trim())) next.phone = 'Déjanos un teléfono para poder contestarte.';
    if (!privacy) next.privacy = 'Necesitamos que aceptes la política de privacidad para contestarte.';
    setErrors(next);
    const first = (['name', 'phone', 'privacy'] as const).find((k) => next[k]);
    if (first) {
      document.getElementById(`contacto-${first}`)?.focus();
      return;
    }

    // Guardamos el lead directo en Supabase (web estática: sin Worker). Insert con anon key y
    // policy RLS solo-INSERT (migrations/0003). El honeypot filtra bots: si está relleno, no se
    // guarda. Nunca bloquea la pantalla de WhatsApp si algo falla: el contacto no se pierde.
    if (!company.trim()) {
      try {
        await createBrowserClient()
          .from('lead')
          .insert({
            name: name.trim(),
            phone: phone.trim(),
            message: message.trim() || null,
            intent: intentByNeed[need] ?? 'otro',
            source: 'web',
            status: 'nuevo',
            consent_marketing: false, // aceptar privacidad ≠ consentimiento de marketing
            consent_at: new Date().toISOString(),
            consent_source: 'web',
          });
      } catch {
        /* si no guarda, seguimos: el contacto por WhatsApp no se pierde */
      }
    }

    setSent(true);
  }

  // Enlace real (no window.open): funciona en iOS y el listener global de BaseLayout lo mide.
  const waLines = [`Hola, soy ${name.trim()}.`, `Necesito: ${need.toLowerCase()}.`, message.trim()];
  const waHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waLines.filter(Boolean).join('\n'))}`;

  if (sent) {
    return (
      <div className="contact-form contact-form--done" aria-live="polite">
        <h3 className="contact-form__title">Recibido. Falta un paso si quieres hablar ya.</h3>
        <p className="feature__text">
          Pulsa el botón y se abre WhatsApp con tu mensaje ya escrito. Dale a enviar y te contestamos nosotros, en persona.
        </p>
        <a
          className="button button--primary button--large button--block"
          href={waHref}
          target="_blank"
          rel="noopener"
          data-contact="whatsapp"
          data-origin="formulario-contacto"
        >
          <FlipLabel>Continuar por WhatsApp</FlipLabel>
        </a>
        <Button variant="ghost" onPress={() => setSent(false)}>
          Escribir otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label className="field">
        <span className="field__label">Nombre <span aria-hidden="true">*</span></span>
        <input
          id="contacto-name"
          className="field__control"
          type="text"
          autoComplete="given-name"
          placeholder="Ej. Ana"
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
        <span className="field__label">Teléfono <span aria-hidden="true">*</span></span>
        <input
          id="contacto-phone"
          className="field__control"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Ej. 612 345 678"
          value={phone}
          required
          aria-required="true"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={`${errors.phone ? 'contacto-phone-error ' : ''}contacto-telefono-ayuda`}
          onChange={(event) => setPhone(event.target.value)}
        />
        {errors.phone && <span className="field__error" id="contacto-phone-error" role="alert">{errors.phone}</span>}
        <span className="field__hint" id="contacto-telefono-ayuda">
          Para poder contestarte aunque no llegues a enviar el WhatsApp.
        </span>
      </label>
      <label className="field">
        <span className="field__label">¿Qué necesitas?</span>
        <select className="field__control" value={need} onChange={(event) => setNeed(event.target.value)}>
          {needs.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field__label">Cuéntanos (si quieres)</span>
        <textarea
          className="field__control"
          placeholder="Ej. Busco un piso de 3 habitaciones cerca de la playa"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      {/* Campo trampa anti-spam: oculto para personas, invisible en pantalla y lectores. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>
          No rellenar
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
          He leído la <a href="/es/privacidad/">política de privacidad</a>. <span aria-hidden="true">*</span>
        </span>
      </label>
      {errors.privacy && <span className="field__error" id="contacto-privacy-error" role="alert">{errors.privacy}</span>}
      <Button variant="primary" className="button--large button--block" type="submit">
        Enviar por WhatsApp
      </Button>
      <p className="field__hint">Guardamos tu solicitud y te damos un botón para seguir por WhatsApp.</p>
    </form>
  );
}
