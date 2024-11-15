import { generateSequence } from '../sequence';
import { DateLimitList, DateLimitPartConfig, DateLimitPartType, DateLimitRange, DateLimitStatic } from '../types';

export interface GeneralGeneratorResult {
  value: number;
  looped: boolean;
}

export class GeneralGenerator {
  private _currentNum!: number;
  private _nextFn!: (reset: boolean) => IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult>;
  private _skipToFn!: (to: number, minusOne: boolean) => void;

  constructor(
    private config: DateLimitPartConfig = { type: DateLimitPartType.Any },
    private startFrom: number,
    private limit: number
  ) {
    switch (config.type) {
      case DateLimitPartType.Static: {
        this._staticSkipTo();
        this._nextFn = this._staticNext;
        this._skipToFn = this._staticSkipTo;
        break;
      }
      case DateLimitPartType.List: {
        this._listSkipTo();
        this._nextFn = this._listNext;
        this._skipToFn = this._listSkipTo;
        break;
      }
      case DateLimitPartType.NSeries: {
        this.config = { type: DateLimitPartType.List, value: generateSequence(config, limit) };
        this._listSkipTo();
        this._nextFn = this._listNext;
        this._skipToFn = this._listSkipTo;
        break;
      }
      case DateLimitPartType.Range: {
        if (config.value.to > limit) {
          config.value.to = limit;
        }
        this._rangeSkipTo(this.startFrom, limit === 31);
        this._nextFn = this._rangeNext;
        this._skipToFn = this._rangeSkipTo;
        break;
      }
      default: {
        this._anySkipTo(undefined, limit === 31);
        this._nextFn = this._anyNext;
        this._skipToFn = this._anySkipTo;
        break;
      }
    }
  }

  next(reset: boolean = false): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    return this._nextFn(reset);
  }
  skipTo(to: number = this.startFrom, minusOne: boolean = false): void {
    this._skipToFn(to, minusOne);
  }

  //! Any
  private _anyNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    if (reset || this._currentNum === 0) {
      this._currentNum = this.limit;
      return { value: { value: this._currentNum--, looped: !reset }, done: false };
    }
    return { value: { value: this._currentNum--, looped: false }, done: false };
  }
  private _anySkipTo(to: number = this.startFrom, minusOne: boolean): void {
    this._currentNum = to - (minusOne ? 1 : 0);
  }

  //! Static
  private _looped: boolean = false;
  private _staticNext(_: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const nextVal = { value: { value: this._currentNum, looped: this._looped }, done: false };
    this._looped = true;
    return nextVal;
  }
  private _staticSkipTo(): void {
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
  private _listSkipTo(to: number = this.startFrom): void {
    this._currentNum = (this.config as DateLimitList).value.findIndex(v => v >= to) - 1;
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
  private _rangeSkipTo(to: number = this.startFrom, minusOne: boolean): void {
    this._currentNum = to - (minusOne ? 1 : 0);
    if (this._currentNum > (this.config as DateLimitRange).value.to) {
      this._currentNum = (this.config as DateLimitRange).value.to;
    }
  }
}
