import { describe, expect, it } from 'vitest';
import { photoSources } from '../src/lib/photos';

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
