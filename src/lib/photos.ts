/* El servidor de fotos de Habitatsoft sirve cada foto en varios tamaños cambiando un tramo de la ruta
   (el feed trae siempre 3xl = 1280 px): l 640, xl 800, 2xl 1024, 3xl 1280 y s 170 para miniaturas. */
const HABITATSOFT = /^(https:\/\/fotoshs\.imghs\.net\/)3xl(\/.*)$/;
const SIZES = [
  ['l', 640],
  ['xl', 800],
  ['2xl', 1024],
  ['3xl', 1280],
] as const;

/* Fotos propias: scripts/fotos-webp.mjs baja cada foto de Habitatsoft en el pre-build y la deja en
   public/fotos/ en WebP a estos anchos. La de 800 hace de URL canónica de la foto. */
export const LOCAL_WIDTHS = [200, 480, 800, 1200] as const;
const LOCAL = /^\/fotos\/(.+)-800\.webp$/;

export interface PhotoSources {
  src: string;
  srcset?: string;
  thumb: string;
}

/** Nombre de archivo de una foto de Habitatsoft (sin extensión), o null si no es de Habitatsoft. */
export function localPhotoName(url: string): string | null {
  if (!HABITATSOFT.test(url)) return null;
  return url.match(/\/([^/]+)\.jpe?g$/i)?.[1] ?? null;
}

export function localPhotoUrl(name: string): string {
  return `/fotos/${name}-800.webp`;
}

export function photoSources(url: string): PhotoSources {
  const local = url.match(LOCAL);
  if (local) {
    const at = (width: number) => `/fotos/${local[1]}-${width}.webp`;
    return {
      src: at(800),
      srcset: LOCAL_WIDTHS.filter((width) => width >= 480).map((width) => `${at(width)} ${width}w`).join(', '),
      thumb: at(200),
    };
  }
  const match = url.match(HABITATSOFT);
  if (!match) return { src: url, thumb: url };
  const [, host, rest] = match;
  const at = (size: string) => `${host}${size}${rest}`;
  return {
    src: at('xl'),
    srcset: SIZES.map(([size, width]) => `${at(size)} ${width}w`).join(', '),
    thumb: at('s'),
  };
}
