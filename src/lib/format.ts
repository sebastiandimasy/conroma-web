const priceFormatter = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: 'always' });

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} €`;
}

export function formatFloor(floor: number): string {
  return floor === 0 ? 'Planta baja' : `${floor}ª planta`;
}

export function formatRating(value: number): string {
  return value.toFixed(1).replace('.', ',');
}
