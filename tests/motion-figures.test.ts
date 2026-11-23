import { describe, expect, it } from 'vitest';
import { formatFigure, parseFigure } from '../src/lib/motion/figures';

describe('parseFigure', () => {
  it('separa prefijo, número y sufijo', () => {
    expect(parseFigure('+300', 'es')).toEqual({ before: '+', value: 300, decimals: 0, after: '', decimalSep: ',', grouped: false });
    expect(parseFigure('7 años', 'es')).toMatchObject({ value: 7, after: ' años' });
  });

  it('el decimal depende del idioma', () => {
    expect(parseFigure('4,9', 'es')).toMatchObject({ value: 4.9, decimals: 1 });
    expect(parseFigure('4,9', 'ca')).toMatchObject({ value: 4.9, decimals: 1 });
    expect(parseFigure('4.9', 'en')).toMatchObject({ value: 4.9, decimals: 1 });
  });

  it('el punto de miles en español no es decimal', () => {
    expect(parseFigure('1.200', 'es')).toMatchObject({ value: 1200, decimals: 0, grouped: true });
    expect(parseFigure('1,200', 'en')).toMatchObject({ value: 1200, decimals: 0, grouped: true });
  });

  it('sin número no hay cifra', () => {
    expect(parseFigure('Google', 'es')).toBeNull();
  });
});

describe('formatFigure', () => {
  it('cuenta con los decimales del dato', () => {
    const f = parseFigure('4,9', 'es')!;
    expect(formatFigure(f, 0, 'es')).toBe('0,0');
    expect(formatFigure(f, 4.9, 'es')).toBe('4,9');
  });

  it('conserva prefijo y sufijo', () => {
    expect(formatFigure(parseFigure('+300', 'ca')!, 150, 'ca')).toBe('+150');
    expect(formatFigure(parseFigure('7 años', 'es')!, 3, 'es')).toBe('3 años');
  });

  it('acaba exactamente como el texto original', () => {
    expect(formatFigure(parseFigure('1.200', 'es')!, 1200, 'es')).toBe('1.200');
    expect(formatFigure(parseFigure('4.7', 'en')!, 4.7, 'en')).toBe('4.7');
  });
});
