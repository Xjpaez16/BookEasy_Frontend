import { describe, it, expect } from 'vitest';
import {
  toIsoWithOffset,
  dayRangeIso,
  minutesToHHMM,
  hhmmToMinutes,
  halfHourOptions,
  shiftDate,
} from './datetime';

describe('toIsoWithOffset', () => {
  it('produces a valid ISO instant from local date + time', () => {
    const iso = toIsoWithOffset('2026-10-09', '14:30');
    // Parsing it back yields a Date whose local clock reads 14:30 that day.
    const d = new Date(iso);
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMinutes()).toBe(30);
    expect(iso.endsWith('Z')).toBe(true);
  });

  it('throws on an invalid date/time', () => {
    expect(() => toIsoWithOffset('not-a-date', '99:99')).toThrow();
  });
});

describe('dayRangeIso', () => {
  it('returns a 24h [from, to) window', () => {
    const { from, to } = dayRangeIso('2026-10-09');
    const span = new Date(to).getTime() - new Date(from).getTime();
    expect(span).toBe(24 * 60 * 60 * 1000);
  });
});

describe('minutesToHHMM', () => {
  it('formats minutes-from-midnight', () => {
    expect(minutesToHHMM(0)).toBe('00:00');
    expect(minutesToHHMM(90)).toBe('01:30');
    expect(minutesToHHMM(540)).toBe('09:00');
    expect(minutesToHHMM(1439)).toBe('23:59');
  });
});

describe('hhmmToMinutes', () => {
  it('parses "HH:MM" into minutes-from-midnight', () => {
    expect(hhmmToMinutes('00:00')).toBe(0);
    expect(hhmmToMinutes('09:00')).toBe(540);
    expect(hhmmToMinutes('23:59')).toBe(1439);
    expect(hhmmToMinutes('24:00')).toBe(1440);
  });

  it('round-trips with minutesToHHMM', () => {
    for (const m of [0, 30, 540, 1020, 1440]) {
      expect(hhmmToMinutes(minutesToHHMM(m))).toBe(m);
    }
  });

  it('throws on garbage', () => {
    expect(() => hhmmToMinutes('nope')).toThrow();
    expect(() => hhmmToMinutes('25:00')).toThrow();
  });
});

describe('halfHourOptions', () => {
  it('spans 00:00..24:00 in 30-min steps', () => {
    const opts = halfHourOptions();
    expect(opts.length).toBe(49);
    expect(opts[0]).toEqual({ value: '00:00', minute: 0 });
    expect(opts.at(-1)).toEqual({ value: '24:00', minute: 1440 });
    expect(opts[1]).toEqual({ value: '00:30', minute: 30 });
  });
});

describe('shiftDate', () => {
  it('shifts a date forward and back', () => {
    expect(shiftDate('2026-10-09', 1)).toBe('2026-10-10');
    expect(shiftDate('2026-10-09', -1)).toBe('2026-10-08');
  });

  it('crosses a month boundary', () => {
    expect(shiftDate('2026-10-31', 1)).toBe('2026-11-01');
  });
});
