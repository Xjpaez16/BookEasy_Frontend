import { Loader2, Check, X, UserX } from 'lucide-react';
import type { Appointment } from '../../entities/appointment/model';
import { statusLabel } from '../../entities/appointment/model';
import { useTransitionAppointment } from '../../entities/appointment/api';
import { formatTime } from '../../shared/lib/datetime';
import { formatMoney } from '../../shared/lib/money';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';
import { toAppointmentErrorMessage } from '../appointments/error-message';

const statusTone: Record<Appointment['status'], string> = {
  SCHEDULED: 'bg-primary/10 text-primary',
  COMPLETED: 'bg-surface-strong text-foreground',
  CANCELLED: 'bg-surface-soft text-muted-foreground',
  NO_SHOW: 'bg-error/10 text-error',
};

function AppointmentRow({
  appt,
  timeZone,
}: {
  appt: Appointment;
  timeZone?: string | undefined;
}) {
  const transition = useTransitionAppointment();
  const isOpen = appt.status === 'SCHEDULED';

  return (
    <>
      <div className="flex items-center gap-4 rounded-md border border-border-soft bg-background p-4">
        <div className="w-20 shrink-0 text-sm font-semibold text-foreground">
          {formatTime(appt.startAt, timeZone)}
          <div className="text-xs font-normal text-muted-foreground">
            {formatTime(appt.endAt, timeZone)}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[appt.status]}`}
          >
            {statusLabel[appt.status]}
          </span>
          <p className="mt-1 text-sm text-body">
            {formatMoney(appt.priceMinor, appt.currency)}
            {appt.notes ? ` · ${appt.notes}` : ''}
          </p>
        </div>
        {isOpen && (
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="tertiary"
              size="sm"
              aria-label="Completar"
              loading={transition.isPending}
              onClick={() => transition.mutate({ id: appt.id, action: 'complete' })}
            >
              <Check className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              aria-label="No asistió"
              onClick={() => transition.mutate({ id: appt.id, action: 'no-show' })}
            >
              <UserX className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              aria-label="Cancelar"
              onClick={() => transition.mutate({ id: appt.id, action: 'cancel' })}
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
            {transition.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            )}
          </div>
        )}
      </div>
      {transition.isError && (
        <Alert tone="error">{toAppointmentErrorMessage(transition.error)}</Alert>
      )}
    </>
  );
}

export function DayCalendar({
  appointments,
  timeZone,
}: {
  appointments: Appointment[];
  timeZone?: string | undefined;
}) {
  if (appointments.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border-soft px-4 py-12 text-center text-body">
        No hay citas este día. Crea una con el botón de arriba.
      </p>
    );
  }

  const sorted = [...appointments].sort((a, b) =>
    a.startAt.localeCompare(b.startAt),
  );

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((appt) => (
        <AppointmentRow key={appt.id} appt={appt} timeZone={timeZone} />
      ))}
    </div>
  );
}
