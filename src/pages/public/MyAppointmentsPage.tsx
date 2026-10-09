import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, CalendarPlus } from 'lucide-react';
import { PublicNav } from '../../widgets/public-nav/PublicNav';
import { useMyAppointments } from '../../entities/public-booking/api';
import { MyAppointmentsList } from '../../features/storefront/MyAppointmentsList';
import { Reveal } from '../../shared/ui/motion';
import { Alert } from '../../shared/ui/Field';
import { ApiRequestError } from '../../shared/api/client';

/**
 * "My appointments" for a storefront — a visitor's OWN bookings only.
 * Protected by RequireAuthForBooking. A 404 from the API means the user has
 * never booked here: that is an empty state, not an error.
 */
export function MyAppointmentsPage() {
  const { slug = '' } = useParams();
  const { data, isLoading, error } = useMyAppointments(slug);

  // 404 => no bookings here (expected). Any other error is a real failure.
  const isEmpty404 =
    error instanceof ApiRequestError && error.status === 404;
  const isRealError = error && !isEmpty404;

  return (
    <PublicNav>
      <div className="mx-auto max-w-content px-4 py-10 sm:px-8">
        <Link
          to={`/b/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver al negocio
        </Link>

        <Reveal>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Mis reservas
          </h1>
        </Reveal>

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando tus reservas…
            </div>
          )}

          {isRealError && (
            <Alert tone="error">
              No pudimos cargar tus reservas. Recarga la página.
            </Alert>
          )}

          {(isEmpty404 || (data && data.length === 0)) && !isLoading && (
            <div className="rounded-md border border-dashed border-border-soft px-4 py-16 text-center">
              <p className="text-base font-medium text-foreground">
                Aún no tienes reservas aquí
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Elige un servicio y reserva tu primer turno.
              </p>
              <Link
                to={`/b/${slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <CalendarPlus className="h-4 w-4" aria-hidden />
                Ver servicios
              </Link>
            </div>
          )}

          {data && data.length > 0 && (
            <MyAppointmentsList appointments={data} slug={slug} />
          )}
        </div>
      </div>
    </PublicNav>
  );
}
