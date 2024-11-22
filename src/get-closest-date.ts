import { createUTCDate, isValidDate, standardizeDay } from './date-utils';
import { GeneralGenerator } from './generators/general-generator';
import { makeYearGenerator, YearGenerator } from './generators/year-generator';
import { DateLimitConfig } from './types';

/**
 * Finds the closest date that matches the given config and is before the *targetDate*, and the year does not exceed the *yearLimit*.
 *
 * Returns the closest date as a Date object, or null if no date is found or the year limit was reached.
 * @param config The config to match the date against.
 * @param targetDate To date to start looking from for the closest match.
 * @param yearLimit The lower limit for finding matching dates.
 * @returns `Date` object if a matching date is found, otherwise `null`.
 */
export function getClosestDate(
  config: DateLimitConfig,
  targetDate: Date = new Date(),
  yearLimit: number = 1970
): Date | null {
  let currentYear: number = targetDate.getFullYear(),
    currentMonth: number = targetDate.getMonth() + 1,
    currentDay: number = targetDate.getDate();

  if (currentYear < yearLimit) {
    throw new Error(`Target date cannot be lower than the year limit.`);
  }

  const data = _getClosestDateHelper(
    targetDate,
    makeYearGenerator(config.year, currentYear, yearLimit),
    new GeneralGenerator(config.month, currentMonth, 12),
    new GeneralGenerator(config.day, currentDay, 31),
    currentYear,
    currentMonth,
    currentDay
  );
  return data;
}

function _getClosestDateHelper(
  targetDate: Date,
  yearGenerator: YearGenerator,
  monthGenerator: GeneralGenerator,
  dayGenerator: GeneralGenerator,
  currentYear: number,
  currentMonth: number,
  currentDay: number,
  getNextYear: boolean = true,
  getNextMonth: boolean = true,
  getNextDay: boolean = true,
  shouldResetMonth: boolean = true,
  shouldResetDay: boolean = true
): Date | null {
  while (true) {
    if (getNextYear) {
      const oldYear = currentYear;
      const nextYear = yearGenerator.next().value;
      if (nextYear === null) return null;
      currentYear = nextYear;
      getNextYear = false;

      shouldResetMonth &&= oldYear > currentYear;
      shouldResetDay ||= shouldResetMonth;
    }
    if (getNextMonth) {
      const oldMonth = currentMonth;
      const nextMonth = monthGenerator.next(shouldResetMonth).value;
      currentMonth = nextMonth.value;
      getNextMonth = false;

      if (currentMonth < 1 || currentMonth > 12) {
        throw new Error('Month number must be within 1 and 12 inclusive');
      }

      shouldResetDay ||= oldMonth > currentMonth;

      if (nextMonth.looped) {
        getNextYear = true;
        continue;
      }
    }
    if (getNextDay) {
      const nextDay = dayGenerator.next(shouldResetDay).value;
      currentDay = nextDay.value;
      getNextDay = false;

      if (currentDay === 0 || currentDay > 31) {
        throw new Error('Day number must be less than or equal to 31 and cannot be 0');
      }

      if (nextDay.looped) {
        getNextYear = false;
        getNextMonth = true;
        continue;
      }
    }
    const actualDay = standardizeDay(currentYear, currentMonth, currentDay);
    const date = createUTCDate(currentYear, currentMonth, actualDay);

    if (!isValidDate(date, currentYear, currentMonth, actualDay) || date.valueOf() >= targetDate.valueOf()) {
      if (date.getUTCFullYear() === targetDate.getUTCFullYear()) {
        const resetMonth = date.getUTCMonth() > targetDate.getUTCMonth();
        const resetDay = resetMonth || date.getUTCDate() >= targetDate.getUTCDate();
        if (resetMonth) {
          monthGenerator.skipTo();
        }
        if (resetDay) {
          dayGenerator.skipTo(undefined, true);
        }
      }
      getNextYear = false;
      getNextMonth = false;
      getNextDay = true;
      shouldResetDay = false;
      continue;
    }
    return date;
  }
}
