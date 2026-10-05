import { describe, it, expect } from 'vitest';
import { appointmentSchema, createAppointmentSchema } from './model';

describe('appointment schemas', () => {
  it('accepts a valid appointment', () => {
    const result = appointmentSchema.safeParse({
      id: '11111111-1111-1111-1111-111111111111',
      customerId: '22222222-2222-2222-2222-222222222222',
      serviceId: '33333333-3333-3333-3333-333333333333',
      staffId: '44444444-4444-4444-4444-444444444444',
      startAt: '2026-01-01T10:00:00.000Z',
      endAt: '2026-01-01T10:30:00.000Z',
      status: 'SCHEDULED',
      priceMinor: 1500,
      currency: 'USD',
      notes: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = createAppointmentSchema.safeParse({
      customerId: 'not-a-uuid',
      serviceId: '33333333-3333-3333-3333-333333333333',
      staffId: '44444444-4444-4444-4444-444444444444',
      startAt: '2026-01-01T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});
