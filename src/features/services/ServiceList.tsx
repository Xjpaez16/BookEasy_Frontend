import { Loader2, Pencil } from 'lucide-react';
import type { Service } from '../../entities/service/model';
import { useDeleteService } from '../../entities/service/api';
import { formatMoney, formatDuration } from '../../shared/lib/money';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';
import { toCatalogErrorMessage } from '../catalog/error-message';

function ServiceRow({
  service,
  onEdit,
}: {
  service: Service;
  onEdit: (s: Service) => void;
}) {
  const remove = useDeleteService();

  return (
    <>
      <tr className="border-b border-border-soft last:border-0">
        <td className="py-3 pr-4">
          <span className="font-medium text-foreground">{service.name}</span>
          {service.description && (
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {service.description}
            </span>
          )}
        </td>
        <td className="py-3 pr-4 text-body">
          {formatDuration(service.durationMinutes)}
        </td>
        <td className="py-3 pr-4 text-body">
          {formatMoney(service.priceMinor, service.currency)}
        </td>
        <td className="py-3 text-right">
          <Button variant="tertiary" size="sm" onClick={() => onEdit(service)}>
            <Pencil className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Editar</span>
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            loading={remove.isPending}
            onClick={() => remove.mutate(service.id)}
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

export function ServiceList({
  services,
  onEdit,
}: {
  services: Service[];
  onEdit: (s: Service) => void;
}) {
  if (services.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border px-4 py-8 text-center text-body">
        Aún no tienes servicios. Crea el primero para poder agendar citas.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-left text-base">
      <thead>
        <tr className="border-b border-border-soft text-sm text-muted-foreground">
          <th className="py-2 pr-4 font-medium">Servicio</th>
          <th className="py-2 pr-4 font-medium">Duración</th>
          <th className="py-2 pr-4 font-medium">Precio</th>
          <th className="py-2" />
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <ServiceRow key={service.id} service={service} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
  );
}
