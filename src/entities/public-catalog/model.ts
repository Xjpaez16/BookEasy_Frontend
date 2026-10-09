import { z } from 'zod';

/**
 * Public marketplace projections — mirror the backend /api/v1/public shapes
 * exactly. These carry NO PII and no internal business id; everything here is
 * safe to render to an unauthenticated visitor.
 */

/** A business card in the marketplace listing. */
export const publicBusinessCardSchema = z.object({
  slug: z.string(),
  name: z.string(),
  timezone: z.string(),
  serviceCount: z.number().int().min(0),
});
export type PublicBusinessCard = z.infer<typeof publicBusinessCardSchema>;

export const publicBusinessListSchema = z.array(publicBusinessCardSchema);

/** A single active service inside a storefront. */
export const publicServiceItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  durationMinutes: z.number().int().positive(),
  priceMinor: z.number().int().min(0),
  currency: z.string(),
});
export type PublicServiceItem = z.infer<typeof publicServiceItemSchema>;

/** A business storefront: public facts + its active services. */
export const publicStorefrontSchema = z.object({
  slug: z.string(),
  name: z.string(),
  timezone: z.string(),
  services: z.array(publicServiceItemSchema),
});
export type PublicStorefront = z.infer<typeof publicStorefrontSchema>;
