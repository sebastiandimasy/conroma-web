import { intlLocale, type Lang } from '../i18n';

const priceFormatters = Object.fromEntries(
  Object.entries(intlLocale).map(([lang, locale]) => [lang, new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: 'always' })]),
) as Record<Lang, Intl.NumberFormat>;

/** «250.000 €» en es/ca y «€250,000» en inglés. */
export function formatPrice(value: number, lang: Lang): string {
  const amount = priceFormatters[lang].format(value);
  return lang === 'en' ? `€${amount}` : `${amount} €`;
}

/** Planta: «2ª planta» en es, «2nd floor» en inglés y «2a planta» en catalán. */
export function formatFloor(floor: number, lang: Lang): string {
  if (lang === 'en') {
    if (floor === 0) return 'Ground floor';
    const suffix = floor % 100 >= 11 && floor % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[floor % 10] ?? 'th';
    return `${floor}${suffix} floor`;
  }
  if (lang === 'ca') return floor === 0 ? 'Planta baixa' : `${floor}a planta`;
  return floor === 0 ? 'Planta baja' : `${floor}ª planta`;
}

/** 4,7 en es/ca y 4.7 en inglés. */
export function formatRating(value: number, lang: Lang): string {
  const fixed = value.toFixed(1);
  return lang === 'en' ? fixed : fixed.replace('.', ',');
}
