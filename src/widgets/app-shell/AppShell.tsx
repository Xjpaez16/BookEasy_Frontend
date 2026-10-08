import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, LogOut } from 'lucide-react';
import { useCurrentBusiness } from '../../entities/business/api';
import { useLogout } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';

/*
 * App shell — Airbnb top-nav: white surface, 1px bottom hairline, 80px tall,
 * brand mark flush-left, business name centered-ish, account utilities right.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: business } = useCurrentBusiness();
  const logout = useLogout();

  const onLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => navigate('/login', { replace: true }),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background px-4 sm:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarCheck className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">Agenda Pro</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex" aria-label="Principal">
          <Link
            to="/dashboard"
            className="text-base font-semibold text-foreground hover:underline"
          >
            Panel
          </Link>
          <Link
            to="/settings/staff"
            className="text-base font-semibold text-muted-foreground hover:text-foreground"
          >
            Equipo
          </Link>
          <Link
            to="/settings/business"
            className="text-base font-semibold text-muted-foreground hover:text-foreground"
          >
            Negocio
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {business && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {business.name}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onLogout}
            loading={logout.isPending}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-content px-4 py-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
