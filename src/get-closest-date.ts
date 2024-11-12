import { transformSimpleConfig } from './config-transformers';
import { GeneralGenerator, makeYearGenerator, YearGenerator } from './create-generators';
import { createUTCDate, isValidDate, standardizeDay } from './date-utils';
import { DateLimitConfig } from './types';

let passes = 0;

export function getClosestDate(config: DateLimitConfig, targetDate: Date = new Date()) {
  let currentYear: number = targetDate.getFullYear(),
    currentMonth: number = targetDate.getMonth() + 1,
    currentDay: number = targetDate.getDate();

  const transformedConfig = transformSimpleConfig(config);

  passes = 0;

  // return _getClosestDateHelper(
  //   makeYearGenerator(transformedConfig.year, currentYear),
  //   makeGeneralGenerator(transformedConfig.month, currentMonth, 12),
  //   makeGeneralGenerator(transformedConfig.day, currentDay, 31),
  //   currentYear,
  //   currentMonth,
  //   currentDay
  // );
  const data = _getClosestDateHelper(
    targetDate,
    makeYearGenerator(transformedConfig.year, currentYear),
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
  passes++;
  if (getNextYear) {
    const oldYear = currentYear;
    const nextYear = yearGenerator.next().value;
    if (nextYear === null) return null;
    currentYear = nextYear;

    shouldResetMonth &&= oldYear > currentYear;
    shouldResetDay ||= shouldResetMonth;
  }
  if (getNextMonth) {
    const oldMonth = currentMonth;
    const nextMonth = monthGenerator.next(shouldResetMonth).value;
    currentMonth = nextMonth.value;

    if (currentMonth < 1 || currentMonth > 12) {
      throw new Error('Month number must be within 1 and 12 inclusive');
    }

    shouldResetDay ||= oldMonth > currentMonth;

    if (nextMonth.looped) {
      return _getClosestDateHelper(
        targetDate,
        yearGenerator,
        monthGenerator,
        dayGenerator,
        currentYear,
        currentMonth,
        currentDay,
        true,
        false,
        getNextDay,
        shouldResetMonth,
        shouldResetDay
      );
    }
  }
  if (getNextDay) {
    const nextDay = dayGenerator.next(shouldResetDay).value;
    currentDay = nextDay.value;

    if (currentDay === 0 || currentDay > 31) {
      throw new Error('Day number must be less than or equal to 31');
    }

    console.log(nextDay);
    if (nextDay.looped) {
      return _getClosestDateHelper(
        targetDate,
        yearGenerator,
        monthGenerator,
        dayGenerator,
        currentYear,
        currentMonth,
        currentDay,
        false,
        true,
        false,
        shouldResetMonth,
        shouldResetDay
      );
    }
  }
  const actualDay = standardizeDay(currentYear, currentMonth, currentDay);
  const date = createUTCDate(currentYear, currentMonth, actualDay);

  if (!isValidDate(date, currentYear, currentMonth, actualDay) || date.valueOf() >= targetDate.valueOf()) {
    if (date.getUTCFullYear() === targetDate.getUTCFullYear()) {
      const resetMonth = date.getUTCMonth() > targetDate.getUTCMonth();
      const resetDay = resetMonth || date.getUTCDate() >= targetDate.getUTCDate();
      if (resetMonth) {
        monthGenerator.resetToStart();
      }
      if (resetMonth || resetDay) {
        dayGenerator.resetToStart(true);
      }
    }
    return _getClosestDateHelper(
      targetDate,
      yearGenerator,
      monthGenerator,
      dayGenerator,
      currentYear,
      currentMonth,
      currentDay,
      false,
      false,
      true,
      shouldResetMonth,
      false
    );
  }
  return date;
}
