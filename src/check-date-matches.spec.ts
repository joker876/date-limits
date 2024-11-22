import { checkDateMatches } from './check-date-matches';

describe('checkDateMatches', () => {
  const date = new Date(Date.UTC(2023, 10, 20, 0, 0, 0));
  const dateSunday = new Date(Date.UTC(2023, 10, 19, 0, 0, 0));

  describe('Year configuration', () => {
    it('matches exact year', () => {
      expect(checkDateMatches(date, { year: 2023 })).toBe(true);
      expect(checkDateMatches(date, { year: 2022 })).toBe(false);
    });

    it('matches year from a list', () => {
      expect(checkDateMatches(date, { year: [2023, 2024] })).toBe(true);
      expect(checkDateMatches(date, { year: [2022, 2024] })).toBe(false);
    });

    it('matches year from a Set', () => {
      expect(checkDateMatches(date, { year: new Set([2023, 2024]) })).toBe(true);
      expect(checkDateMatches(date, { year: new Set([2022, 2024]) })).toBe(false);
    });

    it('matches year in a range', () => {
      expect(checkDateMatches(date, { year: { from: 2020, to: 2025 } })).toBe(true);
      expect(checkDateMatches(date, { year: { from: 2025, to: 2030 } })).toBe(false);
    });

    it('matches year in a series (n-series)', () => {
      expect(checkDateMatches(date, { year: { slope: 2 } })).toBe(false);
      expect(checkDateMatches(date, { year: { slope: 1 } })).toBe(true);
      expect(checkDateMatches(date, { year: { slope: 4, offset: 3 } })).toBe(true);
    });
  });

  describe('Month configuration', () => {
    it('matches exact month', () => {
      expect(checkDateMatches(date, { month: 11 })).toBe(true);
      expect(checkDateMatches(date, { month: 10 })).toBe(false);
    });

    it('matches month from a list', () => {
      expect(checkDateMatches(date, { month: [10, 11] })).toBe(true);
      expect(checkDateMatches(date, { month: [9, 10] })).toBe(false);
    });

    it('matches month in a range', () => {
      expect(checkDateMatches(date, { month: { from: 9, to: 12 } })).toBe(true);
      expect(checkDateMatches(date, { month: { from: 1, to: 6 } })).toBe(false);
    });
  });

  describe('Day configuration', () => {
    it('matches exact day', () => {
      expect(checkDateMatches(date, { day: 20 })).toBe(true);
      expect(checkDateMatches(date, { day: 19 })).toBe(false);
    });

    it('matches day in a list', () => {
      expect(checkDateMatches(date, { day: [19, 20, 21] })).toBe(true);
      expect(checkDateMatches(date, { day: [18, 19] })).toBe(false);
    });

    it('matches day in a range', () => {
      expect(checkDateMatches(date, { day: { from: 15, to: 25 } })).toBe(true);
      expect(checkDateMatches(date, { day: { from: 21, to: 30 } })).toBe(false);
    });
  });

  describe('Weekday configuration', () => {
    it('matches exact weekday', () => {
      expect(checkDateMatches(date, { weekday: 1 })).toBe(true);
      expect(checkDateMatches(date, { weekday: 0 })).toBe(false);
    });

    it('matches exact weekday for sunday in different forms', () => {
      expect(checkDateMatches(dateSunday, { weekday: 1 })).toBe(false);
      expect(checkDateMatches(dateSunday, { weekday: 0 })).toBe(true);
      expect(checkDateMatches(dateSunday, { weekday: 7 })).toBe(true);
    });

    it('matches weekday in a list', () => {
      expect(checkDateMatches(date, { weekday: [0, 1, 2] })).toBe(true);
      expect(checkDateMatches(date, { weekday: [3, 4, 5] })).toBe(false);
    });

    it('matches weekday in a range', () => {
      expect(checkDateMatches(date, { weekday: { from: 1, to: 3 } })).toBe(true);
      expect(checkDateMatches(date, { weekday: { from: 3, to: 6 } })).toBe(false);
    });
  });

  describe('Multiple configurations combined', () => {
    it('matches all parts', () => {
      expect(checkDateMatches(date, { year: 2023, month: 11, day: 20, weekday: 1 })).toBe(true);
    });

    it('fails if any part does not match', () => {
      expect(checkDateMatches(date, { year: 2023, month: 11, day: 19, weekday: 1 })).toBe(false);
    });
  });

  describe('Undefined configuration parts', () => {
    it('matches any date when no config is defined', () => {
      expect(checkDateMatches(date, {})).toBe(true);
    });

    it('ignores undefined parts and matches others', () => {
      expect(checkDateMatches(date, { year: 2023, month: undefined })).toBe(true);
      expect(checkDateMatches(date, { year: 2024, day: undefined })).toBe(false);
    });
  });
});
