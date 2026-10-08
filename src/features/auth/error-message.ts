import { ApiRequestError } from '../../shared/api/client';

/** Maps an API/network error to a Spanish, user-facing message. */
export function toAuthErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) {
    switch (err.body.code) {
      case 'INVALID_CREDENTIALS':
        return 'Correo o contraseña incorrectos.';
      case 'EMAIL_TAKEN':
        return 'Ya existe una cuenta con ese correo.';
      case 'RATE_LIMITED':
        return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
      case 'INVALID_TOKEN':
      case 'TOKEN_EXPIRED':
        return 'El enlace no es válido o ya expiró. Solicita uno nuevo.';
      default:
        return err.body.message || 'Ocurrió un error. Inténtalo de nuevo.';
    }
  }
  return 'No pudimos conectar con el servidor. Revisa tu conexión.';
}
