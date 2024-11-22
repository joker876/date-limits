# date-limits

Check if a date is before a flexible limit.

## Highlights

- Supports TypeScript!
- Includes full JSDoc documentation
- Very lightweight!
- 100% test coverage!

## Installation

```
npm install date-limits
```

## Usage

```ts
import { getClosestDate, ... } from 'date-limits';
```

### getClosestDate

```ts
function getClosestDate(config: DateLimitConfig, targetDate: Date = new Date(), yearLimit: number = 1970): Date | null;
```

Finds the closest date that matches the given config and is before the _targetDate_, and the year does not exceed the _yearLimit_.

Returns the closest date as a `Date` object, or `null` if no date is found or the year limit was reached.

### isDateBeforeLimit

```ts
function isDateBeforeLimit(
  date: Date,
  configOrArray: DateLimitConfig | DateLimitConfig[],
  referenceDate?: Date,
  yearLimit?: number
): boolean;
```

Finds the closest date(s) matching the config object(s), that are below the _referenceDate_. Then tests if the given date is earlier than any of the found dates.

Returns `true` if the given _date_ is before the closest matching date to the reference date, otherwise `false`. If no matching dates were found also returns `false`.

### DateLimitConfig

Date requirements can be configured separately for the year, the month, and the day. All of those fields accept any of the below:

- `undefined` - matches any date.
- `number` - matches only if the date matches this exact number. Negative values can be used to signify the days from the end of the month (-1 is the last day, -2 the second to last day, etc.)
- `number[]` - matches only if the date is included in the array.
- `{ slope: number, offset?: number }` - matches only if the date is an element of the given arithmetic sequence (think eg. 3n+1).
- `{ from: number, to: number }` - matches only if the date is between `from` and `to` (inclusive). Any of those values can be ommitted, resulting in no lower or no upper boundary.

**Note:** The months and days are 1-indexed, meaning numbers 1-12 and 1-31 are accepted respectively.

#### Examples

```ts
{ year: undefined, month: 5, day: [1, 7] } // matches any date that is the 1st or the 7th of May
{ year: { from: 2000, to: 2030 } } // matches any date that is between the years 2000 and 2030
{ month: { slope: 3 }, day: -1 } // matches the last day of every 3rd month
```

### checkDateMatches

```ts
export function checkDateMatches(date: Date, config: DateMatchesConfig): boolean;
```

Checks if the given date matches the cron-like config.

Returns `true` if the date matches the config, otherwise `false`.

### DateMatchesConfig

Date matching requirements can be configured separately for the year, the month, the day, and the weekday. All of those fields can accept any of the below:

- `undefined` - matches any date.
- `number` - matches only if the date matches this exact number. Negative values can be used to signify the days from the end of the month (-1 is the last day, -2 the second to last day, etc.)
- `number[] | Set<number>` - matches only if the date is included in the array or Set.
- `{ slope: number, offset?: number }` - matches only if the date is an element of the given arithmetic sequence (think eg. 3n+1).
- `{ from: number, to: number }` - matches only if the date is between `from` and `to` (inclusive). Any of those values can be ommitted, resulting in no lower or no upper boundary.

**Note:** The months and days are 1-indexed, meaning numbers 1-12 and 1-31 are accepted respectively. The weekdays are 0-indexed (with 0 being Sunday, 1 being Monday, ...). Number 7 can also mean Sunday, but using 0 for Sunday is preferred.

#### Examples

```ts
{ month: 5, day: [1, 7] } // matches any date that is the 1st or the 7th of May
{ month: new Set([1, 2, 4, 8]), weekday: 0 } // matches any Sunday in the months January, February, Aprril, and August.
{ year: { from: 2000, to: 2030 } } // matches any date that is between the years 2000 and 2030
{ month: { slope: 3 }, day: -1 } // matches the last day of every 3rd month
{ year: { from: 1969 }, month: 2, day: 29, weekday: 5 } // matches any 29th of February that is also a Friday and is in or after the year 1969
```
