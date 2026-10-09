import { describe, it, expect } from 'vitest';
import { customerSchema, customerListSchema, customerFormSchema } from './model';

const uuid = '11111111-1111-1111-1111-111111111111';

describe('customer schema', () => {
  it('parses a valid customer', () => {
    const r = customerSchema.safeParse({
      id: uuid,
      fullName: 'Ana López',
      phone: '+57 300 000 0000',
      email: 'ana@example.com',
      notes: 'Prefiere mañanas',
    });
    expect(r.success).toBe(true);
  });

  it('accepts null optional fields', () => {
    const r = customerSchema.safeParse({
      id: uuid,
      fullName: 'Ana',
      phone: null,
      email: null,
      notes: null,
    });
    expect(r.success).toBe(true);
  });

  it('parses an empty list', () => {
    expect(customerListSchema.safeParse([]).success).toBe(true);
  });
});

describe('customer form schema', () => {
  it('accepts a name-only customer (contacts optional)', () => {
    const r = customerFormSchema.safeParse({
      fullName: 'Ana',
      phone: '',
      email: '',
      notes: '',
    });
    expect(r.success).toBe(true);
  });

  it('rejects an empty name', () => {
    const r = customerFormSchema.safeParse({
      fullName: '',
      phone: '',
      email: '',
      notes: '',
    });
    expect(r.success).toBe(false);
  });

  it('rejects a malformed email when provided', () => {
    const r = customerFormSchema.safeParse({
      fullName: 'Ana',
      phone: '',
      email: 'not-an-email',
      notes: '',
    });
    expect(r.success).toBe(false);
  });

  it('allows an empty-string email (treated as not provided)', () => {
    const r = customerFormSchema.safeParse({
      fullName: 'Ana',
      phone: '',
      email: '',
      notes: '',
    });
    expect(r.success).toBe(true);
  });

  it('accepts a valid E.164-ish phone (mirrors backend rule)', () => {
    const r = customerFormSchema.safeParse({
      fullName: 'Ana',
      phone: '+57 300 111 2233',
      email: '',
      notes: '',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a too-short phone (backend would 400)', () => {
    const r = customerFormSchema.safeParse({
      fullName: 'Ana',
      phone: '+57300',
      email: '',
      notes: '',
    });
    expect(r.success).toBe(false);
  });
});
