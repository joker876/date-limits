export function createUTCDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
}

export function isValidDate(date: Date, year: number, month: number, day: number): boolean {
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function _isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
function _getMonthLength(year: number, month: number): number {
  if (_isLeapYear(year) && month === 2) return 29;
  return MONTH_LENGTHS[month - 1];
}

export function standardizeDay(year: number, month: number, day: number): number {
  if (day === 0) {
    throw new Error(`Day limit cannot have a value of zero.`);
  }
  const lastDay = _getMonthLength(year, month);
  if (day < 0) {
    day = -(-(day + 1) % lastDay);
    return lastDay - day;
  }
  return day;
}
