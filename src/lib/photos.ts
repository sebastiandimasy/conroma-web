/* El servidor de fotos de Habitatsoft sirve cada foto en varios tamaños cambiando un tramo de la ruta
   (el feed trae siempre 3xl = 1280 px): l 640, xl 800, 2xl 1024, 3xl 1280 y s 170 para miniaturas. */
const HABITATSOFT = /^(https:\/\/fotoshs\.imghs\.net\/)3xl(\/.*)$/;
const SIZES = [
  ['l', 640],
  ['xl', 800],
  ['2xl', 1024],
  ['3xl', 1280],
] as const;

export interface PhotoSources {
  src: string;
  srcset?: string;
  thumb: string;
}

export function photoSources(url: string): PhotoSources {
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
