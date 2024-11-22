import { getClosestDate } from './get-closest-date';
import { DateLimitConfig } from './types';

/**
 * Finds the closest date(s) matching the config object(s), that are below the _referenceDate_. Then tests if the given date is earlier than any of the found dates.
 * @param date The date to check.
 * @param configOrArray A single config object or an array of config objects.
 * @param referenceDate The date to search for closest dates from.
 * @param yearLimit The lower limit for finding matching dates.
 * @returns `true` if the given _date_ is before the closest matching date to the reference date, otherwise `false`. If no matching dates were found also returns `false`.
 */
export function isDateBeforeLimit(
  date: Date,
  configOrArray: DateLimitConfig | DateLimitConfig[],
  referenceDate?: Date,
  yearLimit?: number
): boolean {
  if (!Array.isArray(configOrArray)) {
    configOrArray = [configOrArray];
  }
  for (const config of configOrArray) {
    if (_isDateBeforeLimitSingle(date, config, referenceDate, yearLimit)) {
      return true;
    }
  }
  return false;
}

function _isDateBeforeLimitSingle(
  date: Date,
  config: DateLimitConfig,
  referenceDate?: Date,
  yearLimit?: number
): boolean {
  const closestDate = getClosestDate(config, referenceDate, yearLimit);
  return !!closestDate && closestDate.valueOf() > date.valueOf();
}
