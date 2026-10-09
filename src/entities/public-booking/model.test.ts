import { describe, it, expect } from 'vitest';
import {
  availabilitySchema,
  publicAppointmentSchema,
  publicAppointmentListSchema,
  appointmentStatusSchema,
} from './model';

const UUID = '11111111-1111-1111-1111-111111111111';

describe('availabilitySchema', () => {
  it('parses a valid availability payload', () => {
    const out = availabilitySchema.parse({
      slug: 'cat-salon',
      serviceId: UUID,
      date: '2026-10-12',
      timezone: 'America/Bogota',
      durationMinutes: 30,
      slots: ['2026-10-12T14:00:00.000Z', '2026-10-12T14:15:00.000Z'],
    });
    expect(out.slots).toHaveLength(2);
  });

  it('accepts an empty slot list', () => {
    const out = availabilitySchema.parse({
      slug: 's',
      serviceId: UUID,
      date: '2026-10-12',
      timezone: 'UTC',
      durationMinutes: 45,
      slots: [],
    });
    expect(out.slots).toEqual([]);
  });

  it('rejects a non-positive duration', () => {
    expect(() =>
      availabilitySchema.parse({
        slug: 's',
        serviceId: UUID,
        date: '2026-10-12',
        timezone: 'UTC',
        durationMinutes: 0,
        slots: [],
      }),
    ).toThrow();
  });
});

describe('publicAppointmentSchema', () => {
  const base = {
    id: UUID,
    businessSlug: 'cat-salon',
    businessName: 'Cat Salon',
    serviceId: UUID,
    startAt: '2026-10-12T14:00:00.000Z',
    endAt: '2026-10-12T14:30:00.000Z',
    status: 'SCHEDULED',
    priceMinor: 25000,
    currency: 'COP',
    notes: null,
  };

  it('parses a valid appointment', () => {
    const out = publicAppointmentSchema.parse(base);
    expect(out.status).toBe('SCHEDULED');
    expect(out.currency).toBe('COP');
  });

  it('accepts every known status', () => {
    for (const status of ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']) {
      expect(appointmentStatusSchema.parse(status)).toBe(status);
    }
  });

  it('rejects an unknown status', () => {
    expect(() => publicAppointmentSchema.parse({ ...base, status: 'PENDING' })).toThrow();
  });

  it('parses a list of appointments', () => {
    const out = publicAppointmentListSchema.parse([base, { ...base, id: UUID }]);
    expect(out).toHaveLength(2);
  });

  it('never carries an internal businessId field through', () => {
    const out = publicAppointmentSchema.parse(base);
    expect('businessId' in out).toBe(false);
  });
});
