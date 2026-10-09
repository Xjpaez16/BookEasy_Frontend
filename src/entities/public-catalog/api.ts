import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  publicBusinessListSchema,
  publicStorefrontSchema,
  type PublicBusinessCard,
  type PublicStorefront,
} from './model';

/**
 * The only place that knows the public catalog URL shapes
 * (be-Backend /api/v1/public). These endpoints need no auth; the shared
 * client simply sends no token when none is present.
 */
const publicCatalogApi = {
  listBusinesses: async (): Promise<PublicBusinessCard[]> => {
    const raw = await apiClient.get<unknown>('/public/businesses');
    return publicBusinessListSchema.parse(raw);
  },
  storefront: async (slug: string): Promise<PublicStorefront> => {
    const raw = await apiClient.get<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}`,
    );
    return publicStorefrontSchema.parse(raw);
  },
};

export const publicCatalogKeys = {
  businesses: ['public', 'businesses'] as const,
  storefront: (slug: string) => ['public', 'storefront', slug] as const,
};

/** Lists marketplace businesses (public, cached a few minutes). */
export function usePublicBusinesses() {
  return useQuery({
    queryKey: publicCatalogKeys.businesses,
    queryFn: publicCatalogApi.listBusinesses,
    staleTime: 2 * 60_000,
  });
}

/** Resolves a single storefront by slug (public). */
export function usePublicStorefront(slug: string) {
  return useQuery({
    queryKey: publicCatalogKeys.storefront(slug),
    queryFn: () => publicCatalogApi.storefront(slug),
    staleTime: 2 * 60_000,
    enabled: slug.length > 0,
  });
}
