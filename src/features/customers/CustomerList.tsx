import { Loader2, Pencil } from 'lucide-react';
import type { Customer } from '../../entities/customer/model';
import { useDeleteCustomer } from '../../entities/customer/api';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';
import { toCatalogErrorMessage } from '../catalog/error-message';

function CustomerRow({
  customer,
  onEdit,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
}) {
  const remove = useDeleteCustomer();

  return (
    <>
      <tr className="border-b border-border-soft last:border-0">
        <td className="py-3 pr-4">
          <span className="font-medium text-foreground">{customer.fullName}</span>
          {customer.notes && (
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {customer.notes}
            </span>
          )}
        </td>
        <td className="py-3 pr-4 text-body">{customer.phone ?? '—'}</td>
        <td className="py-3 pr-4 text-body">{customer.email ?? '—'}</td>
        <td className="py-3 text-right">
          <Button variant="tertiary" size="sm" onClick={() => onEdit(customer)}>
            <Pencil className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            loading={remove.isPending}
            onClick={() => remove.mutate(customer.id)}
          >
            Eliminar
          </Button>
          {remove.isPending && (
            <Loader2 className="ml-2 inline h-4 w-4 animate-spin" aria-hidden />
          )}
        </td>
      </tr>
      {remove.isError && (
        <tr>
          <td colSpan={4} className="pb-3">
            <Alert tone="error">{toCatalogErrorMessage(remove.error)}</Alert>
          </td>
        </tr>
      )}
    </>
  );
}

export function CustomerList({
  customers,
  hasSearch,
  onEdit,
}: {
  customers: Customer[];
  hasSearch: boolean;
  onEdit: (c: Customer) => void;
}) {
  if (customers.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border px-4 py-8 text-center text-body">
        {hasSearch
          ? 'Ningún cliente coincide con tu búsqueda.'
          : 'Aún no tienes clientes. Añade el primero para agendarle citas.'}
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-left text-base">
      <thead>
        <tr className="border-b border-border-soft text-sm text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Cliente</th>
          <th className="py-2 pr-4 font-medium">Teléfono</th>
          <th className="py-2 pr-4 font-medium">Correo</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
  );
}
