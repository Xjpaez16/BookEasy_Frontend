/*
 * Money helpers. The backend stores and returns money as integer MINOR units
 * (e.g. cents) plus an ISO-4217 currency code — never a float. The UI edits a
 * major-unit decimal string for humans, so these convert between the two
 * without ever doing float arithmetic on the stored value.
 */

/** Format minor units + currency for display, e.g. (12345, 'USD') -> "$123.45". */
export function formatMoney(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(minor / 100);
  } catch {
    // Unknown currency code — fall back to a plain 2-decimal rendering.
    return `${(minor / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

/**
 * Parse a human major-unit string ("123.45", "123,45", "1 200.00") into integer
 * minor units. Returns null when the input is not a valid non-negative amount.
 * Rounds to the nearest minor unit to avoid float drift from the parse.
 */
export function parseMoneyToMinor(input: string): number | null {
  const normalized = input.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '') return null;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** Render minor units as an editable major-unit string, e.g. 12345 -> "123.45". */
export function minorToMajorString(minor: number): string {
  return (minor / 100).toFixed(2);
}

/** Format a duration in minutes as a short human label, e.g. 90 -> "1 h 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
