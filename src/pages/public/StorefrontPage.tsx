import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, MapPin } from 'lucide-react';
import { PublicNav } from '../../widgets/public-nav/PublicNav';
import { ServiceMenu } from '../../features/storefront/ServiceMenu';
import { usePublicStorefront } from '../../entities/public-catalog/api';
import { Reveal } from '../../shared/ui/motion';
import { SoftDivider } from '../../shared/ui/SoftDivider';
import { Alert } from '../../shared/ui/Field';

export function StorefrontPage() {
  const { slug = '' } = useParams();
  const { data: storefront, isLoading, isError } = usePublicStorefront(slug);

  return (
    <PublicNav>
      <div className="mx-auto max-w-content px-4 py-10 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Todos los negocios
        </Link>

        {storefront && (
          <div className="mt-2">
            <Link
              to={`/b/${slug}/my-appointments`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver mis reservas
            </Link>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-20 text-base text-body">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            Cargando negocio…
          </div>
        )}

        {isError && (
          <div className="py-10">
            <Alert tone="error">
              No encontramos este negocio. Puede que el enlace sea incorrecto.
            </Alert>
          </div>
        )}

        {storefront && (
          <>
            <Reveal>
              <header className="mt-6 pb-8">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {storefront.name}
                </h1>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {storefront.timezone}
                </p>
              </header>
            </Reveal>
            <SoftDivider />

            <section className="mt-8">
              <h2 className="mb-4 text-lg font-semibold">Servicios</h2>
              <ServiceMenu storefront={storefront} />
            </section>
          </>
        )}
      </div>
    </PublicNav>
  );
}
