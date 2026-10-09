import { describe, it, expect } from 'vitest';
import {
  appointmentSchema,
  appointmentListSchema,
  appointmentFormSchema,
  statusLabel,
} from './model';

const uuid = '11111111-1111-1111-1111-111111111111';

describe('appointment schema', () => {
  it('parses a valid appointment', () => {
    const r = appointmentSchema.safeParse({
      id: uuid,
      customerId: uuid,
      serviceId: uuid,
      staffId: uuid,
      startAt: '2026-10-09T14:00:00.000Z',
      endAt: '2026-10-09T14:45:00.000Z',
      status: 'SCHEDULED',
      priceMinor: 2500,
      currency: 'USD',
      notes: null,
    });
    expect(r.success).toBe(true);
  });

  it('rejects an unknown status', () => {
    const r = appointmentSchema.safeParse({
      id: uuid,
      customerId: uuid,
      serviceId: uuid,
      staffId: uuid,
      startAt: '2026-10-09T14:00:00.000Z',
      endAt: '2026-10-09T14:45:00.000Z',
      status: 'PENDING',
      priceMinor: 2500,
      currency: 'USD',
      notes: null,
    });
    expect(r.success).toBe(false);
  });

  it('parses an empty list', () => {
    expect(appointmentListSchema.safeParse([]).success).toBe(true);
  });

  it('has a Spanish label for every status', () => {
    expect(statusLabel.SCHEDULED).toBe('Agendada');
    expect(statusLabel.COMPLETED).toBe('Completada');
    expect(statusLabel.CANCELLED).toBe('Cancelada');
    expect(statusLabel.NO_SHOW).toBe('No asistió');
  });
});

describe('appointment form schema', () => {
  const base = {
    customerId: uuid,
    serviceId: uuid,
    staffId: uuid,
    date: '2026-10-09',
    time: '09:30',
    notes: '',
  };

  it('accepts a valid form', () => {
    expect(appointmentFormSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a missing customer', () => {
    expect(
      appointmentFormSchema.safeParse({ ...base, customerId: 'nope' }).success,
    ).toBe(false);
  });

  it('rejects a malformed time', () => {
    expect(appointmentFormSchema.safeParse({ ...base, time: '9am' }).success).toBe(
      false,
    );
  });
});
