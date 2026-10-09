import { useMemo, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { PublicNav } from '../../widgets/public-nav/PublicNav';
import { BusinessGrid } from '../../features/storefront/BusinessGrid';
import { usePublicBusinesses } from '../../entities/public-catalog/api';
import { Reveal } from '../../shared/ui/motion';
import { Input } from '../../shared/ui/Input';
import { Alert } from '../../shared/ui/Field';

export function MarketplacePage() {
  const { data: businesses, isLoading, isError } = usePublicBusinesses();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!businesses) return [];
    const q = query.trim().toLowerCase();
    if (!q) return businesses;
    return businesses.filter((b) => b.name.toLowerCase().includes(q));
  }, [businesses, query]);

  return (
    <PublicNav>
      {/* Hero */}
      <section className="bg-brand-wash">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-8 sm:py-20">
          <Reveal>
            <h1 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Reserva en los mejores <span className="text-primary">negocios</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-3 max-w-xl text-base text-body">
              Encuentra el servicio perfecto y agenda en segundos. Sin llamadas,
              sin esperas.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-4 pr-1.5 shadow-float">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                aria-label="Buscar negocios"
                placeholder="Buscar negocio…"
                className="h-10 border-0 px-0 shadow-none focus:border-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Listing */}
      <section className="mx-auto max-w-content px-4 py-12 sm:px-8">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-base text-body">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Cargando negocios…
          </div>
        )}

        {/* Error: the request actually failed (network / parse). */}
        {isError && (
          <Alert tone="error">
            No pudimos cargar los negocios. Recarga la página.
          </Alert>
        )}

        {/* Loaded OK but the catalog is genuinely empty — NOT an error. */}
        {!isLoading && !isError && businesses && businesses.length === 0 && (
          <div className="rounded-md border border-dashed border-border px-4 py-16 text-center">
            <p className="text-base font-medium text-foreground">
              Aún no hay negocios disponibles
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Todavía no se ha publicado ningún negocio. Vuelve pronto.
            </p>
          </div>
        )}

        {/* Loaded OK, catalog has businesses, but the search matched none. */}
        {!isLoading &&
          !isError &&
          businesses &&
          businesses.length > 0 &&
          filtered.length === 0 && (
            <div className="rounded-md border border-dashed border-border px-4 py-16 text-center">
              <p className="text-base font-medium text-foreground">
                Sin resultados para “{query.trim()}”
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prueba con otro nombre.
              </p>
            </div>
          )}

        {/* Loaded OK with matches. */}
        {!isLoading && !isError && filtered.length > 0 && (
          <BusinessGrid businesses={filtered} trigger={query.trim().toLowerCase()} />
        )}
      </section>
    </PublicNav>
  );
}
