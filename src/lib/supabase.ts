import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Clientes de Supabase para Conroma.
 * - Navegador / panel: anon (publishable) key + sesión de Supabase Auth + RLS.
 * - Servidor (rutas API del Worker): service_role key — SOLO en servidor, nunca en el cliente.
 * Variables: PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY (públicas) y
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (secretas del Worker).
 */

export function createBrowserClient(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Faltan PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(url, key);
}

/** Solo en rutas API del Worker. La service_role ignora RLS: nunca exponer al navegador. */
export function createServiceClient(env?: {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}): SupabaseClient {
  const url = env?.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const key = env?.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (secret del Worker)');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
