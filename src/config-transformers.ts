import { DateLimitConfig, DateLimitConfigOnlyAdvanced, DateLimitPartType } from "./types";


export function transformSimpleConfig(config: DateLimitConfig): DateLimitConfigOnlyAdvanced {
  if (typeof config.year === 'number') {
    config.year = { type: DateLimitPartType.Static, value: config.year };
  }
  if (typeof config.month === 'number') {
    config.month = { type: DateLimitPartType.Static, value: config.month };
  }
  if (typeof config.day === 'number') {
    config.day = { type: DateLimitPartType.Static, value: config.day };
  }
  return config as DateLimitConfigOnlyAdvanced;
}