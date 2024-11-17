import { getClosestDate } from './get-closest-date';
import { DateLimitConfig } from './types';

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
