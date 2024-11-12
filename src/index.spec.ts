import { getClosestDate } from './get-closest-date';
import { DateLimitConfig } from './types';

describe('getClosestDate', () => {
  const targetDate = new Date('2024-11-12T20:00:00.000Z');

  function iso(config: DateLimitConfig): string | null {
    return getClosestDate(config, targetDate)?.toISOString() ?? null;
  }
  function date(year: number = 2024, month: number = 11, day: number = 11): string {
    return `${year}-${month}-${day}T23.59.59.999Z`;
  }

  it('should return correct static date', () => {
    expect(iso({ year: 2023, month: 10, day: 19 })).toBe(date(2023, 10, 19));
  });
});
