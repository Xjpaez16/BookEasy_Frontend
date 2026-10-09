import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  appointmentListSchema,
  appointmentSchema,
  type Appointment,
} from './model';

/** Payload for POST /appointments. startAt is ISO-8601 with offset. */
export interface CreateAppointmentPayload {
  customerId: string;
  serviceId: string;
  staffId: string;
  startAt: string;
  notes?: string | null;
}

/** The only place that knows the appointments URL shapes (/api/v1/appointments). */
const appointmentsApi = {
  list: async (range: {
    from: string;
    to: string;
    staffId?: string;
  }): Promise<Appointment[]> => {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    if (range.staffId) params.set('staffId', range.staffId);
    const raw = await apiClient.get<unknown>(`/appointments?${params.toString()}`);
    return appointmentListSchema.parse(raw);
  },
  create: async (payload: CreateAppointmentPayload): Promise<Appointment> => {
    const raw = await apiClient.post<unknown>('/appointments', payload);
    return appointmentSchema.parse(raw);
  },
  reschedule: async (args: {
    id: string;
    startAt: string;
  }): Promise<Appointment> => {
    const raw = await apiClient.patch<unknown>(
      `/appointments/${args.id}/reschedule`,
      { startAt: args.startAt },
    );
    return appointmentSchema.parse(raw);
  },
  transition: async (args: {
    id: string;
    action: 'cancel' | 'complete' | 'no-show';
  }): Promise<Appointment> => {
    const raw = await apiClient.post<unknown>(
      `/appointments/${args.id}/${args.action}`,
    );
    return appointmentSchema.parse(raw);
  },
};

export const appointmentKeys = {
  all: ['appointments'] as const,
  range: (from: string, to: string, staffId?: string) =>
    ['appointments', 'range', from, to, staffId ?? 'all'] as const,
};

/** Lists appointments in a date range (tenant-scoped by X-Business-Id). */
export function useAppointments(range: {
  from: string;
  to: string;
  staffId?: string;
}) {
  return useQuery({
    queryKey: appointmentKeys.range(range.from, range.to, range.staffId),
    queryFn: () => appointmentsApi.list(range),
    staleTime: 30_000,
    enabled: range.from.length > 0 && range.to.length > 0,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.reschedule,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}

export function useTransitionAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.transition,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
}
