import { describe, expect, it } from 'vitest';
import { REVEAL, placement, revealKind, staggerEach } from '../src/lib/motion/kinds';

describe('revealKind', () => {
  it('sin valor o con un valor desconocido es «subir»', () => {
    expect(revealKind(null)).toBe('subir');
    expect(revealKind('')).toBe('subir');
    expect(revealKind('true')).toBe('subir');
    expect(revealKind('otra')).toBe('subir');
  });

  it('reconoce los tipos del spec', () => {
    expect(revealKind('foto')).toBe('foto');
    expect(revealKind('escalonado')).toBe('escalonado');
    expect(revealKind('titulo')).toBe('titulo');
    expect(revealKind('cifra')).toBe('cifra');
  });
});

describe('REVEAL', () => {
  it('subir: entra desde 32 px y sale hacia arriba, más corto', () => {
    expect(REVEAL.subir.from).toMatchObject({ y: 32, opacity: 0 });
    expect(REVEAL.subir.enter).toMatchObject({ y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' });
    expect(REVEAL.subir.exit).toMatchObject({ y: -16, opacity: 0, duration: 0.35, ease: 'power2.in' });
  });

  it('foto: se asienta desde 1,12', () => {
    expect(REVEAL.foto.from).toMatchObject({ scale: 1.12, opacity: 0 });
    expect(REVEAL.foto.enter).toMatchObject({ scale: 1, opacity: 1, duration: 0.8 });
  });

  it('titulo dura 0,7 s', () => {
    expect(REVEAL.titulo.enter).toMatchObject({ duration: 0.7 });
  });

  it('ninguna curva rebota', () => {
    const eases = Object.values(REVEAL).flatMap((r) => [r.enter.ease, r.exit.ease]).join();
    expect(eases).not.toMatch(/elastic|bounce/);
  });
});

describe('staggerEach', () => {
  it('0,06 s por hijo con un tope total de 0,4 s', () => {
    expect(staggerEach(3)).toBe(0.06);
    expect(staggerEach(20)).toBeCloseTo(0.02);
  });
});

describe('placement', () => {
  it('por debajo del 88 % de la pantalla queda «abajo»', () => {
    expect(placement(900, 1300, 800)).toBe('abajo');
  });

  it('lo que se ve al arrancar es «visible»', () => {
    expect(placement(100, 500, 800)).toBe('visible');
  });

  it('al llegar por un ancla a media página, lo de arriba queda «arriba» y se ve', () => {
    expect(placement(-600, -10, 800)).toBe('arriba');
  });
});
