import { useEffect, useId, useRef, useState } from 'react';
import { services } from '../data/services';
import { whatsappUrl } from '../lib/links';
import { localizePath, strings, type Lang } from '../i18n';
import { Icon } from './Icon';
import '../styles/chat-demo.css';

export interface BotAnswer {
  text: string;
  href?: string;
  hrefLabel?: string;
}

interface Message extends BotAnswer {
  id: number;
  from: 'bot' | 'user';
}

interface Intent {
  id: string;
  label: string;
}

const text = strings({
  es: {
    intents: [
      { id: 'comprar', label: 'Comprar' },
      { id: 'vender', label: 'Vender' },
      { id: 'alquilar', label: 'Alquilar' },
      { id: 'valoracion', label: '¿Cuánto vale mi piso?' },
      { id: 'reformas', label: 'Reformas' },
    ] as Intent[],
    valuation: 'Cuatro preguntas y te decimos cuánto vale tu piso. Gratis y sin compromiso.',
    valuationLink: 'Valorar mi piso',
    more: (name: string) => `Más sobre ${name.toLowerCase()}`,
    fallback: 'Eso te lo contamos mejor en persona. Escríbenos por WhatsApp y te respondemos.',
    greeting: 'Hola. Dime qué necesitas y te oriento en un momento.',
    dialog: 'Chat de ayuda de Conroma',
    title: '¿Cómo te ayudamos?',
    close: 'Cerrar chat',
    human: 'Hablar con una persona',
    note: 'Respuestas de ejemplo del prototipo.',
    launcherClose: 'Cerrar chat de ayuda',
    launcherOpen: 'Abrir chat de ayuda',
  },
  en: {
    intents: [
      { id: 'comprar', label: 'Buy' },
      { id: 'vender', label: 'Sell' },
      { id: 'alquilar', label: 'Rent' },
      { id: 'valoracion', label: 'What’s my home worth?' },
      { id: 'reformas', label: 'Renovations' },
    ],
    valuation: 'Four questions and we’ll tell you what your home is worth. Free, no strings attached.',
    valuationLink: 'Value my home',
    more: () => 'Find out more',
    fallback: 'That’s easier to explain in person. Message us on WhatsApp and we’ll get back to you.',
    greeting: 'Hi. Tell me what you need and I’ll point you in the right direction.',
    dialog: 'Conroma help chat',
    title: 'How can we help?',
    close: 'Close chat',
    human: 'Talk to a person',
    note: 'Sample answers from the prototype.',
    launcherClose: 'Close help chat',
    launcherOpen: 'Open help chat',
  },
  ca: {
    intents: [
      { id: 'comprar', label: 'Comprar' },
      { id: 'vender', label: 'Vendre' },
      { id: 'alquilar', label: 'Llogar' },
      { id: 'valoracion', label: 'Quant val el meu pis?' },
      { id: 'reformas', label: 'Reformes' },
    ],
    valuation: 'Quatre preguntes i et diem quant val el teu pis. Gratis i sense compromís.',
    valuationLink: 'Valora el meu pis',
    more: (name: string) => `Més sobre ${name.toLowerCase()}`,
    fallback: 'Això t’ho expliquem millor en persona. Escriu-nos per WhatsApp i et responem.',
    greeting: 'Hola. Digues-me què necessites i t’oriento en un moment.',
    dialog: 'Xat d’ajuda de Conroma',
    title: 'Com t’ajudem?',
    close: 'Tanca el xat',
    human: 'Parla amb una persona',
    note: 'Respostes d’exemple del prototip.',
    launcherClose: 'Tanca el xat d’ajuda',
    launcherOpen: 'Obre el xat d’ajuda',
  },
});

/* ─── PUNTO DE SUSTITUCIÓN PARA LA IA REAL ────────────────────────────────
 * Hoy: respuestas guiadas, 100% en cliente. Sin backend, sin API key.
 * Mañana (Claude de verdad): sustituir SOLO el cuerpo de esta función por
 * la llamada al endpoint serverless que guarde la API key:
 *
 *   const res = await fetch('/api/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message: input }),
 *   });
 *   return (await res.json()) as BotAnswer;
 *
 * La UI ya trata getAnswer como asíncrona, así que no hay que tocar nada más.
 * ──────────────────────────────────────────────────────────────────────── */
export async function getAnswer(input: string, lang: Lang): Promise<BotAnswer> {
  const t = text[lang];
  if (input === 'valoracion') {
    return {
      text: t.valuation,
      href: localizePath('/es/valoracion/', lang),
      hrefLabel: t.valuationLink,
    };
  }

  const match = services[lang].find((service) => service.slug === input);
  if (match) {
    return { text: match.summary, href: localizePath(match.href, lang), hrefLabel: t.more(match.name) };
  }

  return { text: t.fallback };
}

function RobotIcon() {
  return (
    <svg
      className="chatdemo__icon"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v3" />
      <path d="M12 2.5h.01" />
      <rect x="4" y="6" width="16" height="13" rx="4" />
      <path d="M9 12h.01M15 12h.01M9.5 16h5" />
    </svg>
  );
}

export default function ChatDemo({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: t.greeting },
  ]);

  const [hiddenByHero, setHiddenByHero] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const nextId = useRef(1);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      launcherRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  // El lanzador es una pestaña fija al borde derecho y, en móvil, cae justo encima
  // del botón "Buscar" del héroe: un dedo en la parte derecha del CTA abría el chat.
  // Mientras el buscador del héroe está a la vista, el lanzador se aparta.
  useEffect(() => {
    const hero = document.querySelector('.hero-search');
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => setHiddenByHero(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  async function ask(intent: Intent) {
    if (busy) return;
    setBusy(true);
    setMessages((prev) => [...prev, { id: nextId.current++, from: 'user', text: intent.label }]);
    const answer = await getAnswer(intent.id, lang);
    setMessages((prev) => [...prev, { id: nextId.current++, from: 'bot', ...answer }]);
    setBusy(false);
  }

  return (
    <div className="chatdemo" data-hidden={hiddenByHero && !open ? 'true' : undefined}>
      {open && (
        <div
          className="chatdemo__panel"
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-label={t.dialog}
          tabIndex={-1}
        >
          <header className="chatdemo__head">
            <p className="chatdemo__title">{t.title}</p>
            <button type="button" className="chatdemo__close" aria-label={t.close} onClick={() => setOpen(false)}>
              <Icon name="close" className="chatdemo__icon" />
            </button>
          </header>

          <div className="chatdemo__log" ref={logRef} aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`chatdemo__msg chatdemo__msg--${message.from}`}>
                <p>{message.text}</p>
                {message.href && (
                  <a className="chatdemo__link" href={message.href}>
                    {message.hrefLabel}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="chatdemo__chips">
            {t.intents.map((intent) => (
              <button
                key={intent.id}
                type="button"
                className="chatdemo__chip"
                onClick={() => ask(intent)}
                disabled={busy}
              >
                {intent.label}
              </button>
            ))}
          </div>

          <a
            className="chatdemo__wa"
            href={whatsappUrl(lang, { reason: 'general' })}
            data-contact="whatsapp"
            data-origin="chat"
          >
            <Icon name="whatsapp" className="chatdemo__icon" />
            {t.human}
          </a>

          <p className="chatdemo__note">{t.note}</p>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="chatdemo__launcher"
        aria-label={open ? t.launcherClose : t.launcherOpen}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <Icon name="close" className="chatdemo__icon" /> : <RobotIcon />}
      </button>
    </div>
  );
}
