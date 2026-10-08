import { Loader2 } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { EditBusinessForm } from '../../features/business/EditBusinessForm';
import { useCurrentBusiness } from '../../entities/business/api';
import { Alert } from '../../shared/ui/Field';

export function BusinessSettingsPage() {
  const { data, isLoading, isError } = useCurrentBusiness();

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Datos del negocio
        </h1>
        <p className="mt-2 text-base text-body">
          Actualiza el nombre y la zona horaria de tu negocio.
        </p>

        <div className="mt-6">
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando…
            </div>
          )}
          {isError && (
            <Alert tone="error">
              No pudimos cargar los datos del negocio. Recarga la página.
            </Alert>
          )}
          {data && <EditBusinessForm business={data} />}
        </div>
      </div>
    </AppShell>
  );
}
