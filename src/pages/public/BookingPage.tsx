import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, CalendarClock, ArrowLeft, Check } from 'lucide-react';
import { PublicNav } from '../../widgets/public-nav/PublicNav';
import { usePublicStorefront } from '../../entities/public-catalog/api';
import { useAvailability, useBookAppointment } from '../../entities/public-booking/api';
import { formatMoney, formatDuration } from '../../shared/lib/money';
import { formatTime, todayLocalDate } from '../../shared/lib/datetime';
import { Reveal } from '../../shared/ui/motion';
import { Alert } from '../../shared/ui/Field';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { ApiRequestError } from '../../shared/api/client';

/**
 * Booking checkout — reached only when authenticated (RequireAuthForBooking).
 * Flow: pick a date -> see the free slots for the chosen service -> confirm.
 * Slot times are shown in the VISITOR's own local timezone (that is the clock
 * they book against); the backend resolves the business timezone server-side.
 */
export function BookingPage() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = params.get('service') ?? '';

  const { data: storefront, isLoading, isError } = usePublicStorefront(slug);
  const service = storefront?.services.find((s) => s.id === serviceId);

  const [date, setDate] = useState(() => todayLocalDate());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const availability = useAvailability(slug, serviceId, date);
  const book = useBookAppointment(slug);

  const slots = availability.data?.slots ?? [];

  const errorMsg = useMemo(() => {
    const e = book.error;
    if (!e) return null;
    if (e instanceof ApiRequestError) {
      if (e.status === 409) return 'Ese horario acaba de ocuparse. Elige otro.';
      if (e.body?.message?.includes('business hours'))
        return 'Ese horario está fuera del horario de atención.';
      return e.body?.message ?? 'No pudimos completar la reserva.';
    }
    return 'No pudimos completar la reserva.';
  }, [book.error]);

  function confirm() {
    if (!selectedSlot) return;
    book.mutate(
      { serviceId, startAt: selectedSlot },
      {
        onSuccess: () => navigate(`/b/${slug}/my-appointments`),
      },
    );
  }

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

        {storefront && !service && (
          <div className="py-10">
            <Alert tone="error">
              No encontramos el servicio seleccionado. Vuelve al negocio y elige
              de nuevo.
            </Alert>
          </div>
        )}

        {storefront && service && (
          <Reveal>
            <div className="mt-6 rounded-md border border-border-soft p-6 shadow-float">
              <div className="flex items-center gap-2 text-primary">
                <CalendarClock className="h-5 w-5" aria-hidden />
                <span className="text-sm font-semibold">
                  Reservar en {storefront.name}
                </span>
              </div>

              <h1 className="mt-4 text-xl font-semibold">{service.name}</h1>
              <p className="mt-1 text-base text-body">
                {formatDuration(service.durationMinutes)} ·{' '}
                {formatMoney(service.priceMinor, service.currency)}
              </p>

              {/* Date picker */}
              <div className="mt-6">
                <label
                  htmlFor="book-date"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Elige el día
                </label>
                <Input
                  id="book-date"
                  type="date"
                  min={todayLocalDate()}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot(null);
                  }}
                  className="max-w-[12rem]"
                />
              </div>

              {/* Slots */}
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-medium">Horarios disponibles</h2>

                {availability.isLoading && (
                  <div className="flex items-center gap-2 py-6 text-sm text-body">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Buscando horarios…
                  </div>
                )}

                {availability.isError && (
                  <Alert tone="error">
                    No pudimos cargar los horarios. Prueba otra fecha.
                  </Alert>
                )}

                {!availability.isLoading &&
                  !availability.isError &&
                  slots.length === 0 && (
                    <p className="rounded-sm border border-dashed border-border-soft px-4 py-8 text-center text-sm text-body">
                      No hay horarios disponibles este día. Prueba con otra fecha.
                    </p>
                  )}

                {slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((iso) => {
                      const active = selectedSlot === iso;
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => setSelectedSlot(iso)}
                          aria-pressed={active}
                          className={[
                            'rounded-md border px-2 py-2 text-sm font-medium transition-colors',
                            active
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border-soft text-foreground hover:border-primary/50',
                          ].join(' ')}
                        >
                          {formatTime(iso)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="mt-4">
                  <Alert tone="error">{errorMsg}</Alert>
                </div>
              )}

              {/* Confirm */}
              <div className="mt-6 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={confirm}
                  disabled={!selectedSlot}
                  loading={book.isPending}
                >
                  <Check className="mr-1.5 h-4 w-4" aria-hidden />
                  Confirmar reserva
                </Button>
                {selectedSlot && (
                  <span className="text-sm text-body">
                    {formatTime(selectedSlot)} ·{' '}
                    {formatMoney(service.priceMinor, service.currency)}
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </PublicNav>
  );
}
