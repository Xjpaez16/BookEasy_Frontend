import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type {
  PublicServiceItem,
  PublicStorefront,
} from '../../entities/public-catalog/model';
import { formatMoney, formatDuration } from '../../shared/lib/money';
import { Button } from '../../shared/ui/Button';
import { Stagger, StaggerItem } from '../../shared/ui/motion';

function ServiceRow({
  service,
  onBook,
}: {
  service: PublicServiceItem;
  onBook: (serviceId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-background p-4">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-foreground">
          {service.name}
        </h3>
        {service.description && (
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
            {service.description}
          </p>
        )}
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-body">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {formatDuration(service.durationMinutes)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-base font-semibold text-foreground">
          {formatMoney(service.priceMinor, service.currency)}
        </div>
        <Button
          size="sm"
          className="mt-2"
          onClick={() => onBook(service.id)}
          aria-label={`Reservar ${service.name}`}
        >
          Reservar
        </Button>
      </div>
    </div>
  );
}

/**
 * The storefront's service menu. "Reservar" starts the booking flow by routing
 * to the business's protected booking route with the chosen service; the route
 * guard sends an unauthenticated visitor to login with a returnTo back here
 * (Fresha-style deferred auth). The actual scheduling UI is feat/calendar-ui.
 */
export function ServiceMenu({ storefront }: { storefront: PublicStorefront }) {
  const navigate = useNavigate();

  const onBook = (serviceId: string) => {
    navigate(`/b/${storefront.slug}/book?service=${encodeURIComponent(serviceId)}`);
  };

  if (storefront.services.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border px-4 py-10 text-center text-body">
        Este negocio aún no publica servicios para reservar.
      </p>
    );
  }

  return (
    <Stagger className="flex flex-col gap-3">
      {storefront.services.map((s) => (
        <StaggerItem key={s.id}>
          <ServiceRow service={s} onBook={onBook} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
