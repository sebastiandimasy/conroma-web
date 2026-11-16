/* Estado de la oficina («abierto ahora» / «abrimos…») en hora de Madrid, desde site.openingHours.
   Se calcula en el navegador: en el HTML estático quedaría congelado a la hora del build. */

export interface OpeningSlot {
  days: string[];
  opens: string;
  closes: string;
}

export interface OfficeStatus {
  open: boolean;
  label: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const show = (hhmm: string) => hhmm.replace(/^0/, '');

/** Día de la semana (0 = domingo) y minuto del día en Europe/Madrid. */
function madridNow(now: Date): { day: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return { day: DAYS.indexOf(get('weekday')), minute: Number(get('hour')) * 60 + Number(get('minute')) };
}

// shortcut: no conoce festivos (diría «abierto» un festivo entre semana); añadir lista de festivos si el dueño la da.
export function officeStatus(now: Date, hours: OpeningSlot[] | null): OfficeStatus | null {
  if (!hours || hours.length === 0) return null;
  const { day, minute } = madridNow(now);
  const slotsOn = (d: number) =>
    hours.filter((slot) => slot.days.includes(DAYS[d])).sort((a, b) => toMinutes(a.opens) - toMinutes(b.opens));

  const current = slotsOn(day).find((slot) => minute >= toMinutes(slot.opens) && minute < toMinutes(slot.closes));
  if (current) return { open: true, label: `Abierto ahora, hasta las ${show(current.closes)}` };

  const laterToday = slotsOn(day).find((slot) => toMinutes(slot.opens) > minute);
  if (laterToday) return { open: false, label: `Abrimos hoy a las ${show(laterToday.opens)}` };

  for (let ahead = 1; ahead <= 7; ahead++) {
    const next = slotsOn((day + ahead) % 7)[0];
    if (next) {
      const when = ahead === 1 ? 'mañana' : DAY_NAMES[(day + ahead) % 7];
      return { open: false, label: `Abrimos ${when} a las ${show(next.opens)}` };
    }
  }
  return null;
}
