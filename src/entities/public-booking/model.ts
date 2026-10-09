import { z } from 'zod';

/**
 * Public booking projections — mirror the backend /api/v1/public booking shapes
 * (availability + a visitor's own appointments). No internal business id, no
 * PII of other customers: a visitor only ever sees their own data.
 */

/** Free start instants for a service on a date, in the business timezone. */
export const availabilitySchema = z.object({
  slug: z.string(),
  serviceId: z.string().uuid(),
  date: z.string(),
  timezone: z.string(),
  durationMinutes: z.number().int().positive(),
  /** ISO UTC start instants the visitor can book. */
  slots: z.array(z.string()),
});
export type Availability = z.infer<typeof availabilitySchema>;

export const appointmentStatusSchema = z.enum([
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
]);
export type PublicAppointmentStatus = z.infer<typeof appointmentStatusSchema>;

/** A visitor's own appointment, as returned by book / my-appointments. */
export const publicAppointmentSchema = z.object({
  id: z.string().uuid(),
  businessSlug: z.string(),
  businessName: z.string(),
  serviceId: z.string().uuid(),
  startAt: z.string(),
  endAt: z.string(),
  status: appointmentStatusSchema,
  priceMinor: z.number().int().min(0),
  currency: z.string(),
  notes: z.string().nullable(),
});
export type PublicAppointment = z.infer<typeof publicAppointmentSchema>;

export const publicAppointmentListSchema = z.array(publicAppointmentSchema);
