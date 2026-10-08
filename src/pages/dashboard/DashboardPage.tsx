import { AppShell } from '../../widgets/app-shell/AppShell';

export function DashboardPage() {
  return (
    <AppShell>
      <h1 className="text-[22px] font-semibold tracking-tight">Panel</h1>
      <p className="mt-2 text-base text-body">
        Métricas del negocio: citas de hoy, próximas citas, clientes y estado.
        (Widgets pendientes en feat/dashboard.)
      </p>
    </AppShell>
  );
}
