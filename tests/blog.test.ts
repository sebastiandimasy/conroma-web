import { describe, expect, it } from 'vitest';
import { posts, relatedPosts, splitLinks } from '../src/data/blog';

describe('splitLinks', () => {
  it('separa los enlaces [texto](/ruta/) del texto', () => {
    expect(splitLinks('Mira [la guía](/es/blog/x/) antes.')).toEqual([
      'Mira ',
      { text: 'la guía', href: '/es/blog/x/' },
      ' antes.',
    ]);
  });

  it('deja el texto sin enlaces tal cual', () => {
    expect(splitLinks('Sin enlaces.')).toEqual(['Sin enlaces.']);
  });
});

describe('enlaces internos del blog', () => {
  const texts = posts.flatMap((post) => [
    post.summary,
    ...post.sections.flatMap((section) => [...section.paragraphs, ...(section.list ?? [])]),
  ]);
  const hrefs = texts.flatMap((text) => splitLinks(text)).flatMap((part) => (typeof part === 'string' ? [] : [part.href]));

  it('cada artículo enlaza al menos a otra página', () => {
    for (const post of posts) {
      const own = [...post.sections.flatMap((s) => [...s.paragraphs, ...(s.list ?? [])])].join(' ');
      expect(own, post.slug).toMatch(/\]\(\/es\//);
    }
  });

  it('los enlaces a otros artículos apuntan a artículos que existen', () => {
    const slugs = new Set(posts.map((post) => post.slug));
    for (const href of hrefs.filter((h) => h.startsWith('/es/blog/'))) {
      expect(slugs.has(href.replace('/es/blog/', '').replace(/\/$/, '')), href).toBe(true);
    }
  });

  it('todos los enlaces son rutas internas con barra final', () => {
    for (const href of hrefs) expect(href, href).toMatch(/^\/es\/.*\/$/);
  });
});

describe('relatedPosts', () => {
  it('prioriza la misma categoría y nunca repite el artículo', () => {
    const post = posts.find((item) => item.slug === 'certificado-de-amianto-para-vender-o-alquilar-en-cataluna')!;
    const related = relatedPosts(post);
    expect(related).toHaveLength(2);
    expect(related.every((item) => item.slug !== post.slug)).toBe(true);
    expect(related.every((item) => item.category === 'Vender')).toBe(true);
  });
});
