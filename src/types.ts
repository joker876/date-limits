export interface DateLimitConfig {
  year?: number | DateLimitPartConfig;
  month?: number | DateLimitPartConfig;
  day?: number | DateLimitPartConfig;
}
export interface DateLimitConfigOnlyAdvanced {
  year?: DateLimitPartConfig;
  month?: DateLimitPartConfig;
  day?: DateLimitPartConfig;
}

export type Range<T> = { from: T; to: T };

export type DateLimitAny = undefined;
export type DateLimitStatic = number;
export type DateLimitList = number[];
export type DateLimitNSeries = { slope: number, offset?: number };
export type DateLimitRange = Range<number>;

export type DateLimitPartConfig =
  | DateLimitAny
  | DateLimitStatic
  | DateLimitList
  | DateLimitNSeries
  | DateLimitRange;
