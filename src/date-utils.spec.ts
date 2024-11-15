import { createUTCDate, isValidDate, standardizeDay } from './date-utils';

describe('createUTCDate', () => {
  it('should create a valid UTC date with correct values', () => {
    const date = createUTCDate(2024, 5, 15);
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(4); // Months are zero-based
    expect(date.getUTCDate()).toBe(15);
    expect(date.getUTCHours()).toBe(23);
    expect(date.getUTCMinutes()).toBe(59);
    expect(date.getUTCSeconds()).toBe(59);
    expect(date.getUTCMilliseconds()).toBe(999);
  });

  it('should handle leap years correctly', () => {
    const date = createUTCDate(2024, 2, 29);
    expect(date.getUTCFullYear()).toBe(2024);
    expect(date.getUTCMonth()).toBe(1); // February is zero-based month 1
    expect(date.getUTCDate()).toBe(29);
  });

  it('should handle invalid inputs gracefully', () => {
    const date = createUTCDate(2024, 13, 40);
    expect(date.getUTCMonth()).toBe(1); // Invalid months/rollovers are handled by Date
  });
});

describe('isValidDate', () => {
  it('should validate a correct date', () => {
    const date = new Date(Date.UTC(2023, 11, 25));
    expect(isValidDate(date, 2023, 12, 25)).toBeTrue();
  });

  it('should invalidate an incorrect date', () => {
    const date = new Date(Date.UTC(2023, 11, 25));
    expect(isValidDate(date, 2023, 12, 24)).toBeFalse();
  });

  it('should account for month mismatches', () => {
    const date = new Date(Date.UTC(2023, 0, 1));
    expect(isValidDate(date, 2023, 1, 1)).toBeTrue();
    expect(isValidDate(date, 2023, 12, 1)).toBeFalse();
  });
});

describe('standardizeDay', () => {
  it('should return the same day for positive day values within month limits', () => {
    expect(standardizeDay(2023, 7, 15)).toBe(15);
  });

  it('should standardize negative days correctly', () => {
    expect(standardizeDay(2023, 7, -1)).toBe(31);
  });

  it('should throw an error for day value of zero', () => {
    expect(() => standardizeDay(2023, 7, 0)).toThrowError('Day limit cannot have a value of zero.');
  });

  it('should handle leap years correctly for February', () => {
    expect(standardizeDay(2024, 2, -1)).toBe(29);
  });

  it('should wrap around for negative days beyond the month length', () => {
    expect(standardizeDay(2023, 7, -32)).toBe(31);
  });
});
