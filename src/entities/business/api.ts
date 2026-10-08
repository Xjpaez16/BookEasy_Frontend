import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, ApiRequestError } from '../../shared/api/client';
import { businessStore } from '../../shared/api/business-store';
import {
  businessSchema,
  createBusinessResultSchema,
  type Business,
  type CreateBusinessInput,
  type CreateBusinessResult,
  type UpdateBusinessInput,
} from './model';

/** The only place that knows the business URL shapes. */
const businessApi = {
  current: async (): Promise<Business> => {
    const raw = await apiClient.get<unknown>('/businesses/current');
    return businessSchema.parse(raw);
  },
  create: async (input: CreateBusinessInput): Promise<CreateBusinessResult> => {
    const body: Record<string, unknown> = {
      name: input.name,
      timezone: input.timezone,
    };
    if (input.slug) body.slug = input.slug;
    const raw = await apiClient.post<unknown>('/businesses', body);
    return createBusinessResultSchema.parse(raw);
  },
  update: async (input: UpdateBusinessInput): Promise<Business> => {
    const raw = await apiClient.patch<unknown>('/businesses/current', input);
    return businessSchema.parse(raw);
  },
};

export const businessKeys = {
  current: ['business', 'current'] as const,
};

/**
 * Resolves the caller's current business. A 404 means "authenticated but no
 * business yet" (needs onboarding); the hook surfaces that via `isNoBusiness`
 * so the guard can route to /onboarding instead of treating it as an error.
 */
export function useCurrentBusiness() {
  const query = useQuery({
    queryKey: businessKeys.current,
    queryFn: businessApi.current,
    retry: false,
    staleTime: 5 * 60_000,
  });

  const isNoBusiness =
    query.isError &&
    query.error instanceof ApiRequestError &&
    query.error.status === 404;

  return { ...query, isNoBusiness };
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: businessApi.create,
    onSuccess: (result) => {
      // Select the freshly created tenant for subsequent requests.
      businessStore.set(result.businessId);
      void qc.invalidateQueries({ queryKey: businessKeys.current });
    },
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: businessApi.update,
    onSuccess: (business) => {
      qc.setQueryData(businessKeys.current, business);
    },
  });
}
