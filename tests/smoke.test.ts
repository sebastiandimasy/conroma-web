import { describe, expect, it } from 'vitest';
import { checkPage } from '../scripts/smoke.mjs';

const indexable = '<html><head><title>Conroma</title></head><body>Ref. P-1</body></html>';
const noindex = '<html><head><meta name="robots" content="noindex, nofollow"></head><body>Conroma</body></html>';

describe('prueba de humo', () => {
  it('una página bien servida en producción pasa', () => {
    expect(checkPage({ status: 200, html: indexable }, { mustContain: ['Ref.'] })).toEqual([]);
  });

  it('falla si la página no responde 200', () => {
    expect(checkPage({ status: 500, html: indexable })).toEqual(['responde 500']);
  });

  it('en producción, un noindex es un fallo; en la demo, es lo esperado', () => {
    expect(checkPage({ status: 200, html: noindex })).toHaveLength(1);
    expect(checkPage({ status: 200, html: noindex }, { preview: true })).toEqual([]);
    expect(checkPage({ status: 200, html: indexable }, { preview: true })).toHaveLength(1);
  });

  it('falla si falta un texto que la página tiene que llevar', () => {
    expect(checkPage({ status: 200, html: indexable }, { mustContain: ['Titular'] })).toEqual(['no contiene «Titular»']);
  });
});
