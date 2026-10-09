import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Loader2, CalendarClock, ArrowLeft } from 'lucide-react';
import { PublicNav } from '../../widgets/public-nav/PublicNav';
import { usePublicStorefront } from '../../entities/public-catalog/api';
import { formatMoney, formatDuration } from '../../shared/lib/money';
import { Reveal } from '../../shared/ui/motion';
import { Alert } from '../../shared/ui/Field';

/**
 * Booking step — reached only when authenticated (RequireAuthForBooking).
 * For now it confirms the selected service and explains the next step; the
 * actual slot-picking + appointment creation lands in feat/calendar-ui. This
 * exists so the deferred-auth flow (browse → Reservar → login → back here) is
 * complete and testable end to end.
 */
export function BookingPage() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const serviceId = params.get('service');
  const { data: storefront, isLoading, isError } = usePublicStorefront(slug);

  const service = storefront?.services.find((s) => s.id === serviceId);

  return (
    <PublicNav>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-8">
        <Link
          to={`/b/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al negocio
        </Link>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20 text-base text-body">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Cargando…
          </div>
        )}
        {isError && (
          <div className="py-10">
            <Alert tone="error">No pudimos cargar este negocio.</Alert>
          </div>
        )}

        {storefront && (
          <Reveal>
            <div className="mt-6 rounded-md border border-border p-6">
              <div className="flex items-center gap-2 text-primary">
                <CalendarClock className="h-5 w-5" aria-hidden />
                <span className="text-sm font-semibold">Reservar en {storefront.name}</span>
              </div>

              {service ? (
                <div className="mt-4">
                  <h1 className="text-xl font-semibold">{service.name}</h1>
                  <p className="mt-1 text-base text-body">
                    {formatDuration(service.durationMinutes)} ·{' '}
                    {formatMoney(service.priceMinor, service.currency)}
                  </p>
                  <div className="mt-6 rounded-sm border border-dashed border-border bg-surface-soft/40 px-4 py-6 text-center text-body">
                    La selección de fecha y hora llegará muy pronto. Ya estás
                    autenticado y tu servicio quedó elegido.
                  </div>
                </div>
              ) : (
                <Alert tone="error">
                  No encontramos el servicio seleccionado. Vuelve al negocio y
                  elige de nuevo.
                </Alert>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </PublicNav>
  );
}
