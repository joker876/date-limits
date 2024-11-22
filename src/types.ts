import { Range, RequiredAtLeastOne } from './_internal-types';

/**
 * Configuration object for finding closest past date based on various criteria.
 */
export interface DateLimitConfig {
  /**
   * Configuration for checking years.
   */
  year?: DateLimitPartConfig;
  /**
   * Configuration for checking months (1-12).
   */
  month?: DateLimitPartConfig;
  /**
   * Configuration for checking days of the month (1-31).
   */
  day?: DateLimitPartConfig;
}

type DateLimitAny = undefined;
type DateLimitStatic = number;
type DateLimitList = number[];
type DateLimitNSeries = { slope: number; offset?: number };
type DateLimitRange = RequiredAtLeastOne<Range<number>>;

/**
 * Represents a part of the date limit configuration, which can take various forms:
 * - `undefined`: Matches any value.
 * - `number`: Matches an exact value.
 * - `number[]`: Matches any value in the list.
 * - `{ slope: number, offset?: number }`: Matches values in an arithmetic sequence.
 * - `Range<number>`: Matches values within a specific range. Both values are optional, but at least one has to be defined.
 */
export type DateLimitPartConfig = DateLimitAny | DateLimitStatic | DateLimitList | DateLimitNSeries | DateLimitRange;
