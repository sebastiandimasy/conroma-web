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

describe('movimiento: fuera las animaciones de scroll en CSS', () => {
  const styles = globSync('src/styles/*.css').map(read).join('\n');

  it('no queda animation-timeline', () => {
    expect(styles).not.toMatch(/animation-timeline/);
  });

  it('no quedan los keyframes sustituidos por GSAP', () => {
    expect(styles).not.toMatch(
      /@keyframes (reveal|figure-focus|hero-drift|hero-lift|photo-settle|statement-word|story-step|story-photo|card-rise|hero-center-in)\b/,
    );
  });

  it('ningún [data-reveal] se oculta en CSS', () => {
    expect(styles).not.toMatch(/\[data-reveal\][^{]*\{[^}]*opacity:\s*0/);
  });
});

describe('movimiento: hover y toque (motion.css)', () => {
  const motionCss = read('src/styles/motion.css');

  it('se importa en global.css', () => {
    expect(read('src/styles/global.css')).toMatch(/@import "\.\/motion\.css";/);
  });

  it('solo tokens de color y transiciones con propiedades concretas', () => {
    expect(motionCss).not.toMatch(/#[0-9a-f]{3,8}\b|transition:\s*all/i);
  });

  it('todo :hover vive dentro de (hover: hover) and (pointer: fine)', () => {
    const outside = motionCss.replace(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[\s\S]*?\n\}/g, '');
    expect(outside).not.toMatch(/:hover/);
  });

  it('con reducir movimiento no hay desplazamientos', () => {
    expect(motionCss).toMatch(/prefers-reduced-motion: reduce/);
  });
});
