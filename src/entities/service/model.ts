import { z } from 'zod';

/**
 * A service as returned by GET /api/v1/services. Mirrors the backend
 * ServiceView exactly: money is integer MINOR units + an ISO-4217 currency,
 * never a float.
 */
export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  durationMinutes: z.number().int().positive(),
  priceMinor: z.number().int().min(0),
  currency: z.string(),
  active: z.boolean(),
});
export type Service = z.infer<typeof serviceSchema>;

export const serviceListSchema = z.array(serviceSchema);

/* ---- Form input (RHF resolver). Price is edited as a major-unit string and
 * converted to minor units by the API layer; the backend validates the rest. */

const currencyField = z
  .string()
  .trim()
  .regex(/^[A-Za-z]{3}$/, 'Usa un código de 3 letras (ej. USD, COP)');

export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  description: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
  durationMinutes: z.coerce
    .number({ invalid_type_error: 'Indica la duración en minutos' })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor que cero')
    .max(1440, 'Máximo 24 horas (1440 min)'),
  // Edited as a human decimal string; validated/converted in the API layer.
  price: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, 'Importe inválido (ej. 25 o 25.00)')
    .optional()
    .or(z.literal('')),
  currency: currencyField,
});
export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
