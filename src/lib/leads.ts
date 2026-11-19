/**
 * Guarda un lead y dice si de verdad quedó guardado. Nunca lanza: si falta configuración,
 * el dominio de Supabase no existe o no hay red, devuelve false y el formulario manda a WhatsApp.
 * Uso: saveLead(() => createBrowserClient().from('lead').insert(fila))
 */
export async function saveLead(insert: () => PromiseLike<{ error: unknown }>): Promise<boolean> {
  try {
    const { error } = await insert();
    return !error;
  } catch {
    return false;
  }
}
