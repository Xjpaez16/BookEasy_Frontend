import { Loader2 } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { BusinessHoursForm } from '../../features/business-hours/BusinessHoursForm';
import { useBusinessHours } from '../../entities/business-hours/api';
import { Alert } from '../../shared/ui/Field';

export function BusinessHoursPage() {
  const { data, isLoading, isError } = useBusinessHours();

  return (
    <AppShell>
      <div className="mx-auto max-w-page">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Horario de atención
        </h1>
        <p className="mt-2 text-base text-body">
          Define los días y las horas en que tu negocio recibe citas. Solo se
          podrán agendar citas dentro de estas ventanas.
        </p>

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando horario…
            </div>
          )}
          {isError && (
            <Alert tone="error">
              No pudimos cargar el horario. Recarga la página.
            </Alert>
          )}
          {data && <BusinessHoursForm initial={data} />}
        </div>
      </div>
    </AppShell>
  );
}
