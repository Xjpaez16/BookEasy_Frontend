import { describe, it, expect } from 'vitest';
import {
  businessSchema,
  createBusinessResultSchema,
  createBusinessInputSchema,
  updateBusinessInputSchema,
} from './model';

describe('business schema', () => {
  it('parses a valid business', () => {
    const r = businessSchema.safeParse({
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Barbería El Corte',
      slug: 'barberia-el-corte',
      timezone: 'America/Bogota',
    });
    expect(r.success).toBe(true);
  });

  it('parses a create result', () => {
    const r = createBusinessResultSchema.safeParse({
      businessId: '11111111-1111-1111-1111-111111111111',
      slug: 'barberia-el-corte',
      membershipId: '22222222-2222-2222-2222-222222222222',
    });
    expect(r.success).toBe(true);
  });
});

describe('create business input', () => {
  it('accepts a name + timezone, slug optional', () => {
    const r = createBusinessInputSchema.safeParse({
      name: 'Mi Negocio',
      timezone: 'America/Bogota',
    });
    expect(r.success).toBe(true);
  });

  it('accepts an empty slug (auto-derived server-side)', () => {
    const r = createBusinessInputSchema.safeParse({
      name: 'Mi Negocio',
      timezone: 'UTC',
      slug: '',
    });
    expect(r.success).toBe(true);
  });

  it('rejects an invalid slug (uppercase/spaces)', () => {
    const r = createBusinessInputSchema.safeParse({
      name: 'Mi Negocio',
      timezone: 'UTC',
      slug: 'Mi Negocio',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a too-short name', () => {
    const r = createBusinessInputSchema.safeParse({ name: 'X', timezone: 'UTC' });
    expect(r.success).toBe(false);
  });
});

describe('update business input', () => {
  it('accepts a single changed field', () => {
    expect(updateBusinessInputSchema.safeParse({ name: 'Nuevo' }).success).toBe(true);
  });

  it('rejects an empty update (no fields)', () => {
    expect(updateBusinessInputSchema.safeParse({}).success).toBe(false);
  });
});
