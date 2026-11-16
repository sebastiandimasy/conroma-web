import { describe, expect, it } from 'vitest';
import { posts, postsIn } from '../src/data/blog';

describe('postsIn', () => {
  it('solo publicados de la categoría, del más reciente al más antiguo', () => {
    const list = postsIn('Vender', 10);
    expect(list.length).toBe(posts.filter((p) => p.category === 'Vender' && !p.draft).length);
    expect(list.every((p) => p.category === 'Vender' && !p.draft)).toBe(true);
    expect([...list].sort((a, b) => b.date.localeCompare(a.date))).toEqual(list);
  });

  it('respeta el límite y devuelve [] si no hay artículos', () => {
    expect(postsIn('Vender', 1)).toHaveLength(1);
    expect(postsIn('Categoría que no existe')).toEqual([]);
  });
});
