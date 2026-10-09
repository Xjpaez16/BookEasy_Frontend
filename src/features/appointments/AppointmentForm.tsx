import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  appointmentFormSchema,
  type AppointmentFormValues,
} from '../../entities/appointment/model';
import { useCreateAppointment } from '../../entities/appointment/api';
import { useCustomerList } from '../../entities/customer/api';
import { useServiceList } from '../../entities/service/api';
import { useStaffList } from '../../entities/staff/api';
import { toIsoWithOffset, todayLocalDate } from '../../shared/lib/datetime';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Field, Alert } from '../../shared/ui/Field';
import { toAppointmentErrorMessage } from './error-message';

/**
 * Create an appointment. Pulls customers/services/active-staff from their
 * entities for the selectors; assembles the picked date+time into an ISO offset
 * startAt. The backend enforces overlap, business hours and active staff/service.
 */
export function AppointmentForm({
  defaultDate,
  onDone,
}: {
  defaultDate?: string;
  onDone: () => void;
}) {
  const create = useCreateAppointment();
  const customers = useCustomerList('');
  const services = useServiceList();
  const staff = useStaffList();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: defaultDate ?? todayLocalDate(),
      time: '09:00',
      notes: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    const startAt = toIsoWithOffset(values.date, values.time);
    create.mutate(
      {
        customerId: values.customerId,
        serviceId: values.serviceId,
        staffId: values.staffId,
        startAt,
        notes: values.notes?.trim() ? values.notes.trim() : null,
      },
      { onSuccess: () => onDone() },
    );
  });

  const busy = isSubmitting || create.isPending;
  const activeStaff = (staff.data ?? []).filter((m) => m.active);
  const activeServices = (services.data ?? []).filter((s) => s.active);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {create.isError && (
        <Alert tone="error">{toAppointmentErrorMessage(create.error)}</Alert>
      )}

      <Field label="Cliente" htmlFor="appt-customer" error={errors.customerId?.message}>
        <Select id="appt-customer" invalid={!!errors.customerId} {...register('customerId')}>
          <option value="">Selecciona…</option>
          {(customers.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Servicio" htmlFor="appt-service" error={errors.serviceId?.message}>
          <Select id="appt-service" invalid={!!errors.serviceId} {...register('serviceId')}>
            <option value="">Selecciona…</option>
            {activeServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Atiende" htmlFor="appt-staff" error={errors.staffId?.message}>
          <Select id="appt-staff" invalid={!!errors.staffId} {...register('staffId')}>
            <option value="">Selecciona…</option>
            {activeStaff.map((m) => (
              <option key={m.membershipId} value={m.membershipId}>
                {m.userId.slice(0, 8)}…
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fecha" htmlFor="appt-date" error={errors.date?.message}>
          <Input id="appt-date" type="date" invalid={!!errors.date} {...register('date')} />
        </Field>
        <Field label="Hora" htmlFor="appt-time" error={errors.time?.message}>
          <Input id="appt-time" type="time" invalid={!!errors.time} {...register('time')} />
        </Field>
      </div>

      <Field label="Notas (opcional)" htmlFor="appt-notes" error={errors.notes?.message}>
        <Input id="appt-notes" type="text" {...register('notes')} />
      </Field>

      <div className="flex gap-3">
        <Button type="submit" loading={busy}>
          Crear cita
        </Button>
        <Button type="button" variant="tertiary" onClick={onDone} disabled={busy}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
