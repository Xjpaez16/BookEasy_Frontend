/*
 * Date/time helpers for the calendar. The backend takes `startAt` as an ISO
 * string with offset and stores UTC, presenting it in the business timezone.
 * For the MVP the owner books from their own locale, so a picked date+time is
 * interpreted in the browser's local zone and serialized with its offset.
 */

/** "2026-10-09" + "14:30" (local) -> ISO-8601 with the local offset. */
export function toIsoWithOffset(date: string, time: string): string {
  // `new Date("2026-10-09T14:30")` is parsed as LOCAL time by the runtime.
  const d = new Date(`${date}T${time}`);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Invalid date/time');
  }
  return d.toISOString();
}

/** The UTC-day bounds [00:00, next 00:00) for a local date, as ISO strings. */
export function dayRangeIso(date: string): { from: string; to: string } {
  const start = new Date(`${date}T00:00`);
  const end = new Date(start.getTime());
  end.setDate(end.getDate() + 1);
  return { from: start.toISOString(), to: end.toISOString() };
}

/** Format an ISO instant's clock time in a timezone, e.g. "2:30 p. m.". */
export function formatTime(iso: string, timeZone?: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    ...(timeZone ? { timeZone } : {}),
  }).format(d);
}

/** Format an ISO instant's date, e.g. "vie, 9 oct". */
export function formatDay(iso: string, timeZone?: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    ...(timeZone ? { timeZone } : {}),
  }).format(d);
}

/** Today's local date as "YYYY-MM-DD" for a date input default. */
export function todayLocalDate(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Shift a "YYYY-MM-DD" by N days, returning "YYYY-MM-DD". */
export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T00:00`);
  d.setDate(d.getDate() + days);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Minutes-from-midnight (business hours) -> "HH:MM". */
export function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
