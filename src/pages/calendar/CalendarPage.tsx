import { useState } from 'react';
import { Loader2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { DayCalendar } from '../../features/calendar/DayCalendar';
import { AppointmentForm } from '../../features/appointments/AppointmentForm';
import { useAppointments } from '../../entities/appointment/api';
import { useCurrentBusiness } from '../../entities/business/api';
import { useBusinessHours } from '../../entities/business-hours/api';
import {
  dayRangeIso,
  todayLocalDate,
  shiftDate,
  formatDay,
} from '../../shared/lib/datetime';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';

export function CalendarPage() {
  const [date, setDate] = useState(todayLocalDate());
  const [creating, setCreating] = useState(false);
  const { data: business } = useCurrentBusiness();
  const { data: hours } = useBusinessHours();
  const range = dayRangeIso(date);
  const { data: appointments, isLoading, isError } = useAppointments(range);

  const prettyDay = formatDay(`${date}T12:00`, undefined);
  const noHours = hours !== undefined && hours.hours.length === 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">Agenda</h1>
            <p className="mt-2 text-base text-body">
              Tus citas del día. Crea, completa o cancela.
            </p>
          </div>
          {!creating && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              Nueva cita
            </Button>
          )}
        </div>

        {/* Date navigator */}
        <div className="mt-6 flex items-center justify-between rounded-md border border-border-soft bg-background p-3">
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Día anterior"
            onClick={() => setDate((d) => shiftDate(d, -1))}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold capitalize">{prettyDay}</span>
            <button
              type="button"
              className="text-sm font-semibold text-primary hover:underline"
              onClick={() => setDate(todayLocalDate())}
            >
              Hoy
            </button>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            aria-label="Día siguiente"
            onClick={() => setDate((d) => shiftDate(d, 1))}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        {noHours && (
          <div className="mt-6">
            <Alert tone="error">
              Aún no has configurado el horario de atención. Las citas deben caer
              dentro del horario del negocio, así que configúralo antes de agendar.
            </Alert>
          </div>
        )}

        {creating && (
          <section className="mt-6 rounded-md border border-border-soft p-6">
            <h2 className="mb-4 text-base font-semibold">Nueva cita</h2>
            <AppointmentForm defaultDate={date} onDone={() => setCreating(false)} />
          </section>
        )}

        <section className="mt-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando agenda…
            </div>
          )}
          {isError && (
            <Alert tone="error">No pudimos cargar la agenda. Recarga la página.</Alert>
          )}
          {appointments && (
            <DayCalendar appointments={appointments} timeZone={business?.timezone} />
          )}
        </section>
      </div>
    </AppShell>
  );
}
