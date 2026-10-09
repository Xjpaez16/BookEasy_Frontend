import { useState } from 'react';
import { CalendarClock, X } from 'lucide-react';
import type { PublicAppointment } from '../../entities/public-booking/model';
import { useCancelMyAppointment } from '../../entities/public-booking/api';
import { formatMoney } from '../../shared/lib/money';
import { formatDay, formatTime } from '../../shared/lib/datetime';
import { Button } from '../../shared/ui/Button';

const STATUS_LABEL: Record<PublicAppointment['status'], string> = {
  SCHEDULED: 'Programada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asististe',
};

function StatusChip({ status }: { status: PublicAppointment['status'] }) {
  const tone =
    status === 'SCHEDULED'
      ? 'bg-primary/10 text-primary'
      : status === 'COMPLETED'
        ? 'bg-foreground/10 text-foreground'
        : 'bg-muted text-muted-foreground';
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function AppointmentRow({
  appt,
  slug,
}: {
  appt: PublicAppointment;
  slug: string;
}) {
  const cancel = useCancelMyAppointment(slug);
  const [confirming, setConfirming] = useState(false);
  // Times are shown in the visitor's own local timezone (no timeZone arg).
  const canModify = appt.status === 'SCHEDULED';

  return (
    <li className="flex items-start justify-between gap-4 rounded-md border border-border-soft p-4">
      <div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="font-medium">
            {formatDay(appt.startAt)} · {formatTime(appt.startAt)}
          </span>
          <StatusChip status={appt.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatMoney(appt.priceMinor, appt.currency)}
          {appt.notes ? ` · ${appt.notes}` : ''}
        </p>
      </div>

      {canModify && (
        <div className="shrink-0">
          {confirming ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={cancel.isPending}
                onClick={() => cancel.mutate(appt.id)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Confirmar
              </Button>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                disabled={cancel.isPending}
                onClick={() => setConfirming(false)}
              >
                No
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setConfirming(true)}
            >
              <X className="mr-1 h-3.5 w-3.5" aria-hidden />
              Cancelar
            </Button>
          )}
        </div>
      )}
    </li>
  );
}

export function MyAppointmentsList({
  appointments,
  slug,
}: {
  appointments: PublicAppointment[];
  slug: string;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {appointments.map((a) => (
        <AppointmentRow key={a.id} appt={a} slug={slug} />
      ))}
    </ul>
  );
}
