import { Link } from 'react-router-dom';
import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { RegisterForm } from '../../features/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Empieza a gestionar tu agenda en minutos."
      footer={
        <span>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Iniciar sesión
          </Link>
        </span>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
