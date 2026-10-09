import { useState } from 'react';
import { Loader2, Plus, Search } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { CustomerList } from '../../features/customers/CustomerList';
import { CustomerForm } from '../../features/customers/CustomerForm';
import { useCustomerList } from '../../entities/customer/api';
import type { Customer } from '../../entities/customer/model';
import { useDebouncedValue } from '../../shared/lib/useDebouncedValue';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Alert } from '../../shared/ui/Field';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data: customers, isLoading, isError } = useCustomerList(debouncedSearch);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const showForm = creating || editing !== null;

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight">Clientes</h1>
            <p className="mt-2 text-base text-body">
              Tu agenda de contactos para agendar y recordar citas.
            </p>
          </div>
          {!showForm && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              Nuevo cliente
            </Button>
          )}
        </div>

        {showForm && (
          <section className="mt-6 rounded-md border border-border p-5">
            <h2 className="mb-4 text-base font-semibold">
              {editing ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>
            <CustomerForm
              {...(editing ? { customer: editing } : {})}
              onDone={closeForm}
            />
          </section>
        )}

        <section className="mt-8">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Buscar por nombre, teléfono o correo…"
              aria-label="Buscar clientes"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando clientes…
            </div>
          )}
          {isError && (
            <Alert tone="error">
              No pudimos cargar los clientes. Recarga la página.
            </Alert>
          )}
          {customers && (
            <CustomerList
              customers={customers}
              hasSearch={debouncedSearch.trim().length > 0}
              onEdit={(c) => setEditing(c)}
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
