import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSession } from '../../entities/session/api';
import { tokenStore } from '../../shared/api/token-store';

/**
 * Protects routes that need an authenticated session. If there is no access
 * token yet, the API client's refresh-on-401 still gives /auth/me one chance
 * to recover the session from the HttpOnly cookie before we redirect.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { data, isLoading, isError } = useSession();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (isError || !data) {
    tokenStore.clear();
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
