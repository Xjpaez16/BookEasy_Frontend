import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  appointmentSchema,
  type Appointment,
  type CreateAppointmentInput,
} from './model';
import { z } from 'zod';

const appointmentListSchema = z.array(appointmentSchema);

/** Resource access for appointments. The only place that knows the URL shape. */
const appointmentsApi = {
  list: async (params: { from: string; to: string }): Promise<Appointment[]> => {
    const raw = await apiClient.get<unknown>(
      `/appointments?from=${encodeURIComponent(params.from)}&to=${encodeURIComponent(params.to)}`,
    );
    return appointmentListSchema.parse(raw);
  },
  create: async (input: CreateAppointmentInput): Promise<Appointment> => {
    const raw = await apiClient.post<unknown>('/appointments', input);
    return appointmentSchema.parse(raw);
  },
};

const keys = {
  all: ['appointments'] as const,
  range: (from: string, to: string) => [...keys.all, { from, to }] as const,
};

export function useAppointments(from: string, to: string) {
  return useQuery({
    queryKey: keys.range(from, to),
    queryFn: () => appointmentsApi.list({ from, to }),
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => appointmentsApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
