import { describe, it, expect } from 'vitest';
import {
  publicBusinessCardSchema,
  publicBusinessListSchema,
  publicStorefrontSchema,
} from './model';

const uuid = '11111111-1111-1111-1111-111111111111';

describe('public business card schema', () => {
  it('parses a valid card', () => {
    const r = publicBusinessCardSchema.safeParse({
      slug: 'cat-salon',
      name: 'Cat Salon',
      timezone: 'America/Bogota',
      serviceCount: 3,
    });
    expect(r.success).toBe(true);
  });

  it('rejects a negative service count', () => {
    const r = publicBusinessCardSchema.safeParse({
      slug: 'x',
      name: 'X',
      timezone: 'UTC',
      serviceCount: -1,
    });
    expect(r.success).toBe(false);
  });

  it('parses an empty list', () => {
    expect(publicBusinessListSchema.safeParse([]).success).toBe(true);
  });
});

describe('public storefront schema', () => {
  it('parses a storefront with active services', () => {
    const r = publicStorefrontSchema.safeParse({
      slug: 'cat-salon',
      name: 'Cat Salon',
      timezone: 'America/Bogota',
      services: [
        {
          id: uuid,
          name: 'Corte',
          description: null,
          durationMinutes: 45,
          priceMinor: 2500,
          currency: 'USD',
        },
      ],
    });
    expect(r.success).toBe(true);
  });

  it('parses a storefront with no services', () => {
    const r = publicStorefrontSchema.safeParse({
      slug: 'empty',
      name: 'Empty',
      timezone: 'UTC',
      services: [],
    });
    expect(r.success).toBe(true);
  });

  it('rejects a service with a non-integer price', () => {
    const r = publicStorefrontSchema.safeParse({
      slug: 'x',
      name: 'X',
      timezone: 'UTC',
      services: [
        {
          id: uuid,
          name: 'S',
          description: null,
          durationMinutes: 30,
          priceMinor: 12.5,
          currency: 'USD',
        },
      ],
    });
    expect(r.success).toBe(false);
  });
});
