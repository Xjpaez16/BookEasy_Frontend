import type { ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CalendarCheck, LogOut } from 'lucide-react';
import { useCurrentBusiness } from '../../entities/business/api';
import { useLogout } from '../../entities/session/api';
import { Button } from '../../shared/ui/Button';
import { cn } from '../../shared/lib/cn';

const navItems = [
  { to: '/dashboard', label: 'Panel' },
  { to: '/calendar', label: 'Agenda' },
  { to: '/catalog/services', label: 'Servicios' },
  { to: '/catalog/customers', label: 'Clientes' },
  { to: '/settings/staff', label: 'Equipo' },
  { to: '/settings/business', label: 'Negocio' },
];

/** Pill nav link with an active-route indicator (Rausch tint when current). */
function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/dashboard'}
      className={({ isActive }) =>
        cn(
          'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-surface-soft hover:text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  );
}

/*
 * App shell — Airbnb top-nav. White surface, 80px tall, brand mark flush-left,
 * pill nav with an active indicator, account utilities right. The header floats
 * on a soft shadow (shadow-nav) instead of a hard border-b hairline.
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
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-background/90 px-4 shadow-nav backdrop-blur sm:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarCheck className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">Agenda Pro</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Principal">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
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

      <main className="mx-auto w-full max-w-content px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
