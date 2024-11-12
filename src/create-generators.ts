import { generateSequence } from './n-series';
import { DateLimitList, DateLimitPartConfig, DateLimitPartType, DateLimitRange, DateLimitStatic } from './types';

export type YearGenerator = Generator<number | null, number | null>;

export function* makeYearGenerator(
  config: DateLimitPartConfig = { type: DateLimitPartType.Any },
  startFrom: number
): YearGenerator {
  switch (config.type) {
    case DateLimitPartType.Any: {
      let currentNum = startFrom;
      while (currentNum >= 1970) {
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
      while (currentNum >= 1970) {
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

export interface GeneralGeneratorResult {
  value: number;
  looped: boolean;
}

export class GeneralGenerator implements IterableIterator<GeneralGeneratorResult> {
  private _currentNum!: number;
  private _nextFn!: (reset: boolean) => IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult>;
  private _resetToStartFn!: (minusOne: boolean) => void;

  constructor(
    private config: DateLimitPartConfig = { type: DateLimitPartType.Any },
    private startFrom: number,
    private limit: number
  ) {
    switch (config.type) {
      case DateLimitPartType.Static: {
        this._staticResetToStart();
        this._nextFn = this._staticNext;
        this._resetToStartFn = this._staticResetToStart;
        break;
      }
      case DateLimitPartType.List: {
        this._listResetToStart();
        this._nextFn = this._listNext;
        this._resetToStartFn = this._listResetToStart;
        break;
      }
      case DateLimitPartType.NSeries: {
        this.config = { type: DateLimitPartType.List, value: generateSequence(config, limit) };
        this._listResetToStart();
        this._nextFn = this._listNext;
        this._resetToStartFn = this._listResetToStart;
        break;
      }
      case DateLimitPartType.Range: {
        if (config.value.to > limit) {
          config.value.to = limit;
        }
        this._rangeResetToStart(limit === 31);
        this._nextFn = this._rangeNext;
        this._resetToStartFn = this._rangeResetToStart;
        break;
      }
      default: {
        this._anyResetToStart(limit === 31);
        this._nextFn = this._anyNext;
        this._resetToStartFn = this._anyResetToStart;
        break;
      }
    }
  }

  next(reset: boolean = false): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    return this._nextFn(reset);
  }
  resetToStart(minusOne: boolean = false): void {
    this._resetToStartFn(minusOne);
  }

  //! Any
  private _anyNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    if (reset || this._currentNum === 0) {
      this._currentNum = this.limit;
      return { value: { value: this._currentNum--, looped: !reset }, done: false };
    }
    return { value: { value: this._currentNum--, looped: false }, done: false };
  }
  private _anyResetToStart(minusOne: boolean): void {
    this._currentNum = this.startFrom - (minusOne ? 1 : 0);
  }

  //! Static
  private _looped: boolean = false;
  private _staticNext(_: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const nextVal = { value: { value: this._currentNum, looped: this._looped }, done: false };
    this._looped = true;
    return nextVal;
  }
  private _staticResetToStart(): void {
    this._currentNum = (this.config as DateLimitStatic).value;
  }

  //! List
  private _listNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const list = (this.config as DateLimitList).value;

    if (reset || this._currentNum < 0) {
      this._currentNum = list.length - 1;
      return { value: { value: list[this._currentNum--], looped: !reset }, done: false };
    }
    return { value: { value: list[this._currentNum--], looped: false }, done: false };
  }
  private _listResetToStart(): void {
    this._currentNum = (this.config as DateLimitList).value.findIndex(v => v >= this.startFrom) - 1;
  }

  //! Range
  private _rangeNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const range = (this.config as DateLimitRange).value;
    if (reset || this._currentNum === 0 || this._currentNum < range.from) {
      this._currentNum = Math.min(range.to, this.limit);
      return { value: { value: this._currentNum--, looped: !reset }, done: false };
    }
    return { value: { value: this._currentNum--, looped: false }, done: false };
  }
  private _rangeResetToStart(minusOne: boolean): void {
    this._currentNum = this.startFrom - (minusOne ? 1 : 0);
    if (this._currentNum > (this.config as DateLimitRange).value.to) {
      this._currentNum = (this.config as DateLimitRange).value.to;
    }
  }

  [Symbol.iterator]() {
    return this;
  }
}
