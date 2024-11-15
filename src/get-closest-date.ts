import { transformSimpleConfig } from './config-transformers';
import { createUTCDate, isValidDate, standardizeDay } from './date-utils';
import { GeneralGenerator, } from './generators/general-generator';
import { makeYearGenerator, YearGenerator } from './generators/year-generator';
import { DateLimitConfig } from './types';

let passes = 0;

export function getClosestDate(config: DateLimitConfig, targetDate: Date = new Date(), yearLimit: number = 1970) {
  let currentYear: number = targetDate.getFullYear(),
    currentMonth: number = targetDate.getMonth() + 1,
    currentDay: number = targetDate.getDate();
  
  if (currentYear < yearLimit) {
    throw new Error(`Target date cannot be lower than the year limit.`);
  }

  const transformedConfig = transformSimpleConfig(config);

  passes = 0;

  const data = _getClosestDateHelper(
    targetDate,
    makeYearGenerator(transformedConfig.year, currentYear, yearLimit),
    new GeneralGenerator(transformedConfig.month, currentMonth, 12),
    new GeneralGenerator(transformedConfig.day, currentDay, 31),
    currentYear,
    currentMonth,
    currentDay
  );
  console.log(passes);
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
    passes++;
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
