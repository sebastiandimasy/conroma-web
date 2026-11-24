import { describe, expect, it } from 'vitest';
import { localPhotoName, localPhotoUrl, photoSources } from '../src/lib/photos';

const base = 'https://fotoshs.imghs.net';
const path = '//527526/67561567736.527526/527526_67561567736_abc.jpg';

describe('photoSources (fotos de Habitatsoft)', () => {
  it('usa los tamaños del servidor de Habitatsoft: 800 por defecto, srcset y miniatura pequeña', () => {
    expect(photoSources(`${base}/3xl${path}`)).toEqual({
      src: `${base}/xl${path}`,
      srcset: `${base}/l${path} 640w, ${base}/xl${path} 800w, ${base}/2xl${path} 1024w, ${base}/3xl${path} 1280w`,
      thumb: `${base}/s${path}`,
    });
  });

  it('deja tal cual cualquier otra foto', () => {
    expect(photoSources('/img/muestra-1.svg')).toEqual({ src: '/img/muestra-1.svg', thumb: '/img/muestra-1.svg' });
  });
});

describe('fotos propias en WebP (/fotos/)', () => {
  const name = '527526_67561567736_abc';

  it('saca el nombre de la foto de una URL de Habitatsoft', () => {
    expect(localPhotoName(`${base}/3xl${path}`)).toBe(name);
    expect(localPhotoName('/img/muestra-1.svg')).toBeNull();
  });

  it('la URL propia apunta a la versión de 800 px', () => {
    expect(localPhotoUrl(name)).toBe(`/fotos/${name}-800.webp`);
  });

  it('una foto propia trae srcset de 480/800/1200 y miniatura de 200', () => {
    expect(photoSources(`/fotos/${name}-800.webp`)).toEqual({
      src: `/fotos/${name}-800.webp`,
      srcset: `/fotos/${name}-480.webp 480w, /fotos/${name}-800.webp 800w, /fotos/${name}-1200.webp 1200w`,
      thumb: `/fotos/${name}-200.webp`,
    });
  });
});
