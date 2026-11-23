import { intlLocale, strings, type Lang } from '../i18n';

export interface ProofFigure {
  value: string;
  label: string;
  source?: string;
  href?: string;
}

interface ProofInput {
  rating: { value: number; count: number; checkedOn: string; url: string } | null;
  yearsActive: number | null;
  listings: number;
  builtOn: Date;
  lang: Lang;
}

const text = strings({
  es: {
    rating: 'sobre 5 en Google',
    reviews: 'reseñas en Google',
    years: 'años en el Alt Maresme',
    listings: 'inmuebles publicados',
    googleSource: (date: string) => `Google, consultado el ${date}`,
    listingsSource: (date: string) => `Cartera publicada a ${date}`,
  },
  en: {
    rating: 'out of 5 on Google',
    reviews: 'Google reviews',
    years: 'years in the Alt Maresme',
    listings: 'properties listed',
    googleSource: (date: string) => `Google, checked on ${date}`,
    listingsSource: (date: string) => `Listings as of ${date}`,
  },
  ca: {
    rating: 'sobre 5 a Google',
    reviews: 'ressenyes a Google',
    years: "anys a l'Alt Maresme",
    listings: 'immobles publicats',
    googleSource: (date: string) => `Google, consultat el ${date}`,
    listingsSource: (date: string) => `Cartera publicada a ${date}`,
  },
});

/** Cifras de confianza para el HTML. Solo datos con fuente; lo que falta o vale 0 no se pinta. */
export function proofFigures({ rating, yearsActive, listings, builtOn, lang }: ProofInput): ProofFigure[] {
  const t = text[lang];
  const date = new Intl.DateTimeFormat(intlLocale[lang], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' });
  const figures: ProofFigure[] = [];
  if (rating && rating.count > 0) {
    // Mediodía UTC: la fecha guardada no cambia de día al formatearla en hora de Madrid.
    const source = t.googleSource(date.format(new Date(`${rating.checkedOn}T12:00:00Z`)));
    const value = new Intl.NumberFormat(intlLocale[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(rating.value);
    figures.push({ value, label: t.rating, source, href: rating.url });
    figures.push({ value: String(rating.count), label: t.reviews, source, href: rating.url });
  }
  if (yearsActive && yearsActive > 0) figures.push({ value: String(yearsActive), label: t.years });
  if (listings > 0) {
    figures.push({ value: String(listings), label: t.listings, source: t.listingsSource(date.format(builtOn)) });
  }
  return figures;
}
