import { Link } from 'react-router-dom';
import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { ForgotPasswordForm } from '../../features/auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecerla."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Volver a iniciar sesión
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
