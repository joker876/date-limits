export type Range<T> = { from: T; to: T };

export type RequiredAtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];
