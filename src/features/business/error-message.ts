import { ApiRequestError } from '../../shared/api/client';

/** Maps a business API error to a Spanish, user-facing message. */
export function toBusinessErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    switch (err.body.code) {
      case 'SLUG_TAKEN':
      case 'CONFLICT':
        return 'Ese identificador (slug) ya está en uso. Prueba con otro.';
      case 'VALIDATION':
        return err.body.message || 'Revisa los datos del formulario.';
      case 'FORBIDDEN':
        return 'No tienes permisos para esta acción.';
      default:
        return err.body.message || 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión.';
}
