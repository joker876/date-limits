import { Range, RequiredAtLeastOne } from './_internal-types';

/**
 * Configuration object for checking dates based on various criteria.
 */
export interface DateMatchesConfig {
  /**
   * Configuration for checking years.
   */
  year?: DateMatchesPartConfig;
  /**
   * Configuration for checking months (1-12).
   */
  month?: DateMatchesPartConfig;
  /**
   * Configuration for checking days of the month (1-31).
   */
  day?: DateMatchesPartConfig;
  /**
   * Configuration for checking weekdays (0-7, where 0 and 7 are Sunday).
   */
  weekday?: DateMatchesPartConfig;
}

type DateMatchesConfigAny = undefined;
type DateMatchesConfigStatic = number;
type DateMatchesConfigList = number[] | Set<number>;
type DateMatchesConfigNSeries = { slope: number; offset?: number };
type DateMatchesConfigRange = RequiredAtLeastOne<Range<number>>;

/**
 * Represents a part of the date matcher configuration, which can take various forms:
 * - `undefined`: Matches any value.
 * - `number`: Matches an exact value.
 * - `number[]` or `Set<number>`: Matches any value in the list or set.
 * - `{ slope: number, offset?: number }`: Matches values in an arithmetic sequence.
 * - `Range<number>`: Matches values within a specific range. Both values are optional, but at least one has to be defined.
 */
export type DateMatchesPartConfig =
  | DateMatchesConfigAny
  | DateMatchesConfigStatic
  | DateMatchesConfigList
  | DateMatchesConfigNSeries
  | DateMatchesConfigRange;

/**
 * Checks if the given date matches the cron-like config.
 * @param date - The date to check.
 * @param config - The configuration object defining the criteria.
 * @returns `true` if the date matches the criteria, otherwise `false`.
 */
export function checkDateMatches(date: Date, config: DateMatchesConfig): boolean {
  if (!_checkValueMatches(date.getUTCFullYear(), config.year)) return false;

  if (!_checkValueMatches(date.getUTCMonth() + 1, config.month)) return false;

  if (!_checkValueMatches(date.getUTCDate(), config.day)) return false;

  const weekday = date.getUTCDay();
  if (!_checkValueMatches(weekday, config.weekday)) {
    if (weekday !== 0) {
      return false;
    }
    if (!_checkValueMatches(7, config.weekday)) return false;
  }

  return true;
}

/**
 * Helper function to determine if a single value matches a specific configuration part.
 *
 * @param value - The value to check.
 * @param configPart - The configuration part defining the criteria.
 * @returns `true` if the value matches the criteria, otherwise `false`.
 * @private
 */
function _checkValueMatches(value: number, configPart: DateMatchesPartConfig): boolean {
  if (configPart === undefined) return true;
  if (typeof configPart === 'number') return value === configPart;
  if (configPart instanceof Set) return configPart.has(value);
  if (Array.isArray(configPart)) return new Set(configPart).has(value);
  if ('slope' in configPart) {
    value -= configPart.offset ?? 0;
    return value % configPart.slope === 0;
  }
  return (
    (configPart.from === undefined || value >= configPart.from) &&
    (configPart.to === undefined || value <= configPart.to)
  );
}
