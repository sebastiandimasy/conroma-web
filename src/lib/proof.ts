import { formatRating } from './format';

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
}

const date = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' });

/** Cifras de confianza para el HTML. Solo datos con fuente; lo que falta o vale 0 no se pinta. */
export function proofFigures({ rating, yearsActive, listings, builtOn }: ProofInput): ProofFigure[] {
  const figures: ProofFigure[] = [];
  if (rating && rating.count > 0) {
    // Mediodía UTC: la fecha guardada no cambia de día al formatearla en hora de Madrid.
    const source = `Google, consultado el ${date.format(new Date(`${rating.checkedOn}T12:00:00Z`))}`;
    figures.push({ value: formatRating(rating.value), label: 'sobre 5 en Google', source, href: rating.url });
    figures.push({ value: String(rating.count), label: 'reseñas en Google', source, href: rating.url });
  }
  if (yearsActive && yearsActive > 0) figures.push({ value: String(yearsActive), label: 'años en el Alt Maresme' });
  if (listings > 0) {
    figures.push({ value: String(listings), label: 'inmuebles publicados', source: `Cartera publicada a ${date.format(builtOn)}` });
  }
  return figures;
}
