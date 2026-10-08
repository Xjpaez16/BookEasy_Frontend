import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';

/*
 * Auth layout — Airbnb canvas (pure white), modest display type, one Rausch
 * voltage on the brand mark. Split panel on desktop; single column on mobile
 * (mobile-first). Photography/whitespace carry the weight, per the design doc.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-2">
      {/* Brand panel — hidden on mobile, Rausch accent on desktop. */}
      <aside className="relative hidden overflow-hidden bg-surface-soft lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CalendarCheck className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-xl font-semibold tracking-tight">Agenda Pro</span>
        </Link>
        <div className="max-w-md">
          <h2 className="text-[28px] font-bold leading-tight">
            Agenda sin ausencias.
          </h2>
          <p className="mt-3 text-base text-body">
            Gestiona clientes, servicios y citas en un solo lugar. Recordatorios
            automáticos para que tu agenda siempre esté llena.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Agenda Pro
        </p>
      </aside>

      {/* Form panel. */}
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile brand mark. */}
          <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CalendarCheck className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xl font-semibold tracking-tight">Agenda Pro</span>
          </Link>

          <h1 className="text-[22px] font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-base text-body">{subtitle}</p>}

          <div className="mt-6">{children}</div>

          {footer && (
            <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
          )}
        </div>
      </main>
    </div>
  );
}
