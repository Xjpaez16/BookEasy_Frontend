import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateBusinessInputSchema,
  type Business,
  type UpdateBusinessInput,
} from '../../entities/business/model';
import { useUpdateBusiness } from '../../entities/business/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Field, Alert } from '../../shared/ui/Field';
import { timezoneOptions } from '../../shared/lib/timezones';
import { toBusinessErrorMessage } from './error-message';

export function EditBusinessForm({ business }: { business: Business }) {
  const update = useUpdateBusiness();
  const zones = useMemo(() => timezoneOptions(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateBusinessInput>({
    resolver: zodResolver(updateBusinessInputSchema),
    defaultValues: { name: business.name, timezone: business.timezone },
  });

  const onSubmit = handleSubmit((values) => update.mutate(values));
  const busy = isSubmitting || update.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {update.isError && (
        <Alert tone="error">{toBusinessErrorMessage(update.error)}</Alert>
      )}
      {update.isSuccess && !isDirty && (
        <Alert tone="success">Datos del negocio actualizados.</Alert>
      )}

      <Field label="Nombre del negocio" htmlFor="name" error={errors.name?.message}>
        <Input id="name" type="text" invalid={!!errors.name} {...register('name')} />
      </Field>

      <Field label="Zona horaria" htmlFor="timezone" error={errors.timezone?.message}>
        <Select id="timezone" invalid={!!errors.timezone} {...register('timezone')}>
          {zones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Identificador" htmlFor="slug">
        <Input id="slug" type="text" value={business.slug} disabled readOnly />
        <p className="text-sm text-muted-foreground">
          El identificador no se puede cambiar una vez creado.
        </p>
      </Field>

      <div>
        <Button type="submit" loading={busy} disabled={!isDirty}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
