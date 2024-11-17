import { isDateBeforeLimit } from './is-date-before-limit';
import { DateLimitConfig } from './types';

describe('isDateBeforeLimit', () => {
  const referenceDate = new Date('2024-11-22T20:00:00.000Z');

  function idbl(year: number, month: number, day: number, config: DateLimitConfig | DateLimitConfig[]): boolean {
    return isDateBeforeLimit(date(year, month, day), config, referenceDate);
  }
  function date(year: number, month: number, day: number): Date {
    const yearStr = year.toString().padStart(4, '0');
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return new Date(`${yearStr}-${monthStr}-${dayStr}T23:59:59.999Z`);
  }

  it('should return correct value for single date config', () => {
    expect(idbl(2024, 1, 1, { year: 2023, month: 10, day: 19 })).toBeFalse();
  });
  it('should return correct value for multiple date configs', () => {
    expect(idbl(2024, 1, 1, [{ year: 2023 }, { year: 2024, day: 29 }])).toBeTrue();
  });
});
