import { describe, it, expect } from 'vitest';
import { serviceSchema, serviceListSchema, serviceFormSchema } from './model';

const uuid = '11111111-1111-1111-1111-111111111111';

describe('service schema', () => {
  it('parses a valid service with money in minor units', () => {
    const r = serviceSchema.safeParse({
      id: uuid,
      name: 'Corte de cabello',
      description: 'Incluye lavado',
      durationMinutes: 45,
      priceMinor: 2500,
      currency: 'USD',
      active: true,
    });
    expect(r.success).toBe(true);
  });

  it('accepts a null description', () => {
    const r = serviceSchema.safeParse({
      id: uuid,
      name: 'Manicure',
      description: null,
      durationMinutes: 30,
      priceMinor: 0,
      currency: 'COP',
      active: true,
    });
    expect(r.success).toBe(true);
  });

  it('rejects a non-integer price (money must be minor units)', () => {
    const r = serviceSchema.safeParse({
      id: uuid,
      name: 'X',
      description: null,
      durationMinutes: 30,
      priceMinor: 25.5,
      currency: 'USD',
      active: true,
    });
    expect(r.success).toBe(false);
  });

  it('parses a list of services', () => {
    const r = serviceListSchema.safeParse([]);
    expect(r.success).toBe(true);
  });
});

describe('service form schema', () => {
  it('accepts a valid form with a decimal price string', () => {
    const r = serviceFormSchema.safeParse({
      name: 'Corte',
      description: '',
      durationMinutes: 30,
      price: '25.00',
      currency: 'USD',
    });
    expect(r.success).toBe(true);
  });

  it('coerces a numeric-string duration', () => {
    const r = serviceFormSchema.safeParse({
      name: 'Corte',
      durationMinutes: '45',
      price: '',
      currency: 'usd',
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.durationMinutes).toBe(45);
  });

  it('rejects a duration over 24 hours', () => {
    const r = serviceFormSchema.safeParse({
      name: 'Corte',
      durationMinutes: 1500,
      price: '',
      currency: 'USD',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a bad currency code', () => {
    const r = serviceFormSchema.safeParse({
      name: 'Corte',
      durationMinutes: 30,
      price: '',
      currency: 'US',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a malformed price string', () => {
    const r = serviceFormSchema.safeParse({
      name: 'Corte',
      durationMinutes: 30,
      price: '12.999',
      currency: 'USD',
    });
    expect(r.success).toBe(false);
  });
});
