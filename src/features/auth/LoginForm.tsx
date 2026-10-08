import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginInputSchema, type LoginInput } from '../../entities/session/model';
import { useLogin } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toAuthErrorMessage } from './error-message';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginInputSchema) });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => navigate('/dashboard', { replace: true }),
    });
  });

  const busy = isSubmitting || login.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {login.isError && <Alert tone="error">{toAuthErrorMessage(login.error)}</Alert>}

      <Field label="Correo" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          invalid={!!errors.email}
          {...register('email')}
        />
      </Field>

      <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={!!errors.password}
          {...register('password')}
        />
      </Field>

      <Button type="submit" size="full" loading={busy}>
        Iniciar sesión
      </Button>
    </form>
  );
}
