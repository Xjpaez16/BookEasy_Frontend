import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useCurrentBusiness } from '../../entities/business/api';
import { ApiRequestError } from '../../shared/api/client';

/**
 * Protects routes that need an active business. Resolves GET /businesses/current
 * (which also proves the session). A 404 means "logged in, no business yet" →
 * onboarding; a 401 means "not logged in" → login.
 */
export function RequireBusiness({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error, isNoBusiness } = useCurrentBusiness();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (isNoBusiness) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isError) {
    const unauthenticated =
      error instanceof ApiRequestError && error.status === 401;
    return <Navigate to={unauthenticated ? '/login' : '/onboarding'} replace />;
  }

  if (!data) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
