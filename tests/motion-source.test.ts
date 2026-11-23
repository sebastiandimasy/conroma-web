import { globSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(path, 'utf8');

describe('movimiento: un solo sistema (spec 2026-11-23)', () => {
  it('los titulares usan data-reveal="titulo", no data-split', () => {
    expect(globSync('src/**/*.astro').filter((p) => read(p).includes('data-split'))).toEqual([]);
  });

  it('ProofBand ya no trae contador propio ni la opción count', () => {
    expect(read('src/components/sections/ProofBand.astro')).not.toMatch(/data-count|requestAnimationFrame/);
    expect(globSync('src/pages/**/*.astro').filter((p) => /<ProofBand[^>]*\bcount\b/.test(read(p)))).toEqual([]);
  });

  it('motion.ts tiene interruptor y respeta reducir movimiento', () => {
    const motion = read('src/lib/motion.ts');
    expect(motion).toMatch(/export const MOTION_ON = true/);
    expect(motion).toMatch(/prefers-reduced-motion: no-preference/);
  });

  it('sin pin ni marcadores de depuración', () => {
    const code = globSync('src/lib/motion{.ts,/*.ts}').map(read).join('\n');
    expect(code).not.toMatch(/\bpin:\s*true|markers:\s*true/);
  });
});
