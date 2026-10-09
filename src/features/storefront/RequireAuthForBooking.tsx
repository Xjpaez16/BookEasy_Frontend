import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { tokenStore } from '../../shared/api/token-store';

/**
 * Deferred-auth gate for the booking step (Fresha-style): a visitor browses the
 * public storefront freely, but the moment they try to BOOK we require a
 * session. If there's no access token in memory, send them to /login with a
 * returnTo back to the exact booking URL (service query included), so after
 * signing in they land right where they left off.
 *
 * On a hard reload the in-memory token is gone; login + the HttpOnly refresh
 * cookie bring them straight back to returnTo.
 */
export function RequireAuthForBooking({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!tokenStore.get()) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return <>{children}</>;
}
