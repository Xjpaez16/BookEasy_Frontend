import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import {
  type BusinessHour,
  type BusinessHours,
  useSetBusinessHours,
} from '../../entities/business-hours/api';
import { halfHourOptions, minutesToHHMM, hhmmToMinutes } from '../../shared/lib/datetime';
import { Button } from '../../shared/ui/Button';
import { Select } from '../../shared/ui/Select';
import { Alert } from '../../shared/ui/Field';
import { cn } from '../../shared/lib/cn';

/*
 * Weekly opening-hours editor. The backend models each open window as one
 * BusinessHour { weekday 0=Sun..6=Sat, openMinute, closeMinute } and PUT
 * REPLACES the whole set (a closed day = no entry). The domain invariant is
 * openMinute < closeMinute, so we guard that client-side too.
 *
 * Rows are rendered Monday-first (how people read a week) but keep the backend's
 * 0=Sunday weekday numbering in the payload.
 */

/** Display order: Monday..Sunday, mapped to backend weekday (0=Sun). */
const WEEK: Array<{ weekday: number; label: string }> = [
  { weekday: 1, label: 'Lunes' },
  { weekday: 2, label: 'Martes' },
  { weekday: 3, label: 'Miércoles' },
  { weekday: 4, label: 'Jueves' },
  { weekday: 5, label: 'Viernes' },
  { weekday: 6, label: 'Sábado' },
  { weekday: 0, label: 'Domingo' },
];

const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '17:00';

interface DayRow {
  open: boolean;
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
}

/** Build the editable row state from the server's sparse hours list. */
function toRows(hours: BusinessHour[]): Record<number, DayRow> {
  const rows: Record<number, DayRow> = {};
  for (const { weekday } of WEEK) {
    const found = hours.find((h) => h.weekday === weekday);
    rows[weekday] = found
      ? {
          open: true,
          openTime: minutesToHHMM(found.openMinute),
          closeTime: minutesToHHMM(found.closeMinute),
        }
      : { open: false, openTime: DEFAULT_OPEN, closeTime: DEFAULT_CLOSE };
  }
  return rows;
}

export function BusinessHoursForm({ initial }: { initial: BusinessHours }) {
  const save = useSetBusinessHours();
  const options = useMemo(() => halfHourOptions(), []);
  const [rows, setRows] = useState<Record<number, DayRow>>(() => toRows(initial.hours));
  const [dirty, setDirty] = useState(false);

  const update = (weekday: number, patch: Partial<DayRow>) => {
    setRows((prev) => ({ ...prev, [weekday]: { ...prev[weekday]!, ...patch } }));
    setDirty(true);
    save.reset();
  };

  // Client-side invariant: every OPEN day needs close > open.
  const invalidDays = WEEK.filter(({ weekday }) => {
    const r = rows[weekday]!;
    return r.open && hhmmToMinutes(r.openTime) >= hhmmToMinutes(r.closeTime);
  });

  const onSave = () => {
    if (invalidDays.length > 0) return;
    const payload: BusinessHour[] = WEEK.filter(({ weekday }) => rows[weekday]!.open).map(
      ({ weekday }) => {
        const r = rows[weekday]!;
        return {
          weekday,
          openMinute: hhmmToMinutes(r.openTime),
          closeMinute: hhmmToMinutes(r.closeTime),
        };
      },
    );
    save.mutate(payload, { onSuccess: () => setDirty(false) });
  };

  const busy = save.isPending;

  return (
    <div className="flex flex-col gap-4">
      {save.isError && (
        <Alert tone="error">
          No pudimos guardar el horario. Revisa los valores e inténtalo de nuevo.
        </Alert>
      )}
      {save.isSuccess && !dirty && <Alert tone="success">Horario guardado.</Alert>}
      {invalidDays.length > 0 && (
        <Alert tone="error">
          La hora de cierre debe ser posterior a la de apertura en:{' '}
          {invalidDays.map((d) => d.label).join(', ')}.
        </Alert>
      )}

      <ul className="flex flex-col divide-y divide-border-soft rounded-md border border-border-soft">
        {WEEK.map(({ weekday, label }) => {
          const r = rows[weekday]!;
          const openId = `open-${weekday}`;
          const closeId = `close-${weekday}`;
          const rowInvalid =
            r.open && hhmmToMinutes(r.openTime) >= hhmmToMinutes(r.closeTime);
          return (
            <li
              key={weekday}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <label className="flex min-w-[8rem] items-center gap-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-border text-primary focus:ring-foreground"
                  checked={r.open}
                  onChange={(e) => update(weekday, { open: e.target.checked })}
                />
                <span className="text-base font-medium">{label}</span>
              </label>

              {r.open ? (
                <div className="flex items-center gap-2">
                  <label htmlFor={openId} className="sr-only">
                    Apertura {label}
                  </label>
                  <Select
                    id={openId}
                    className="h-11 w-28"
                    invalid={rowInvalid}
                    value={r.openTime}
                    onChange={(e) => update(weekday, { openTime: e.target.value })}
                  >
                    {options.slice(0, -1).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </Select>
                  <span className="text-muted-foreground">—</span>
                  <label htmlFor={closeId} className="sr-only">
                    Cierre {label}
                  </label>
                  <Select
                    id={closeId}
                    className="h-11 w-28"
                    invalid={rowInvalid}
                    value={r.closeTime}
                    onChange={(e) => update(weekday, { closeTime: e.target.value })}
                  >
                    {options.slice(1).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.value}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <span
                  className={cn(
                    'text-sm text-muted-foreground sm:min-w-[14rem] sm:text-right',
                  )}
                >
                  Cerrado
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onSave}
          loading={busy}
          disabled={!dirty || invalidDays.length > 0}
        >
          <Clock className="h-4 w-4" aria-hidden />
          Guardar horario
        </Button>
        {!dirty && !save.isSuccess && (
          <span className="text-sm text-muted-foreground">
            Marca los días que abres y define sus horas.
          </span>
        )}
      </div>
    </div>
  );
}
