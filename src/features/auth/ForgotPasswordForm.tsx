import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordInputSchema,
  type ForgotPasswordInput,
} from '../../entities/session/model';
import { useForgotPassword } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Field, Alert } from '../../shared/ui/Field';
import { toAuthErrorMessage } from './error-message';

export function ForgotPasswordForm() {
  const forgot = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
  });

  const onSubmit = handleSubmit((values) => forgot.mutate(values));
  const busy = isSubmitting || forgot.isPending;

  // Anti-enumeration: success is identical whether or not the email exists.
  if (forgot.isSuccess) {
    return (
      <Alert tone="success">
        Si existe una cuenta con ese correo, te enviamos un enlace para
        restablecer tu contraseña. Revisa tu bandeja de entrada.
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      {forgot.isError && <Alert tone="error">{toAuthErrorMessage(forgot.error)}</Alert>}

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

      <Button type="submit" size="full" loading={busy}>
        Enviar enlace
      </Button>
    </form>
  );
}
