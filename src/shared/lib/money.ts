/*
 * Money helpers. The backend stores and returns money as integer MINOR units
 * plus an ISO-4217 currency code — never a float. The number of minor units
 * per major unit depends on the CURRENCY: most are 2 (USD cents), but several
 * are 0 (COP, CLP, JPY have no fractional unit). Hardcoding /100 misprices
 * those, so every conversion goes through `currencyExponent`.
 */

/** ISO-4217 minor-unit exponent for the currencies we support. Default 2. */
const ZERO_DECIMAL = new Set(['COP', 'CLP', 'JPY', 'KRW', 'VND', 'PYG', 'ISK']);
export function currencyExponent(currency: string): number {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? 0 : 2;
}

/** Minor units -> major amount, honoring the currency's decimal places. */
function minorToMajor(minor: number, currency: string): number {
  return minor / 10 ** currencyExponent(currency);
}

/**
 * Format minor units + currency for display.
 *   (25000, 'COP') -> "$ 25.000"   (2500000, 'USD') -> "$25,000.00"
 */
export function formatMoney(minor: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
    }).format(minorToMajor(minor, code));
  } catch {
    const frac = currencyExponent(code);
    return `${minorToMajor(minor, code).toFixed(frac)} ${code}`;
  }
}

/**
 * Parse a human major-unit string into integer minor units for a currency.
 * Allows as many decimals as the currency defines (0 for COP, 2 for USD).
 * Returns null when the input is not a valid non-negative amount.
 */
export function parseMoneyToMinor(input: string, currency = 'USD'): number | null {
  const frac = currencyExponent(currency);
  const normalized = input.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '') return null;
  const re = frac === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{1,${frac}})?$`);
  if (!re.test(normalized)) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 10 ** frac);
}

/** Render minor units as an editable major-unit string for the currency. */
export function minorToMajorString(minor: number, currency = 'USD'): string {
  return minorToMajor(minor, currency).toFixed(currencyExponent(currency));
}

/** Format a duration in minutes as a short human label, e.g. 90 -> "1 h 30 min". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
