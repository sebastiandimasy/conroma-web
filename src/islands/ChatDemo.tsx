import { useEffect, useId, useRef, useState } from 'react';
import { services } from '../data/services';
import { whatsappUrl } from '../lib/links';
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

const intents: Intent[] = [
  { id: 'comprar', label: 'Comprar' },
  { id: 'vender', label: 'Vender' },
  { id: 'alquilar', label: 'Alquilar' },
  { id: 'valoracion', label: '¿Cuánto vale mi piso?' },
  { id: 'reformas', label: 'Reformas' },
];

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
export async function getAnswer(input: string): Promise<BotAnswer> {
  if (input === 'valoracion') {
    return {
      text: 'Cuatro preguntas y te decimos cuánto vale tu piso. Gratis y sin compromiso.',
      href: '/es/valoracion/',
      hrefLabel: 'Valorar mi piso',
    };
  }

  const match = services.find((service) => service.slug === input);
  if (match) {
    return { text: match.summary, href: match.href, hrefLabel: `Más sobre ${match.name.toLowerCase()}` };
  }

  return { text: 'Eso te lo contamos mejor en persona. Escríbenos por WhatsApp y te respondemos.' };
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

export default function ChatDemo() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: 'Hola. Dime qué necesitas y te oriento en un momento.' },
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
    const answer = await getAnswer(intent.id);
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
          aria-label="Chat de ayuda de Conroma"
          tabIndex={-1}
        >
          <header className="chatdemo__head">
            <p className="chatdemo__title">¿Cómo te ayudamos?</p>
            <button type="button" className="chatdemo__close" aria-label="Cerrar chat" onClick={() => setOpen(false)}>
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
            {intents.map((intent) => (
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
            href={whatsappUrl({ reason: 'general' })}
            data-contact="whatsapp"
            data-origin="chat"
          >
            <Icon name="whatsapp" className="chatdemo__icon" />
            Hablar con una persona
          </a>

          <p className="chatdemo__note">Respuestas de ejemplo del prototipo.</p>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        className="chatdemo__launcher"
        aria-label={open ? 'Cerrar chat de ayuda' : 'Abrir chat de ayuda'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <Icon name="close" className="chatdemo__icon" /> : <RobotIcon />}
      </button>
    </div>
  );
}
