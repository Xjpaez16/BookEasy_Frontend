import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { StaffMember, MembershipRole } from '../../entities/staff/model';
import {
  useChangeStaffRole,
  useDeactivateStaff,
} from '../../entities/staff/api';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { Alert } from '../../shared/ui/Field';
import { toStaffErrorMessage } from './error-message';

function roleLabel(role: MembershipRole): string {
  return role === 'OWNER' ? 'Propietario' : 'Staff';
}

function StaffRow({
  member,
  isSelf,
  canManage,
}: {
  member: StaffMember;
  isSelf: boolean;
  canManage: boolean;
}) {
  const changeRole = useChangeStaffRole();
  const deactivate = useDeactivateStaff();
  const busy = changeRole.isPending || deactivate.isPending;
  const rowError = changeRole.error ?? deactivate.error;

  const onRole = (role: MembershipRole) => {
    if (role !== member.role) {
      changeRole.mutate({ membershipId: member.membershipId, role });
    }
  };

  return (
    <>
      <tr className="border-b border-border last:border-0">
        <td className="py-3 pr-4">
          <span className="font-medium text-foreground">
            {member.userId.slice(0, 8)}…
          </span>
          {isSelf && (
            <span className="ml-2 rounded-full bg-surface-soft px-2 py-0.5 text-xs text-muted-foreground">
              Tú
            </span>
          )}
        </td>
        <td className="py-3 pr-4">
          {canManage && member.active && !isSelf ? (
            <Select
              aria-label={`Rol de ${member.userId.slice(0, 8)}`}
              className="h-10"
              value={member.role}
              disabled={busy}
              onChange={(e) => onRole(e.target.value as MembershipRole)}
            >
              <option value="STAFF">Staff</option>
              <option value="OWNER">Propietario</option>
            </Select>
          ) : (
            <span className="text-body">{roleLabel(member.role)}</span>
          )}
        </td>
        <td className="py-3 pr-4">
          <span
            className={
              member.active
                ? 'inline-flex items-center gap-1.5 text-sm text-foreground'
                : 'inline-flex items-center gap-1.5 text-sm text-muted-foreground'
            }
          >
            <span
              className={
                member.active
                  ? 'h-2 w-2 rounded-full bg-primary'
                  : 'h-2 w-2 rounded-full bg-border-strong'
              }
              aria-hidden
            />
            {member.active ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td className="py-3 text-right">
          {canManage && member.active && !isSelf && (
            <Button
              variant="tertiary"
              size="sm"
              loading={deactivate.isPending}
              disabled={busy}
              onClick={() => deactivate.mutate(member.membershipId)}
            >
              Desactivar
            </Button>
          )}
          {busy && !deactivate.isPending && (
            <Loader2 className="ml-2 inline h-4 w-4 animate-spin" aria-hidden />
          )}
        </td>
      </tr>
      {rowError && (
        <tr>
          <td colSpan={4} className="pb-3">
            <Alert tone="error">{toStaffErrorMessage(rowError)}</Alert>
          </td>
        </tr>
      )}
    </>
  );
}

export function StaffList({
  members,
  currentUserId,
  canManage,
}: {
  members: StaffMember[];
  currentUserId: string | undefined;
  canManage: boolean;
}) {
  const [showInactive, setShowInactive] = useState(false);
  const visible = showInactive ? members : members.filter((m) => m.active);

  if (members.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border px-4 py-8 text-center text-body">
        Aún no hay miembros en el equipo. Añade el primero con el formulario de
        arriba.
      </p>
    );
  }

  const inactiveCount = members.filter((m) => !m.active).length;

  return (
    <div>
      {inactiveCount > 0 && (
        <label className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Mostrar inactivos ({inactiveCount})
        </label>
      )}
      <table className="w-full border-collapse text-left text-base">
        <thead>
          <tr className="border-b border-border text-sm text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Miembro</th>
            <th className="py-2 pr-4 font-medium">Rol</th>
            <th className="py-2 pr-4 font-medium">Estado</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {visible.map((member) => (
            <StaffRow
              key={member.membershipId}
              member={member}
              isSelf={member.userId === currentUserId}
              canManage={canManage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
