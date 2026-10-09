import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  serviceFormSchema,
  type ServiceFormValues,
  type Service,
} from '../../entities/service/model';
import {
  useCreateService,
  useUpdateService,
  type ServiceWritePayload,
} from '../../entities/service/api';
import { parseMoneyToMinor, minorToMajorString } from '../../shared/lib/money';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toCatalogErrorMessage } from '../catalog/error-message';

/**
 * Create or edit a service. Price is edited as a human decimal and converted to
 * integer minor units before hitting the API (never float money on the wire).
 * Pass `service` to edit; omit it to create. `onDone` closes the editor.
 */
export function ServiceForm({
  service,
  onDone,
}: {
  service?: Service;
  onDone: () => void;
}) {
  const create = useCreateService();
  const update = useUpdateService();
  const editing = !!service;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description ?? '',
          durationMinutes: service.durationMinutes,
          price: minorToMajorString(service.priceMinor, service.currency),
          currency: service.currency,
        }
      : {
          name: '',
          description: '',
          durationMinutes: 30,
          price: '',
          currency: 'COP',
        },
  });

  const onSubmit = handleSubmit((values) => {
    const priceMinor =
      values.price && values.price !== ''
        ? parseMoneyToMinor(values.price, values.currency)
        : 0;

    const payload: ServiceWritePayload = {
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      durationMinutes: values.durationMinutes,
      priceMinor: priceMinor ?? 0,
      currency: values.currency.toUpperCase(),
    };

    if (editing && service) {
      update.mutate(
        { serviceId: service.id, payload },
        { onSuccess: () => onDone() },
      );
    } else {
      create.mutate(payload, { onSuccess: () => onDone() });
    }
  });

  const mutation = editing ? update : create;
  const busy = isSubmitting || mutation.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {mutation.isError && (
        <Alert tone="error">{toCatalogErrorMessage(mutation.error)}</Alert>
      )}

      <Field label="Nombre" htmlFor="svc-name" error={errors.name?.message}>
        <Input
          id="svc-name"
          type="text"
          invalid={!!errors.name}
          {...register('name')}
        />
      </Field>

      <Field
        label="Descripción (opcional)"
        htmlFor="svc-desc"
        error={errors.description?.message}
      >
        <Input id="svc-desc" type="text" {...register('description')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Duración (min)"
          htmlFor="svc-duration"
          error={errors.durationMinutes?.message}
        >
          <Input
            id="svc-duration"
            type="number"
            min={1}
            max={1440}
            invalid={!!errors.durationMinutes}
            {...register('durationMinutes')}
          />
        </Field>

        <Field label="Precio" htmlFor="svc-price" error={errors.price?.message}>
          <Input
            id="svc-price"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            invalid={!!errors.price}
            {...register('price')}
          />
        </Field>

        <Field
          label="Moneda"
          htmlFor="svc-currency"
          error={errors.currency?.message}
        >
          <Input
            id="svc-currency"
            type="text"
            maxLength={3}
            placeholder="COP"
            className="uppercase"
            invalid={!!errors.currency}
            {...register('currency')}
          />
        </Field>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={busy}>
          {editing ? 'Guardar cambios' : 'Crear servicio'}
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={onDone}
          disabled={busy}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
