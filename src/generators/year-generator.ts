import { DateLimitPartConfig, DateLimitPartType } from "../types";

export type YearGenerator = Generator<number | null, number | null>;

export function* makeYearGenerator(
  config: DateLimitPartConfig = { type: DateLimitPartType.Any },
  startFrom: number,
  yearLimit: number = 1970
): YearGenerator {
  switch (config.type) {
    case DateLimitPartType.Any: {
      let currentNum = startFrom;
      while (currentNum >= yearLimit) {
        yield currentNum--;
      }
      return null;
    }
    case DateLimitPartType.Static: {
      if (config.value <= startFrom) {
        yield config.value;
      }
      return null;
    }
    case DateLimitPartType.List: {
      for (let i = config.value.length; i >= 0; i--) {
        if (config.value[i] > startFrom) continue;
        yield config.value[i];
      }
      return null;
    }
    case DateLimitPartType.NSeries: {
      const { value: a, offset: b = 0 } = config;
      const x = Math.floor((startFrom - b) / a);
      let currentNum = a * x + b;
      while (currentNum >= yearLimit) {
        yield currentNum;
        currentNum -= a;
      }
      return null;
    }
    case DateLimitPartType.Range: {
      let currentNum = startFrom > config.value.to ? config.value.to : startFrom;
      while (currentNum >= config.value.from) {
        if (currentNum > startFrom) continue;
        yield currentNum--;
      }
      return null;
    }
  }
}
