import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  createBusinessInputSchema,
  type CreateBusinessInput,
} from '../../entities/business/model';
import { useCreateBusiness } from '../../entities/business/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Field, Alert } from '../../shared/ui/Field';
import { browserTimezone, timezoneOptions } from '../../shared/lib/timezones';
import { toBusinessErrorMessage } from './error-message';

export function CreateBusinessForm() {
  const navigate = useNavigate();
  const create = useCreateBusiness();
  const zones = useMemo(() => timezoneOptions(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessInputSchema),
    defaultValues: { timezone: browserTimezone(), slug: '' },
  });

  const onSubmit = handleSubmit((values) => {
    const payload: CreateBusinessInput = {
      name: values.name,
      timezone: values.timezone,
      ...(values.slug ? { slug: values.slug } : {}),
    };
    create.mutate(payload, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    });
  });

  const busy = isSubmitting || create.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {create.isError && (
        <Alert tone="error">{toBusinessErrorMessage(create.error)}</Alert>
      )}

      <Field label="Nombre del negocio" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          type="text"
          autoComplete="organization"
          placeholder="Barbería El Corte"
          invalid={!!errors.name}
          {...register('name')}
        />
      </Field>

      <Field
        label="Zona horaria"
        htmlFor="timezone"
        error={errors.timezone?.message}
      >
        <Select id="timezone" invalid={!!errors.timezone} {...register('timezone')}>
          {zones.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Identificador (opcional)"
        htmlFor="slug"
        error={errors.slug?.message}
      >
        <Input
          id="slug"
          type="text"
          placeholder="barberia-el-corte"
          invalid={!!errors.slug}
          {...register('slug')}
        />
        <p className="text-sm text-muted-foreground">
          Se usará en tu URL pública. Si lo dejas vacío, lo generamos del nombre.
        </p>
      </Field>

      <Button type="submit" size="full" loading={busy}>
        Crear negocio
      </Button>
    </form>
  );
}
