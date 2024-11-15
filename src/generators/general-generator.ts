import { generateSequence } from '../sequence';
import { DateLimitList, DateLimitPartConfig, DateLimitRange, DateLimitStatic } from '../types';

export interface GeneralGeneratorResult {
  value: number;
  looped: boolean;
}

export class GeneralGenerator {
  private _currentNum!: number;
  private _nextFn!: (reset: boolean) => IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult>;
  private _skipToFn!: (to: number, minusOne: boolean) => void;

  constructor(private config: DateLimitPartConfig = undefined, private startFrom: number, private limit: number) {
    if (config === undefined) {
      this._anySkipTo(undefined, limit === 31);
      this._nextFn = this._anyNext;
      this._skipToFn = this._anySkipTo;
      return;
    }
    if (typeof config === 'number') {
      this._staticSkipTo();
      this._nextFn = this._staticNext;
      this._skipToFn = this._staticSkipTo;
      return;
    }
    if (Array.isArray(config)) {
      this._listSkipTo();
      this._nextFn = this._listNext;
      this._skipToFn = this._listSkipTo;
      return;
    }
    if ('slope' in config) {
      this.config = generateSequence(config, limit);
      this._listSkipTo();
      this._nextFn = this._listNext;
      this._skipToFn = this._listSkipTo;
      return;
    }
    if (config.to > limit) {
      config.to = limit;
    }
    this._rangeSkipTo(this.startFrom, limit === 31);
    this._nextFn = this._rangeNext;
    this._skipToFn = this._rangeSkipTo;
    return;
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
    this._currentNum = (this.config as DateLimitStatic);
  }

  //! List
  private _listNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const list = (this.config as DateLimitList);

    if (reset || this._currentNum < 0) {
      this._currentNum = list.length - 1;
      return { value: { value: list[this._currentNum--], looped: !reset }, done: false };
    }
    return { value: { value: list[this._currentNum--], looped: false }, done: false };
  }
  private _listSkipTo(to: number = this.startFrom): void {
    this._currentNum = (this.config as DateLimitList).findIndex(v => v >= to) - 1;
  }

  //! Range
  private _rangeNext(reset: boolean): IteratorResult<GeneralGeneratorResult, GeneralGeneratorResult> {
    const range = (this.config as DateLimitRange);
    if (reset || this._currentNum === 0 || this._currentNum < range.from) {
      this._currentNum = Math.min(range.to, this.limit);
      return { value: { value: this._currentNum--, looped: !reset }, done: false };
    }
    return { value: { value: this._currentNum--, looped: false }, done: false };
  }
  private _rangeSkipTo(to: number = this.startFrom, minusOne: boolean): void {
    this._currentNum = to - (minusOne ? 1 : 0);
    if (this._currentNum > (this.config as DateLimitRange).to) {
      this._currentNum = (this.config as DateLimitRange).to;
    }
  }
}
