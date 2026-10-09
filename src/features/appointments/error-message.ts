import { ApiRequestError } from '../../shared/api/client';

/**
 * Maps an appointments API error to a Spanish, user-facing message. The backend
 * raises ConflictError for an overlapping slot, ValidationError for a slot
 * outside business hours or an inactive staff/service, and a transition error
 * when an appointment is already in a terminal status.
 */
export function toAppointmentErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    const msg = err.body.message ?? '';
    switch (err.body.code) {
      case 'CONFLICT':
        return 'Ese horario se cruza con otra cita. Elige otra hora.';
      case 'VALIDATION':
        if (/business hours|outside|horario/i.test(msg)) {
          return 'La hora elegida está fuera del horario de atención del negocio.';
        }
        if (/inactive|active/i.test(msg)) {
          return 'El servicio o el miembro del equipo no está activo.';
        }
        if (/status|transition|terminal/i.test(msg)) {
          return 'Esta cita ya está en un estado final y no se puede cambiar.';
        }
        return msg || 'Revisa los datos de la cita.';
      case 'NOT_FOUND':
        return 'No encontramos la cita. Puede que ya no exista.';
      case 'FORBIDDEN':
        return 'No tienes permiso para esta acción.';
      default:
        return msg || 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión.';
}
