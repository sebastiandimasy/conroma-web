import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@heroui/react';
import { site } from '../data/site';

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
    if (Object.keys(next).length > 0) return;

    // Guardamos el lead en el sistema (no bloquea la apertura de WhatsApp si algo falla).
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          message: message.trim(),
          intent: intentByNeed[need] ?? 'otro',
          source: 'web',
          consent: privacy,
          company,
        }),
      });
    } catch {
      /* si no guarda, seguimos: el contacto por WhatsApp no se pierde */
    }

    const lines = [`Hola, soy ${name.trim()}.`, `Necesito: ${need.toLowerCase()}.`, message.trim()];
    const text = encodeURIComponent(lines.filter(Boolean).join('\n'));
    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, '_blank', 'noopener');
    setSent(true);
  }

  if (sent) {
    return (
      <div className="contact-form contact-form--done" aria-live="polite">
        <span className="tag">Listo</span>
        <h3 className="contact-form__title">Se ha abierto WhatsApp con tu mensaje ya escrito.</h3>
        <p className="feature__text">Dale a enviar y te contestamos nosotros, en persona.</p>
        <Button variant="ghost" onPress={() => setSent(false)}>
          Escribir otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <label className="field">
        <span className="field__label">Nombre</span>
        <input
          className="field__control"
          type="text"
          autoComplete="given-name"
          placeholder="Ej. Ana"
          value={name}
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <span className="field__error">{errors.name}</span>}
      </label>
      <label className="field">
        <span className="field__label">Teléfono</span>
        <input
          className="field__control"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Ej. 612 345 678"
          value={phone}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby="contacto-telefono-ayuda"
          onChange={(event) => setPhone(event.target.value)}
        />
        {errors.phone && <span className="field__error">{errors.phone}</span>}
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
          className="check__input"
          type="checkbox"
          checked={privacy}
          onChange={(event) => setPrivacy(event.target.checked)}
        />
        <span>
          He leído la <a href="/es/privacidad/">política de privacidad</a>.
        </span>
      </label>
      {errors.privacy && <span className="field__error">{errors.privacy}</span>}
      <Button variant="primary" className="button--large button--block" type="submit">
        Enviar por WhatsApp
      </Button>
      <p className="field__hint">Se abre WhatsApp con tu mensaje ya escrito.</p>
    </form>
  );
}
