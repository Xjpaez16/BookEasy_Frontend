import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { PublicBusinessCard } from '../../entities/public-catalog/model';
import { Stagger, StaggerItem, HoverLift } from '../../shared/ui/motion';

/* A simple deterministic accent per card so the grid feels lively without
 * needing images the backend doesn't have yet. Hue derived from the slug. */
function accent(slug: string): string {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 360;
  return `hsl(${h} 70% 92%)`;
}

function BusinessCard({ business }: { business: PublicBusinessCard }) {
  return (
    <HoverLift>
      <Link
        to={`/b/${business.slug}`}
        className="group block overflow-hidden rounded-md border border-border bg-background shadow-float transition-shadow hover:shadow-lg"
      >
        <div
          className="h-28"
          style={{
            background: `linear-gradient(135deg, ${accent(business.slug)}, var(--color-surface-soft, #f7f7f7))`,
          }}
          aria-hidden
        />
        <div className="p-4">
          <h3 className="text-base font-semibold text-foreground">{business.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {business.serviceCount}{' '}
            {business.serviceCount === 1 ? 'servicio' : 'servicios'}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Ver negocio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </HoverLift>
  );
}

export function BusinessGrid({ businesses }: { businesses: PublicBusinessCard[] }) {
  if (businesses.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-border px-4 py-12 text-center text-body">
        Aún no hay negocios con servicios publicados. Vuelve pronto.
      </p>
    );
  }

  return (
    <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {businesses.map((b) => (
        <StaggerItem key={b.slug}>
          <BusinessCard business={b} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
