
export * from './types';

// [
//   { year: 2023, month: 10, day: 19 },
//   { month: 10, day: 19 },
//   { month: 11 },
//   { day: 29 },
//   { day: 1 },
//   { year: 2022 },
//   { day: { type: DateLimitPartType.List, value: [1, 2, 5] } },
//   { year: 2024, month: 3, day: -1 },
//   { year: 2024, month: 2, day: -1 },
//   { year: 2023, day: -1 },
//   { day: -1 },
//   { day: { type: DateLimitPartType.NSeries, value: 5 } },
//   { day: { type: DateLimitPartType.NSeries, value: 5, offset: -2 } },
//   { day: { type: DateLimitPartType.NSeries, value: 5, offset: 1 } },
//   { year: { type: DateLimitPartType.NSeries, value: 5 } },
//   { month: { type: DateLimitPartType.Range, value: { from: 1, to: 5 } } }, //TODO
//   { day: { type: DateLimitPartType.Range, value: { from: 1, to: 5 } } },
//   { month: 10, day: { type: DateLimitPartType.Range, value: { from: 1, to: 20 } } },
// ].forEach(obj => {
//   console.log(getClosestDate(obj, new Date('2024-11-12T20:00:00.000Z')), obj);
// });
