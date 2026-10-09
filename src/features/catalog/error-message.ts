import { ApiRequestError } from '../../shared/api/client';

/**
 * Maps a services/customers API error to a Spanish, user-facing message. The
 * backend raises NotFoundError for an unknown id, ValidationError for bad
 * input, FORBIDDEN when the plan limit is exceeded or the role is insufficient.
 */
export function toCatalogErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    const msg = err.body.message ?? '';
    switch (err.body.code) {
      case 'NOT_FOUND':
        return 'No encontramos ese elemento. Puede que ya no exista.';
      case 'FORBIDDEN':
        if (/limit/i.test(msg)) {
          return 'Alcanzaste el límite de tu plan. Mejóralo para añadir más.';
        }
        return 'No tienes permiso para esta acción.';
      case 'CONFLICT':
        return msg || 'La operación entra en conflicto con el estado actual.';
      case 'VALIDATION':
        return msg || 'Revisa los datos del formulario.';
      default:
        return msg || 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión.';
}
