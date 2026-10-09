import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';

/**
 * Business hours — one entry per configured weekday. `openMinute`/`closeMinute`
 * are minutes from midnight in the business timezone (0–1440). weekday: 0=Sun.
 */
export const businessHourSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  openMinute: z.number().int().min(0).max(1440),
  closeMinute: z.number().int().min(0).max(1440),
});
export type BusinessHour = z.infer<typeof businessHourSchema>;

export const businessHoursSchema = z.object({
  hours: z.array(businessHourSchema),
});
export type BusinessHours = z.infer<typeof businessHoursSchema>;

const businessHoursApi = {
  get: async (): Promise<BusinessHours> => {
    const raw = await apiClient.get<unknown>('/business-hours');
    return businessHoursSchema.parse(raw);
  },
  set: async (hours: BusinessHour[]): Promise<BusinessHours> => {
    const raw = await apiClient.put<unknown>('/business-hours', { hours });
    return businessHoursSchema.parse(raw);
  },
};

export const businessHoursKeys = {
  all: ['business-hours'] as const,
};

export function useBusinessHours() {
  return useQuery({
    queryKey: businessHoursKeys.all,
    queryFn: businessHoursApi.get,
    staleTime: 5 * 60_000,
  });
}

export function useSetBusinessHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: businessHoursApi.set,
    onSuccess: (data) => {
      qc.setQueryData(businessHoursKeys.all, data);
    },
  });
}
