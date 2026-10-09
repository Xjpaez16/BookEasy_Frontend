import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  availabilitySchema,
  publicAppointmentSchema,
  publicAppointmentListSchema,
  type Availability,
  type PublicAppointment,
} from './model';

/**
 * The only place that knows the public booking URL shapes
 * (be-Backend /api/v1/public). Availability is unauthenticated; booking and
 * "my appointments" require a logged-in user (the shared client attaches the
 * bearer token) but NOT a business membership — the tenant is the slug.
 */
const publicBookingApi = {
  availability: async (
    slug: string,
    serviceId: string,
    date: string,
  ): Promise<Availability> => {
    const raw = await apiClient.get<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}/availability?serviceId=${encodeURIComponent(
        serviceId,
      )}&date=${encodeURIComponent(date)}`,
    );
    return availabilitySchema.parse(raw);
  },
  book: async (
    slug: string,
    body: { serviceId: string; startAt: string; notes?: string | null },
  ): Promise<PublicAppointment> => {
    const raw = await apiClient.post<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}/book`,
      body,
    );
    return publicAppointmentSchema.parse(raw);
  },
  myAppointments: async (slug: string): Promise<PublicAppointment[]> => {
    const raw = await apiClient.get<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}/my-appointments`,
    );
    return publicAppointmentListSchema.parse(raw);
  },
  cancel: async (slug: string, id: string): Promise<PublicAppointment> => {
    const raw = await apiClient.post<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}/appointments/${encodeURIComponent(id)}/cancel`,
    );
    return publicAppointmentSchema.parse(raw);
  },
  reschedule: async (
    slug: string,
    id: string,
    startAt: string,
  ): Promise<PublicAppointment> => {
    const raw = await apiClient.patch<unknown>(
      `/public/businesses/${encodeURIComponent(slug)}/appointments/${encodeURIComponent(id)}/reschedule`,
      { startAt },
    );
    return publicAppointmentSchema.parse(raw);
  },
};

export const publicBookingKeys = {
  availability: (slug: string, serviceId: string, date: string) =>
    ['public-booking', 'availability', slug, serviceId, date] as const,
  mine: (slug: string) => ['public-booking', 'mine', slug] as const,
};

/** Free slots for a service on a date. Enabled only when all inputs are set. */
export function useAvailability(slug: string, serviceId: string, date: string) {
  return useQuery({
    queryKey: publicBookingKeys.availability(slug, serviceId, date),
    queryFn: () => publicBookingApi.availability(slug, serviceId, date),
    enabled: slug.length > 0 && serviceId.length > 0 && date.length > 0,
    staleTime: 30_000,
  });
}

/** Books a slot; on success refreshes availability + "my appointments". */
export function useBookAppointment(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { serviceId: string; startAt: string; notes?: string | null }) =>
      publicBookingApi.book(slug, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['public-booking', 'availability', slug] });
      qc.invalidateQueries({ queryKey: publicBookingKeys.mine(slug) });
    },
  });
}

/** The caller's own appointments in a business. 404 => they have none here. */
export function useMyAppointments(slug: string) {
  return useQuery({
    queryKey: publicBookingKeys.mine(slug),
    queryFn: () => publicBookingApi.myAppointments(slug),
    enabled: slug.length > 0,
    retry: false, // a 404 (no bookings) is expected, don't retry it
  });
}

export function useCancelMyAppointment(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publicBookingApi.cancel(slug, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: publicBookingKeys.mine(slug) }),
  });
}

export function useRescheduleMyAppointment(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; startAt: string }) =>
      publicBookingApi.reschedule(slug, vars.id, vars.startAt),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: publicBookingKeys.mine(slug) });
      qc.invalidateQueries({ queryKey: ['public-booking', 'availability', slug] });
    },
  });
}
