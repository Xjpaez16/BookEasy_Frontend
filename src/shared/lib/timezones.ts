/*
 * Timezone options for the business setup form. Uses the full IANA list when
 * the runtime exposes Intl.supportedValuesOf('timeZone'); otherwise falls back
 * to a curated LatAm-first list (the target market for the MVP). The default is
 * the visitor's own zone, so the common case needs no interaction.
 */

const CURATED = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Lima',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/Caracas',
  'America/Guayaquil',
  'America/La_Paz',
  'America/Asuncion',
  'America/Montevideo',
  'America/Panama',
  'America/Costa_Rica',
  'America/Santo_Domingo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/Madrid',
  'UTC',
];

export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export function timezoneOptions(): string[] {
  const intl = Intl as unknown as {
    supportedValuesOf?: (key: string) => string[];
  };
  let zones: string[];
  try {
    zones = intl.supportedValuesOf ? intl.supportedValuesOf('timeZone') : CURATED;
  } catch {
    zones = CURATED;
  }
  // Ensure the visitor's own zone is present and first.
  const mine = browserTimezone();
  const rest = zones.filter((z) => z !== mine);
  return [mine, ...rest];
}
