import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  customerFormSchema,
  type CustomerFormValues,
  type Customer,
} from '../../entities/customer/model';
import {
  useCreateCustomer,
  useUpdateCustomer,
  type CustomerWritePayload,
} from '../../entities/customer/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toCatalogErrorMessage } from '../catalog/error-message';

/** Empty string -> null, so the backend clears an optional field on edit. */
function nullable(v: string | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

/**
 * Create or edit a customer. Pass `customer` to edit; omit to create.
 * `onDone` closes the editor.
 */
export function CustomerForm({
  customer,
  onDone,
}: {
  customer?: Customer;
  onDone: () => void;
}) {
  const create = useCreateCustomer();
  const update = useUpdateCustomer();
  const editing = !!customer;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          fullName: customer.fullName,
          phone: customer.phone ?? '',
          email: customer.email ?? '',
          notes: customer.notes ?? '',
        }
      : { fullName: '', phone: '', email: '', notes: '' },
  });

  const onSubmit = handleSubmit((values) => {
    const payload: CustomerWritePayload = {
      fullName: values.fullName,
      phone: nullable(values.phone),
      email: nullable(values.email),
      notes: nullable(values.notes),
    };
    if (editing && customer) {
      update.mutate(
        { customerId: customer.id, payload },
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

      <Field
        label="Nombre completo"
        htmlFor="cust-name"
        error={errors.fullName?.message}
      >
        <Input
          id="cust-name"
          type="text"
          autoComplete="name"
          invalid={!!errors.fullName}
          {...register('fullName')}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono (opcional)" htmlFor="cust-phone" error={errors.phone?.message}>
          <Input
            id="cust-phone"
            type="tel"
            autoComplete="tel"
            invalid={!!errors.phone}
            {...register('phone')}
          />
        </Field>

        <Field label="Correo (opcional)" htmlFor="cust-email" error={errors.email?.message}>
          <Input
            id="cust-email"
            type="email"
            autoComplete="email"
            invalid={!!errors.email}
            {...register('email')}
          />
        </Field>
      </div>

      <Field label="Notas (opcional)" htmlFor="cust-notes" error={errors.notes?.message}>
        <Input id="cust-notes" type="text" {...register('notes')} />
      </Field>

      <div className="flex gap-3">
        <Button type="submit" loading={busy}>
          {editing ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
        <Button type="button" variant="tertiary" onClick={onDone} disabled={busy}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
