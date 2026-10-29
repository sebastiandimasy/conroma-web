import { atom } from 'nanostores';

const SAVED_KEY = 'conroma:guardados';
const HIDDEN_KEY = 'conroma:descartados';
const CONSENT_KEY = 'conroma:cookies';
const INTENT_KEY = 'conroma:intencion';

export type Intent = 'pendiente' | 'vender' | 'comprar' | 'mirando';

function read(key: string): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export const savedRefs = atom<string[]>([]);
export const hiddenRefs = atom<string[]>([]);
export const cookieConsent = atom<'pendiente' | 'aceptado' | 'rechazado'>('pendiente');
export const intent = atom<Intent>('pendiente');

let hydrated = false;

export function hydrateStore(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  savedRefs.set(read(SAVED_KEY));
  hiddenRefs.set(read(HIDDEN_KEY));
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'aceptado' || consent === 'rechazado') cookieConsent.set(consent);
    const saved = localStorage.getItem(INTENT_KEY);
    if (saved === 'vender' || saved === 'comprar' || saved === 'mirando') intent.set(saved);
  } catch {
    return;
  }
}

function toggle(list: string[], ref: string): string[] {
  return list.includes(ref) ? list.filter((item) => item !== ref) : [...list, ref];
}

export function toggleSaved(ref: string): void {
  const next = toggle(savedRefs.get(), ref);
  savedRefs.set(next);
  write(SAVED_KEY, next);
}

export function hideProperty(ref: string): void {
  const next = [...new Set([...hiddenRefs.get(), ref])];
  hiddenRefs.set(next);
  write(HIDDEN_KEY, next);
}

export function restoreHidden(): void {
  hiddenRefs.set([]);
  write(HIDDEN_KEY, []);
}

export function setConsent(value: 'aceptado' | 'rechazado'): void {
  cookieConsent.set(value);
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // seguimos: el update de consentimiento no debe depender de localStorage
  }
  // Consent Mode v2: avisa a GTM en cuanto el usuario decide, usando el `gtag` global del <head>.
  try {
    const granted = value === 'aceptado' ? 'granted' : 'denied';
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof g === 'function') {
      g('consent', 'update', {
        ad_storage: granted,
        ad_user_data: granted,
        ad_personalization: granted,
        analytics_storage: granted,
      });
    }
  } catch {
    // sin GTM cargado, no pasa nada
  }
}

export function setIntent(value: Exclude<Intent, 'pendiente'>): void {
  intent.set(value);
  try {
    localStorage.setItem(INTENT_KEY, value);
  } catch {
    return;
  }
}
