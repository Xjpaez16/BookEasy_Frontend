import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  resetPasswordInputSchema,
  type ResetPasswordInput,
} from '../../entities/session/model';
import { useResetPassword } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toAuthErrorMessage } from './error-message';

export function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const reset = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
    defaultValues: { token },
  });

  // No token in the link → cannot proceed.
  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="error">
          El enlace de restablecimiento no es válido o está incompleto.
        </Alert>
        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
          Solicitar un nuevo enlace
        </Link>
      </div>
    );
  }

  if (reset.isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <Alert tone="success">
          Tu contraseña se actualizó. Ya puedes iniciar sesión.
        </Alert>
        <Button size="full" onClick={() => navigate('/login', { replace: true })}>
          Ir a iniciar sesión
        </Button>
      </div>
    );
  }

  const onSubmit = handleSubmit((values) => reset.mutate({ ...values, token }));
  const busy = isSubmitting || reset.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {reset.isError && <Alert tone="error">{toAuthErrorMessage(reset.error)}</Alert>}
      <input type="hidden" value={token} {...register('token')} />

      <Field label="Nueva contraseña" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          invalid={!!errors.password}
          {...register('password')}
        />
      </Field>

      <Field
        label="Confirmar contraseña"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </Field>

      <Button type="submit" size="full" loading={busy}>
        Guardar contraseña
      </Button>
    </form>
  );
}
