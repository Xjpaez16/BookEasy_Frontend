import { Loader2 } from 'lucide-react';
import { AppShell } from '../../widgets/app-shell/AppShell';
import { InviteStaffForm } from '../../features/staff/InviteStaffForm';
import { StaffList } from '../../features/staff/StaffList';
import { useStaffList } from '../../entities/staff/api';
import { useSession } from '../../entities/session/api';
import { Alert } from '../../shared/ui/Field';

export function StaffPage() {
  const { data: user } = useSession();
  const { data: members, isLoading, isError } = useStaffList();

  // The caller's role lives on their membership (not on /auth/me), so derive it
  // from the staff list. Only an active OWNER may manage the team.
  const myMembership = members?.find((m) => m.userId === user?.id);
  const canManage = myMembership?.role === 'OWNER' && myMembership.active;

  return (
    <AppShell>
      <div className="mx-auto max-w-page">
        <h1 className="text-[22px] font-semibold tracking-tight">Equipo</h1>
        <p className="mt-2 text-base text-body">
          Gestiona quién puede acceder y atender citas en tu negocio.
        </p>

        {canManage && (
          <section className="mt-6 rounded-md border border-border-soft p-6">
            <h2 className="text-base font-semibold">Añadir miembro</h2>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">
              Si la persona no tiene cuenta, se crea una provisional y completará
              su acceso restableciendo la contraseña.
            </p>
            <InviteStaffForm />
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-4 text-base font-semibold">Miembros</h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-base text-body">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Cargando equipo…
            </div>
          )}
          {isError && (
            <Alert tone="error">
              No pudimos cargar el equipo. Recarga la página.
            </Alert>
          )}
          {members && (
            <StaffList
              members={members}
              currentUserId={user?.id}
              canManage={canManage}
            />
          )}
        </section>
      </div>
    </AppShell>
  );
}
