import { AuthLayout } from '../../widgets/auth-layout/AuthLayout';
import { CreateBusinessForm } from '../../features/business/CreateBusinessForm';

export function OnboardingPage() {
  return (
    <AuthLayout
      title="Crea tu negocio"
      subtitle="Un último paso: cuéntanos de tu negocio para empezar a agendar."
    >
      <CreateBusinessForm />
    </AuthLayout>
  );
}
