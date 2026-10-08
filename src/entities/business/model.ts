import { z } from 'zod';

/** A business as returned by GET/PATCH /businesses/current. */
export const businessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  timezone: z.string().min(1),
});
export type Business = z.infer<typeof businessSchema>;

/** POST /businesses response — the creator becomes OWNER. */
export const createBusinessResultSchema = z.object({
  businessId: z.string().uuid(),
  slug: z.string().min(1),
  membershipId: z.string().uuid(),
});
export type CreateBusinessResult = z.infer<typeof createBusinessResultSchema>;

/* ---- Form inputs (shared by RHF resolvers and the API layer) ---- */

// Mirror of the backend slug rule: lowercase, hyphen-separated.
const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBusinessInputSchema = z.object({
  name: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  timezone: z.string().min(1, 'Selecciona una zona horaria').max(64),
  slug: z
    .string()
    .max(120)
    .regex(slugRe, 'Solo minúsculas, números y guiones')
    .optional()
    .or(z.literal('')),
});
export type CreateBusinessInput = z.infer<typeof createBusinessInputSchema>;

export const updateBusinessInputSchema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres').max(200).optional(),
    timezone: z.string().min(1).max(64).optional(),
  })
  .refine((v) => v.name !== undefined || v.timezone !== undefined, {
    message: 'Cambia al menos un campo',
  });
export type UpdateBusinessInput = z.infer<typeof updateBusinessInputSchema>;
