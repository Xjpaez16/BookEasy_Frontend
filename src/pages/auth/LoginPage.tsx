import { Link } from 'react-router-dom';
import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { LoginForm } from '../../features/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Bienvenido de vuelta a Agenda Pro."
      footer={
        <div className="flex flex-col gap-2">
          <Link to="/forgot-password" className="text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
          <span>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Crear una
            </Link>
          </span>
        </div>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
