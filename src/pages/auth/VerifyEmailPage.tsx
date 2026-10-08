import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { useVerifyEmail } from '../../entities/session/api';
import { Alert } from '../../shared/ui/Field';
import { Button } from '../../shared/ui/Button';
import { toAuthErrorMessage } from '../../features/auth/error-message';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const verify = useVerifyEmail();
  const fired = useRef(false);

  useEffect(() => {
    if (token && !fired.current) {
      fired.current = true;
      verify.mutate(token);
    }
  }, [token, verify]);

  return (
    <AuthLayout title="Verificar correo">
      {!token && (
        <Alert tone="error">El enlace de verificación está incompleto.</Alert>
      )}

      {token && verify.isPending && (
        <div className="flex items-center gap-2 text-base text-body">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Verificando tu correo…
        </div>
      )}

      {verify.isSuccess && (
        <div className="flex flex-col gap-4">
          <Alert tone="success">¡Tu correo quedó verificado!</Alert>
          <Button size="full" onClick={() => navigate('/login')}>
            Iniciar sesión
          </Button>
        </div>
      )}

      {verify.isError && (
        <div className="flex flex-col gap-4">
          <Alert tone="error">{toAuthErrorMessage(verify.error)}</Alert>
          <Link to="/login" className="text-sm text-primary hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
