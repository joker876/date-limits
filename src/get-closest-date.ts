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

    shouldResetDay ||= oldMonth > currentMonth;

    if (nextMonth.looped) {
      return _getClosestDateHelper(
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
    if (nextDay.looped) {
      return _getClosestDateHelper(
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

  const now = new Date();
  if (!isValidDate(date, currentYear, currentMonth, actualDay) || date.valueOf() >= now.valueOf()) {
    const resetMonth = date.getUTCMonth() > now.getUTCMonth();
    const resetDay = resetMonth || date.getUTCDate() > now.getUTCDate();
    if (resetMonth) {
      monthGenerator.resetToLimit();
    }
    if (resetMonth || resetDay) {
      dayGenerator.resetToLimit();
    }
      return _getClosestDateHelper(
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
