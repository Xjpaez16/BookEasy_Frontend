import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inviteStaffInputSchema,
  type InviteStaffInput,
} from '../../entities/staff/model';
import { useInviteStaff } from '../../entities/staff/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Field, Alert } from '../../shared/ui/Field';
import { toStaffErrorMessage } from './error-message';

/**
 * Invite / add a staff member. OWNER-only (the parent page only renders this
 * for owners; the backend enforces the role regardless). On success the list
 * is invalidated and the form resets for the next invite.
 */
export function InviteStaffForm() {
  const invite = useInviteStaff();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteStaffInput>({
    resolver: zodResolver(inviteStaffInputSchema),
    defaultValues: { fullName: '', email: '', role: 'STAFF' },
  });

  const onSubmit = handleSubmit((values) =>
    invite.mutate(values, { onSuccess: () => reset() }),
  );
  const busy = isSubmitting || invite.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {invite.isError && (
        <Alert tone="error">{toStaffErrorMessage(invite.error)}</Alert>
      )}
      {invite.isSuccess && (
        <Alert tone="success">
          {invite.data?.created
            ? 'Invitación enviada. La persona completará su acceso al restablecer la contraseña.'
            : 'Miembro añadido al equipo.'}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre completo"
          htmlFor="staff-fullName"
          error={errors.fullName?.message}
        >
          <Input
            id="staff-fullName"
            type="text"
            autoComplete="name"
            invalid={!!errors.fullName}
            {...register('fullName')}
          />
        </Field>

        <Field label="Correo" htmlFor="staff-email" error={errors.email?.message}>
          <Input
            id="staff-email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>
      </div>

      <Field label="Rol" htmlFor="staff-role" error={errors.role?.message}>
        <Select id="staff-role" invalid={!!errors.role} {...register('role')}>
          <option value="STAFF">Staff</option>
          <option value="OWNER">Propietario</option>
        </Select>
      </Field>

      <div>
        <Button type="submit" loading={busy}>
          Añadir al equipo
        </Button>
      </div>
    </form>
  );
}
