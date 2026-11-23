/**
 * Guarda un lead y dice si de verdad quedó guardado. Nunca lanza: si falta configuración,
 * el dominio de Supabase no existe o no hay red, devuelve false y el formulario manda a WhatsApp.
 * Uso: saveLead(() => createBrowserClient().from('lead').insert(fila))
 */
/** Lo que necesita public/api/aviso-lead.php para mandar el aviso a gestion@. */
export interface LeadNotice {
  form: 'contacto' | 'valoracion';
  name: string;
  phone: string;
  intent?: string;
  message?: string;
  address?: string;
  channel?: string;
  details?: Record<string, string>; // etiqueta → valor, ya en español (lo lee la oficina)
  lang: string;
  company?: string; // honeypot
}

/** Avisa por correo de un lead nuevo. Nunca lanza: devuelve si el correo salió. */
export async function notifyLead(notice: LeadNotice): Promise<boolean> {
  try {
    const res = await fetch('/api/aviso-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...notice, page: window.location.pathname }),
    });
    return res.ok && (await res.json()).ok === true;
  } catch {
    return false;
  }
}

export async function saveLead(insert: () => PromiseLike<{ error: unknown }>): Promise<boolean> {
  try {
    const { error } = await insert();
    return !error;
  } catch {
    return false;
  }
}
