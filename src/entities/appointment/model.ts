import { z } from 'zod';

/** Appointment lifecycle status — mirrors the backend AppointmentStatus enum. */
export const appointmentStatusSchema = z.enum([
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

/**
 * An appointment as returned by the backend AppointmentView. Timestamps are
 * ISO-8601 with offset (UTC on the wire); the UI renders them in the business
 * timezone. Money is integer minor units + currency.
 */
export const appointmentSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  startAt: z.string(),
  endAt: z.string(),
  status: appointmentStatusSchema,
  priceMinor: z.number().int().min(0),
  currency: z.string(),
  notes: z.string().nullable(),
});
export type Appointment = z.infer<typeof appointmentSchema>;

export const appointmentListSchema = z.array(appointmentSchema);

/* ---- Form input (RHF resolver). The slot's startAt is assembled from the
 * picked date + time into an ISO offset string by the submit handler. */

export const appointmentFormSchema = z.object({
  customerId: z.string().uuid('Elige un cliente'),
  serviceId: z.string().uuid('Elige un servicio'),
  staffId: z.string().uuid('Elige un miembro del equipo'),
  date: z.string().min(1, 'Elige una fecha'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Elige una hora'),
  notes: z.string().max(2000).optional().or(z.literal('')),
});
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/** Human label per status (Spanish). */
export const statusLabel: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Agendada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'No asistió',
};
