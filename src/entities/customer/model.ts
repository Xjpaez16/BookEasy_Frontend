import { z } from 'zod';

/**
 * A customer as returned by GET /api/v1/customers. Mirrors the backend
 * CustomerView exactly. Soft-deleted customers are not returned by the list.
 */
export const customerSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  notes: z.string().nullable(),
});
export type Customer = z.infer<typeof customerSchema>;

export const customerListSchema = z.array(customerSchema);

/* ---- Form input (RHF resolver). Empty optional fields are sent as null by
 * the API layer so the backend clears them. */

// Mirrors the backend domain rule (normalizePhone): after stripping spaces,
// dashes and parens, a phone must be an optional + followed by 7–15 digits.
const PHONE_RE = /^\+?[0-9]{7,15}$/;

export const customerFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  phone: z
    .string()
    .max(32, 'Máximo 32 caracteres')
    .refine(
      (v) => v === '' || PHONE_RE.test(v.replace(/[\s\-()]/g, '')),
      'Teléfono inválido (7 a 15 dígitos, ej. +573001112233)',
    )
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Correo inválido')
    .max(320)
    .optional()
    .or(z.literal('')),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional().or(z.literal('')),
});
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
