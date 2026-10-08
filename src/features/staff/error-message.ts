import { ApiRequestError } from '../../shared/api/client';

/**
 * Maps a staff API error to a Spanish, user-facing message. The backend raises
 * ConflictError for "already a member" and the last-owner guards, NotFoundError
 * for an unknown membership, and ValidationError for bad input.
 */
export function toStaffErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    const msg = err.body.message ?? '';
    switch (err.body.code) {
      case 'CONFLICT':
        if (/last owner/i.test(msg)) {
          return 'No puedes quitar ni degradar al último propietario del negocio.';
        }
        if (/already a member/i.test(msg)) {
          return 'Esa persona ya es miembro de este negocio.';
        }
        return msg || 'La operación entra en conflicto con el estado actual.';
      case 'NOT_FOUND':
        return 'No encontramos ese miembro. Puede que ya no exista.';
      case 'FORBIDDEN':
        return 'Solo el propietario puede gestionar el equipo.';
      case 'VALIDATION':
        return msg || 'Revisa los datos del formulario.';
      default:
        return msg || 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión.';
}
