import { describe, expect, it } from 'vitest';
import { officeStatus } from '../src/lib/hours';

const hours = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '14:00' },
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '16:30', closes: '19:30' },
];
// Fechas en UTC; noviembre = UTC+1 en Madrid.
const at = (iso: string) => officeStatus(new Date(iso), hours);

describe('officeStatus (hora de Madrid)', () => {
  it('abierto por la mañana, con la hora de cierre', () => {
    expect(at('2026-11-16T09:30:00Z')).toEqual({ open: true, label: 'Abierto ahora, hasta las 14:00' });
  });

  it('cerrado al mediodía: abre hoy por la tarde', () => {
    expect(at('2026-11-16T14:00:00Z')).toEqual({ open: false, label: 'Abrimos hoy a las 16:30' });
  });

  it('cerrado de noche entre semana: abre mañana', () => {
    expect(at('2026-11-16T21:00:00Z')).toEqual({ open: false, label: 'Abrimos mañana a las 9:00' });
  });

  it('viernes por la noche: abre el lunes', () => {
    expect(at('2026-11-20T20:00:00Z')).toEqual({ open: false, label: 'Abrimos el lunes a las 9:00' });
  });

  it('usa la hora de Madrid, no la del navegador ni UTC', () => {
    // 08:30 UTC = 09:30 en Madrid (abierto); en UTC aún estaría cerrado.
    expect(at('2026-11-16T08:30:00Z').open).toBe(true);
  });

  it('sin horario publicado no afirma nada', () => {
    expect(officeStatus(new Date('2026-11-16T09:30:00Z'), null)).toBeNull();
  });
});
