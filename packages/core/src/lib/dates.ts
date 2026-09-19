/**
 * Fechas de calendario sin hora ni zona horaria. Se trabaja en UTC para que
 * el cambio de horario de verano nunca desplace un día.
 */
export type CalendarDate = { year: number; month: number; day: number };

const MS_PER_DAY = 86_400_000;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Acepta solo "AAAA-MM-DD" con una fecha real. */
export function parseISODate(value: string): CalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function toISODate(date: CalendarDate): string {
  const pad = (n: number, size: number) => String(n).padStart(size, "0");
  return `${pad(date.year, 4)}-${pad(date.month, 2)}-${pad(date.day, 2)}`;
}

function toEpochDay(date: CalendarDate): number {
  return Date.UTC(date.year, date.month - 1, date.day) / MS_PER_DAY;
}

function fromEpochDay(epochDay: number): CalendarDate {
  const d = new Date(epochDay * MS_PER_DAY);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return toEpochDay(a) - toEpochDay(b);
}

export function maxDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return compareDates(a, b) >= 0 ? a : b;
}

export function minDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return compareDates(a, b) <= 0 ? a : b;
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  return fromEpochDay(toEpochDay(date) + days);
}

/** Suma meses ajustando al último día si el mes destino es más corto (31 ene + 1 mes = 28/29 feb). */
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const total = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return { year, month, day: Math.min(date.day, daysInMonth(year, month)) };
}

/** Días entre dos fechas contando ambas. 0 si `to` es anterior a `from`. */
export function daysInclusive(from: CalendarDate, to: CalendarDate): number {
  return Math.max(0, toEpochDay(to) - toEpochDay(from) + 1);
}

export function isLastDayOfMonth(date: CalendarDate): boolean {
  return date.day === daysInMonth(date.year, date.month);
}
