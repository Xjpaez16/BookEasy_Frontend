import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { ResetPasswordForm } from '../../features/auth/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elige una contraseña segura para tu cuenta."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
