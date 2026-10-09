import { describe, it, expect } from 'vitest';
import {
  formatMoney,
  parseMoneyToMinor,
  minorToMajorString,
  formatDuration,
} from './money';

describe('parseMoneyToMinor', () => {
  it('parses a plain integer amount to minor units', () => {
    expect(parseMoneyToMinor('25')).toBe(2500);
  });

  it('parses a two-decimal amount', () => {
    expect(parseMoneyToMinor('123.45')).toBe(12345);
  });

  it('accepts a comma decimal separator', () => {
    expect(parseMoneyToMinor('99,90')).toBe(9990);
  });

  it('strips whitespace', () => {
    expect(parseMoneyToMinor(' 1 200.00 ')).toBe(120000);
  });

  it('rounds to the nearest minor unit without float drift', () => {
    // 0.1 + 0.2 float traps: parse must land exactly on 10/20 cents.
    expect(parseMoneyToMinor('0.10')).toBe(10);
    expect(parseMoneyToMinor('0.20')).toBe(20);
    expect(parseMoneyToMinor('19.99')).toBe(1999);
  });

  it('rejects more than two decimals', () => {
    expect(parseMoneyToMinor('1.234')).toBeNull();
  });

  it('rejects a negative amount', () => {
    expect(parseMoneyToMinor('-5')).toBeNull();
  });

  it('rejects non-numeric input and empty string', () => {
    expect(parseMoneyToMinor('abc')).toBeNull();
    expect(parseMoneyToMinor('')).toBeNull();
  });
});

describe('minorToMajorString', () => {
  it('renders minor units as an editable two-decimal string', () => {
    expect(minorToMajorString(12345)).toBe('123.45');
    expect(minorToMajorString(0)).toBe('0.00');
    expect(minorToMajorString(5)).toBe('0.05');
  });

  it('round-trips with parseMoneyToMinor', () => {
    for (const minor of [0, 5, 99, 2500, 12345, 120000]) {
      expect(parseMoneyToMinor(minorToMajorString(minor))).toBe(minor);
    }
  });
});

describe('formatMoney', () => {
  it('formats minor units with the given currency', () => {
    // Exact symbol/format is locale-dependent; assert the digits are present.
    const out = formatMoney(12345, 'USD');
    expect(out).toMatch(/123[.,]45/);
  });

  it('falls back gracefully for an unknown currency code', () => {
    const out = formatMoney(12345, 'ZZZ');
    expect(out).toContain('123.45');
    expect(out).toContain('ZZZ');
  });
});

describe('formatDuration', () => {
  it('renders sub-hour durations in minutes', () => {
    expect(formatDuration(30)).toBe('30 min');
    expect(formatDuration(5)).toBe('5 min');
  });

  it('renders whole hours', () => {
    expect(formatDuration(60)).toBe('1 h');
    expect(formatDuration(120)).toBe('2 h');
  });

  it('renders hours plus minutes', () => {
    expect(formatDuration(90)).toBe('1 h 30 min');
    expect(formatDuration(145)).toBe('2 h 25 min');
  });
});
