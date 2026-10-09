import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { ServiceList } from '../../features/services/ServiceList';
import { useServiceEditing } from '../../features/services/useServiceEditing';
import { ServiceForm } from '../../features/services/ServiceForm';
import { useServiceList } from '../../entities/service/api';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';

export function ServicesPage() {
  const { data: services, isLoading, isError } = useServiceList();
  const { editing, edit, clear } = useServiceEditing();
  const [creating, setCreating] = useState(false);

  const showForm = creating || editing !== null;

  return (
    <AppShell>
      <div className="mx-auto max-w-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">Servicios</h1>
            <p className="mt-2 text-base text-body">
              Define lo que ofreces: duración y precio por servicio.
            </p>
          </div>
          {!showForm && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              Nuevo servicio
            </Button>
          )}
        </div>

        {showForm && (
          <section className="mt-6 rounded-md border border-border-soft p-6">
            <h2 className="mb-4 text-base font-semibold">
              {editing ? 'Editar servicio' : 'Nuevo servicio'}
            </h2>
            <ServiceForm
              {...(editing ? { service: editing } : {})}
              onDone={() => {
                clear();
                setCreating(false);
              }}
            />
          </section>
        )}

        <section className="mt-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando servicios…
            </div>
          )}
          {isError && (
            <Alert tone="error">
              No pudimos cargar los servicios. Recarga la página.
            </Alert>
          )}
          {services && <ServiceList services={services} onEdit={edit} />}
        </section>
      </div>
    </AppShell>
  );
}
