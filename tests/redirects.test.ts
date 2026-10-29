import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const file = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');
const lines = file.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
const idx = (needle: string) => lines.findIndex((l) => l.includes(needle));

const casos: [string, string][] = [
  ['pineda_de_mar', '/es/inmobiliaria/pineda-de-mar/'],
  ['calella', '/es/inmobiliaria/calella/'],
  ['santa_susanna', '/es/inmobiliaria/santa-susanna/'],
  ['palafolls', '/es/inmobiliaria/palafolls/'],
];

describe('redirects de municipios reactivados', () => {
  it('cada municipio redirige a su página de captación', () => {
    for (const [slug, dest] of casos) {
      const rule = lines.find((l) => l.includes('/detalle/') && l.includes(`/${slug}/`));
      expect(rule, slug).toBeDefined();
      expect(rule).toContain(dest);
    }
  });

  it('la regla específica precede al comodín de respaldo', () => {
    for (const [slug] of casos) {
      expect(idx(`/detalle/:op/:tipo/:prov/${slug}/`)).toBeLessThan(idx('/detalle/*'));
      expect(idx(`/buscador/:op/:tipo/:prov/${slug}/`)).toBeLessThan(idx('/buscador/*'));
    }
  });

  it('el comodín de respaldo sigue existiendo (no 404 para municipios sin regla)', () => {
    expect(idx('/detalle/*')).toBeGreaterThan(-1);
    expect(idx('/buscador/*')).toBeGreaterThan(-1);
  });
});
