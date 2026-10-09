import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  serviceListSchema,
  serviceSchema,
  type Service,
} from './model';

/** Payload the backend accepts on POST/PATCH /services (money in minor units). */
export interface ServiceWritePayload {
  name: string;
  description?: string | null;
  durationMinutes: number;
  priceMinor?: number;
  currency?: string;
}

/** The only place that knows the services URL shapes (be-Backend /api/v1/services). */
const servicesApi = {
  list: async (onlyActive = false): Promise<Service[]> => {
    const raw = await apiClient.get<unknown>(
      onlyActive ? '/services?active=true' : '/services',
    );
    return serviceListSchema.parse(raw);
  },
  create: async (payload: ServiceWritePayload): Promise<Service> => {
    const raw = await apiClient.post<unknown>('/services', payload);
    return serviceSchema.parse(raw);
  },
  update: async (args: {
    serviceId: string;
    payload: Partial<ServiceWritePayload> & { active?: boolean };
  }): Promise<Service> => {
    const raw = await apiClient.patch<unknown>(
      `/services/${args.serviceId}`,
      args.payload,
    );
    return serviceSchema.parse(raw);
  },
  remove: async (serviceId: string): Promise<void> => {
    await apiClient.delete<unknown>(`/services/${serviceId}`);
  },
};

export const serviceKeys = {
  all: ['services'] as const,
  list: ['services', 'list'] as const,
};

/** Lists services of the caller's business (tenant-scoped by X-Business-Id). */
export function useServiceList() {
  return useQuery({
    queryKey: serviceKeys.list,
    queryFn: () => servicesApi.list(false),
    staleTime: 60_000,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.list });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.update,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.list });
    },
  });
}

/** Soft-deletes a service (the backend keeps history; it just goes inactive). */
export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.remove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: serviceKeys.list });
    },
  });
}
