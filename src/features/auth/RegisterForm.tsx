import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  registerInputSchema,
  type RegisterInput,
} from '../../entities/session/model';
import { useRegister } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toAuthErrorMessage } from './error-message';

export function RegisterForm() {
  const navigate = useNavigate();
  const registerMut = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerInputSchema) });

  const onSubmit = handleSubmit((values) => {
    registerMut.mutate(values, {
      onSuccess: () => navigate('/onboarding', { replace: true }),
    });
  });

  const busy = isSubmitting || registerMut.isPending;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {registerMut.isError && (
        <Alert tone="error">{toAuthErrorMessage(registerMut.error)}</Alert>
      )}

      <Field label="Nombre completo" htmlFor="fullName" error={errors.fullName?.message}>
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="María Pérez"
          invalid={!!errors.fullName}
          {...register('fullName')}
        />
      </Field>

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
        Crear cuenta
      </Button>
    </form>
  );
}
