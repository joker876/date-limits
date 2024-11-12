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

export const DateLimitPartType = {
  Any: 'any',
  Static: 'static',
  List: 'list',
  NSeries: 'n-series',
  Range: 'range',
} as const;
export type DateLimitPartType = (typeof DateLimitPartType)[keyof typeof DateLimitPartType];

export type Range<T> = { from: T; to: T };

export type DateLimitAny = { type: (typeof DateLimitPartType)['Any'] };
export type DateLimitStatic = { type: (typeof DateLimitPartType)['Static']; value: number };
export type DateLimitList = { type: (typeof DateLimitPartType)['List']; value: number[] };
export type DateLimitNSeries = { type: (typeof DateLimitPartType)['NSeries']; value: number; offset?: number };
export type DateLimitRange = { type: (typeof DateLimitPartType)['Range']; value: Range<number> };

export type DateLimitPartConfig =
  | DateLimitAny
  | DateLimitStatic
  | DateLimitList
  | DateLimitNSeries
  | DateLimitRange;
