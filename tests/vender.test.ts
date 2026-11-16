import { describe, expect, it } from 'vitest';
import { venderAnswer, venderCompare, venderFaq, venderSteps } from '../src/data/vender';
import { site } from '../src/data/site';

const words = (s: string) => s.trim().split(/\s+/).length;
const allText = [venderAnswer, ...venderSteps.flatMap((s) => [s.title, s.text, s.alt]),
  ...venderCompare.flatMap((o) => [o.title, ...o.groups.flatMap((g) => [g.title, ...g.items])]), ...venderFaq.flatMap((f) => [f.question, f.answer])];

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

  it('compara dos opciones válidas en tiempo, papeles, precio y seguridad, con frases cortas', () => {
    expect(venderCompare).toHaveLength(2);
    for (const option of venderCompare) {
      expect(option.groups.map((g) => g.title).slice(0, 4)).toEqual(['Tiempo', 'Papeles', 'Precio', 'Seguridad']);
      expect(option.groups.every((g) => g.items.length > 0 && g.items.every((i) => words(i) <= 14))).toBe(true);
    }
  });

  it('resalta lo que gana el cliente con Conroma: más puntos que la otra opción', () => {
    const count = (i: 0 | 1) => venderCompare[i].groups.flatMap((g) => g.items).length;
    expect(count(0)).toBeGreaterThan(count(1));
  });

  it('presenta vender por tu cuenta como opción, sin alarmar ni dar órdenes', () => {
    // Cada punto describe a quién le encaja la opción; ninguno asusta ni impone.
    const alone = venderCompare[1].groups.flatMap((g) => g.items).join(' ').toLowerCase();
    for (const alarm of ['quema', 'desconocid', 'riesgo', 'cuidado', 'tú solo', 'buscas tú', 'atiendes tú']) {
      expect(alone).not.toContain(alarm);
    }
    expect(venderCompare[1].title.endsWith('si…')).toBe(true);
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
