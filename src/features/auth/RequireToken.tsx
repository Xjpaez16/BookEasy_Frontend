import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { tokenStore } from '../../shared/api/token-store';

/**
 * Minimal gate for the onboarding step: it only needs a logged-in user (an
 * access token in memory), NOT a resolved business — the whole point of
 * onboarding is that there is no business yet. Deliberately avoids
 * GET /businesses/current (which 404s pre-business) and GET /auth/me.
 *
 * On a hard reload the in-memory token is gone; the user is sent to /login and
 * the HttpOnly refresh cookie lets them straight back in.
 */
export function RequireToken({ children }: { children: ReactNode }) {
  if (!tokenStore.get()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
