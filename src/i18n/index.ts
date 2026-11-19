/**
 * Idiomas de la web. Cada texto visible vive en un `strings({ es, en, ca })` (aquí, en `ui.ts`
 * o junto al componente que lo usa). TypeScript obliga a que en/ca tengan las mismas claves que
 * es: si se añade o cambia un texto en un idioma y no en los otros, `astro check` falla.
 * Regla del dueño: todo cambio de texto se hace en los tres idiomas.
 */
export const languages = ['es', 'en', 'ca'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

/** Nombre de cada idioma en su propio idioma (selector de la cabecera). */
export const languageNames: Record<Lang, string> = { es: 'Español', en: 'English', ca: 'Català' };
/** Locale para Intl (precios, fechas, plurales). */
export const intlLocale: Record<Lang, string> = { es: 'es-ES', en: 'en-GB', ca: 'ca-ES' };
export const ogLocale: Record<Lang, string> = { es: 'es_ES', en: 'en_GB', ca: 'ca_ES' };

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (languages as readonly string[]).includes(value);
}

/** Idioma de una URL o ruta por su primer tramo (`/en/venta/` → en). Lo demás, español. */
export function getLang(url: URL | string): Lang {
  const path = typeof url === 'string' ? url : url.pathname;
  const first = path.split('/')[1];
  return isLang(first) ? first : defaultLang;
}

/** La misma ruta en otro idioma: `/es/venta/x/` → `/en/venta/x/`. Las rutas sin idioma no se tocan. */
export function localizePath(path: string, lang: Lang): string {
  const match = path.match(/^\/(es|en|ca)(\/|$|[?#])/);
  if (!match) return path;
  return `/${lang}${path.slice(match[1].length + 1)}`;
}

/** getStaticPaths de las páginas de `src/pages/[lang]/` sin más parámetros. */
export function langPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

/**
 * Textos de un componente en los tres idiomas. El tipo sale del español y en/ca tienen que
 * cumplirlo: `strings({ es: { title: 'Hola' }, en: { title: 'Hi' }, ca: { title: 'Hola' } })[lang]`.
 */
export function strings<T>(byLang: { es: T; en: NoInfer<T>; ca: NoInfer<T> }): Record<Lang, T> {
  return byLang;
}
