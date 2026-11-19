import { describe, expect, it } from 'vitest';
import { saveLead } from '../src/lib/leads';

describe('saveLead', () => {
  it('true solo si el insert vuelve sin error', async () => {
    expect(await saveLead(async () => ({ error: null }))).toBe(true);
  });

  it('false si Supabase devuelve un error (p. ej. RLS)', async () => {
    expect(await saveLead(async () => ({ error: { message: 'rls' } }))).toBe(false);
  });

  it('false si el insert lanza (sin variables, dominio que no existe, sin red)', async () => {
    expect(
      await saveLead(() => {
        throw new Error('Faltan PUBLIC_SUPABASE_URL');
      }),
    ).toBe(false);
    expect(await saveLead(async () => Promise.reject(new TypeError('fetch failed')))).toBe(false);
  });
});
