import { describe, expect, it } from 'vitest';
import * as vender from '../src/data/vender';
import { languages } from '../src/i18n';
import { site } from '../src/data/site';

// Las reglas de contenido se comprueban sobre el español; en/ca tienen que mantener la misma forma.
const venderAnswer = vender.venderAnswer.es;
const venderSteps = vender.venderSteps.es;
const venderCompare = vender.venderCompare.es;
const venderFaq = vender.venderFaq.es;
const words = (s: string) => s.trim().split(/\s+/).length;
const textOf = (lang: (typeof languages)[number]) => [vender.venderAnswer[lang],
  ...vender.venderSteps[lang].flatMap((s) => [s.title, s.text, s.alt]),
  ...vender.venderCompare[lang].flatMap((o) => [o.title, ...o.groups.flatMap((g) => [g.title, ...g.items])]),
  ...vender.venderFaq[lang].flatMap((f) => [f.question, f.answer])];

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

  it('sin rayas como muletilla, en ningún idioma', () => {
    for (const lang of languages) expect(textOf(lang).some((t) => t.includes('—'))).toBe(false);
  });

  it('en y ca mantienen la forma del español: pasos, grupos, frases cortas y FAQ', () => {
    for (const lang of ['en', 'ca'] as const) {
      const sentences = vender.venderAnswer[lang].split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length).toBeGreaterThanOrEqual(2);
      expect(sentences.length).toBeLessThanOrEqual(3);
      expect(vender.venderSteps[lang].map((s) => s.image)).toEqual(venderSteps.map((s) => s.image));
      vender.venderCompare[lang].forEach((option, i) => {
        expect(option.groups).toHaveLength(venderCompare[i].groups.length);
        expect(option.groups.every((g, j) => g.items.length === venderCompare[i].groups[j].items.length)).toBe(true);
        expect(option.groups.every((g) => g.items.every((item) => words(item) <= 14))).toBe(true);
      });
      expect(vender.venderCompare[lang][1].title.endsWith('…')).toBe(true);
      expect(vender.venderFaq[lang]).toHaveLength(venderFaq.length);
      expect(vender.venderFaq[lang].every((f) => words(f.answer) <= 60)).toBe(true);
    }
  });
});
