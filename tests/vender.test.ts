import { describe, expect, it } from 'vitest';
import { venderAnswer, venderCompare, venderFaq, venderSteps } from '../src/data/vender';
import { site } from '../src/data/site';

const words = (s: string) => s.trim().split(/\s+/).length;
const allText = [venderAnswer, ...venderSteps.flatMap((s) => [s.title, s.text, s.alt]),
  ...venderCompare.flatMap((r) => [r.aspect, r.withUs, r.alone]), ...venderFaq.flatMap((f) => [f.question, f.answer])];

describe('textos de Vender', () => {
  it('abre con una respuesta autocontenida de 2 o 3 frases', () => {
    const sentences = venderAnswer.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  it('cuenta el proceso en 5 pasos, cada uno con foto y alt', () => {
    expect(venderSteps).toHaveLength(5);
    expect(venderSteps.every((s) => s.image && s.alt.length > 0)).toBe(true);
  });

  it('compara en tiempo, papeles, precio y seguridad, con celdas cortas', () => {
    expect(venderCompare.map((r) => r.aspect)).toEqual(['Tiempo', 'Papeles', 'Precio', 'Seguridad']);
    expect(venderCompare.every((r) => words(r.withUs) <= 12 && words(r.alone) <= 12)).toBe(true);
  });

  it('FAQ con respuestas de 60 palabras como máximo y los cuatro temas del spec', () => {
    expect(venderFaq.every((f) => words(f.answer) <= 60)).toBe(true);
    const questions = venderFaq.map((f) => f.question.toLowerCase()).join(' ');
    for (const topic of ['honorarios', 'cuánto se tarda', 'exclusiva', 'cédula']) expect(questions).toContain(topic);
  });

  it('no publica un porcentaje de honorarios que no tenemos', () => {
    if (site.feePercent === null) expect(venderFaq.some((f) => /\d+(,\d+)?\s?%/.test(f.answer))).toBe(false);
  });

  it('sin rayas como muletilla', () => {
    expect(allText.some((t) => t.includes('—'))).toBe(false);
  });
});
