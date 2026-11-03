import type { APIRoute } from 'astro';
import { createServiceClient } from '@/lib/supabase';

// Captura de leads desde la web pública. La tabla `lead` no tiene policy para `anon`
// (solo staff), así que la escritura pasa por aquí con la service_role, en el servidor.
export const prerender = false;

const INTENTS = ['comprar', 'vender', 'alquilar', 'reformar', 'valoracion', 'patrimonio', 'otro'];
const SOURCES = [
  'whatsapp', 'web', 'formulario', 'instagram', 'idealista', 'fotocasa',
  'llamada', 'recomendacion', 'valoracion', 'manual',
];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}
function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Datos no válidos.' }, 400);
  }

  // Honeypot anti-spam: si un bot rellena el campo oculto, aceptamos en silencio sin guardar.
  if (str(body.company)) return json({ ok: true });

  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email);
  const message = str(body.message);
  if (!name && !phone && !email) return json({ error: 'Déjanos al menos un dato de contacto.' }, 400);
  if (body.consent !== true) return json({ error: 'Necesitamos tu consentimiento para contestarte.' }, 400);

  const intent = INTENTS.includes(str(body.intent)) ? str(body.intent) : 'otro';
  const source = SOURCES.includes(str(body.source)) ? str(body.source) : 'web';

  const env = (locals as { runtime?: { env?: Record<string, string> } })?.runtime?.env;
  let supabase;
  try {
    supabase = createServiceClient(env);
  } catch {
    return json({ error: 'El servidor no está configurado para recibir el mensaje.' }, 500);
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('lead')
    .insert({
      name: name || null,
      phone: phone || null,
      email: email || null,
      intent,
      zone: str(body.zone) || null,
      property_ref: str(body.property_ref) || null,
      source,
      status: 'nuevo',
      consent_marketing: true,
      consent_at: now,
      consent_source: source,
    })
    .select('id')
    .single();

  if (error) return json({ error: error.message }, 500);

  if (message && data?.id) {
    await supabase.from('lead_event').insert({ lead_id: data.id, type: 'nota', note: message });
  }

  return json({ ok: true, id: data?.id ?? null }, 201);
};
