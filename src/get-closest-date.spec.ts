import { getClosestDate } from './get-closest-date';
import { DateLimitConfig } from './types';

describe('getClosestDate', () => {
  const targetDate = new Date('2024-11-22T20:00:00.000Z');

  function iso(config: DateLimitConfig): string | null {
    return getClosestDate(config, targetDate)?.toISOString?.() ?? null;
  }
  function date(year: number = 2024, month: number = 11, day: number = 11): string {
    const yearStr = year.toString().padStart(4, '0');
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}T23:59:59.999Z`;
  }

  it('should return correct fully static date', () => {
    expect(iso({ year: 2023, month: 10, day: 19 })).toBe(date(2023, 10, 19));
  });
  it('should return null for a date in the future', () => {
    expect(iso({ year: 2069, month: 1, day: 1 })).toBe(null);
  });
  it('should return correct date for year: undefined, month: static, day: static', () => {
    expect(iso({ month: 10, day: 19 })).toBe(date(2024, 10, 19));
  });
  it('should return correct date for year: undefined, month: static, day: undefined', () => {
    expect(iso({ month: 10 })).toBe(date(2024, 10, 31));
  });
  it('should return correct date for year: undefined, month: static (near target), day: undefined', () => {
    expect(iso({ month: 11 })).toBe(date(2024, 11, 21));
  });
  it('should return correct date for year: undefined, month: undefined, day: static (before target)', () => {
    expect(iso({ day: 1 })).toBe(date(2024, 11, 1));
  });
  it('should return correct date for year: undefined, month: undefined, day: static (after target)', () => {
    expect(iso({ day: 29 })).toBe(date(2024, 10, 29));
  });
  it('should return correct date for year: static, month: undefined, day: undefined', () => {
    expect(iso({ year: 2022 })).toBe(date(2022, 12, 31));
  });
  it('should return correct date for year: undefined, month: static, day: static (negative) for 31 day month', () => {
    expect(iso({ month: 10, day: -1 })).toBe(date(2024, 10, 31));
  });
  it('should return correct date for year: undefined, month: static, day: static (negative) for 30 day month', () => {
    expect(iso({ month: 9, day: -1 })).toBe(date(2024, 9, 30));
  });
  it('should return correct date for year: static, month: static, day: static (negative) for non-leap year February', () => {
    expect(iso({ year: 2023, month: 2, day: -1 })).toBe(date(2023, 2, 28));
  });
  it('should return correct date for year: static, month: static, day: static (negative) for leap year February', () => {
    expect(iso({ year: 2024, month: 2, day: -1 })).toBe(date(2024, 2, 29));
  });
  it('should return correct date for year: undefined, month: February, day: 29', () => {
    expect(iso({ month: 2, day: 29 })).toBe(date(2024, 2, 29));
  });
  it('should return correct date for year: list, month: February, day: 29', () => {
    expect(iso({ year: [2004, 2019, 2023], month: 2, day: 29 })).toBe(date(2004, 2, 29));
  });
  it('should return null for year: list, month: February, day: 29 when supplied only non-leap years', () => {
    expect(iso({ year: [2003, 2019, 2023], month: 2, day: 29 })).toBe(null);
  });
  it('should ignore years in a list that are larger than target year', () => {
    expect(iso({ year: [2003, 2019, 2023, 2100], month: 2, day: 29 })).toBe(null);
  });
  it('should return correct date for year: undefined, month: undefined, day: list (only before target)', () => {
    expect(iso({ day: [1, 2, 5] })).toBe(date(2024, 11, 5));
  });
  it('should return correct date for year: undefined, month: undefined, day: 5n', () => {
    expect(iso({ day: { slope: 5 } })).toBe(date(2024, 11, 20));
  });
  it('should return correct date for year: undefined, month: undefined, day: 5n-1', () => {
    expect(iso({ day: { slope: 5, offset: -1 } })).toBe(date(2024, 11, 19));
  });
  it('should return correct date for year: undefined, month: undefined, day: 5n+2', () => {
    expect(iso({ day: { slope: 5, offset: 2 } })).toBe(date(2024, 11, 17));
  });
  it('should return correct date for year: 5n, month: undefined, day: undefined', () => {
    expect(iso({ year: { slope: 5 } })).toBe(date(2020, 12, 31));
  });
  it('should return correct date for year: 5n, month: 3n, day: 9n', () => {
    expect(iso({ year: { slope: 5 }, month: { slope: 3 }, day: { slope: 9 } })).toBe(date(2020, 12, 27));
  });
  it('should return null for year: 4n-1, month: February, day: 29', () => {
    expect(iso({ year: { slope: 4, offset: -1 }, month: 2, day: 29 })).toBe(null);
  });
  it('should return correct date for year: from 2018 to 2022, month: February, day: 29', () => {
    expect(iso({ year: { from: 2018, to: 2022 }, month: 2, day: 29 })).toBe(date(2020, 2, 29));
  });
  it('should throw for year range where "from" is larger than "to"', () => {
    expect(() => iso({ year: { from: 2022, to: 2018 }, month: 2, day: 29 })).toThrow();
  });
  it('should return correct date for year range higher than target year', () => {
    expect(iso({ year: { from: 2018, to: 2100 } })).toBe(date(2024, 11, 21));
  });
  it('should return null for year range all abive the target year', () => {
    expect(iso({ year: { from: 2099, to: 2100 } })).toBe(null);
  });
  it('should return null for year: from 2021 to 2023, month: February, day: 29', () => {
    expect(iso({ year: { from: 2021, to: 2023 }, month: 2, day: 29 })).toBe(null);
  });
  it('should return correct date for year: undefined, month: from 1 to 5, day: undefined', () => {
    expect(iso({ month: { from: 1, to: 5 } })).toBe(date(2024, 5, 31));
  });
  it('should return correct date for year: undefined, month: from 1 to 12, day: undefined', () => {
    expect(iso({ month: { from: 1, to: 12 } })).toBe(date(2024, 11, 21));
  });
  it('should throw for month range where "from" is larger than "to"', () => {
    expect(() => iso({ month: { from: 12, to: 11 } })).toThrow();
  });
  it('should return correct date for year: undefined, month: February, day: from 1 to 31', () => {
    expect(iso({ month: 2, day: { from: 1, to: 31 } })).toBe(date(2024, 2, 29));
  });
  it('should return null for year: undefined, month: February, day: from 30 to 31', () => {
    expect(iso({ month: 2, day: { from: 30, to: 31 } })).toBe(null);
  });
  it('should throw for day range where "from" is larger than "to"', () => {
    expect(() => iso({ day: { from: 31, to: 1 } })).toThrow();
  });
  it('should return null for year: undefined, month: February, day: from 30 to 31', () => {
    expect(iso({ month: 2, day: 30 })).toBe(null);
  });
  it('should throw for year: undefined, month: undefined, day: 32', () => {
    expect(() => iso({ day: 32 })).toThrow();
  });
  it('should handle ranges over the limit', () => {
    expect(iso({ day: { from: 1, to: 40 } })).toBe(date(2024, 11, 21));
  });
  it('should handle ranges over the limit', () => {
    expect(() => getClosestDate({}, new Date(0), 2000)).toThrow();
  });
  it('should handle invalid months gracefully', () => {
    expect(() => iso({ month: 0 })).toThrow();
  });
});
