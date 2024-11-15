import { DateLimitPartConfig } from '../types';

export type YearGenerator = Generator<number | null, number | null>;

export function* makeYearGenerator(
  config: DateLimitPartConfig = undefined,
  startFrom: number,
  yearLimit: number = 1970
): YearGenerator {
  if (config === undefined) {
    let currentNum = startFrom;
    while (currentNum >= yearLimit) {
      yield currentNum--;
    }
    return null;
  }
  if (typeof config === 'number') {
    if (config <= startFrom) {
      yield config;
    }
    return null;
  }
  if (Array.isArray(config)) {
    for (let i = config.length; i >= 0; i--) {
      if (config[i] > startFrom) continue;
      yield config[i];
    }
    return null;
  }
  if ('slope' in config) {
    const { slope: a, offset: b = 0 } = config;
    const x = Math.floor((startFrom - b) / a);
    let currentNum = a * x + b;
    while (currentNum >= yearLimit) {
      yield currentNum;
      currentNum -= a;
    }
    return null;
  }
  let currentNum = startFrom > config.to ? config.to : startFrom;
  while (currentNum >= config.from) {
    if (currentNum > startFrom) continue;
    yield currentNum--;
  }
  return null;
}
