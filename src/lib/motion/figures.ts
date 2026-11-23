import { intlLocale, type Lang } from '../../i18n';

export type Figure = {
  before: string;
  value: number;
  decimals: number;
  after: string;
  decimalSep: ',' | '.';
  /** El texto original llevaba separador de miles («1.200»): se respeta al contar. */
  grouped: boolean;
};

/** «+300», «4,9», «1.200», «7 años» → partes para contar. El decimal depende del idioma. */
export function parseFigure(text: string, lang: Lang): Figure | null {
  const decimalSep = lang === 'en' ? '.' : ',';
  const groupSep = decimalSep === ',' ? '.' : ',';
  const g = groupSep === '.' ? '\\.' : ',';
  const d = decimalSep === '.' ? '\\.' : ',';
  const match = text.match(new RegExp(`^(\\D*?)(\\d{1,3}(?:${g}\\d{3})+|\\d+)(?:${d}(\\d+))?(.*)$`, 's'));
  if (!match) return null;
  const [, before, int, frac = '', after] = match;
  return {
    before,
    value: Number(`${int.split(groupSep).join('')}.${frac || '0'}`),
    decimals: frac.length,
    after,
    decimalSep,
    grouped: int.includes(groupSep),
  };
}

export function formatFigure(f: Figure, current: number, lang: Lang): string {
  const number = new Intl.NumberFormat(intlLocale[lang], {
    minimumFractionDigits: f.decimals,
    maximumFractionDigits: f.decimals,
    useGrouping: f.grouped ? 'always' : false,
  }).format(current);
  return `${f.before}${number}${f.after}`;
}
