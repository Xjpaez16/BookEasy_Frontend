import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

/**
 * Public top-nav for the marketplace (unauthenticated visitors). Brand mark
 * left, a "for businesses" / sign-in affordance right. Mirrors the AppShell
 * header styling (80px, hairline, white surface) so the two feel like one app.
 */
export function PublicNav({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarCheck className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-tight">Agenda Pro</span>
        </Link>

        <nav className="flex items-center gap-4" aria-label="Público">
          <Link
            to="/login"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-active"
          >
            Publica tu negocio
          </Link>
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
