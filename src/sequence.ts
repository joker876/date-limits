export function generateSequence(params: { value: number; offset?: number }, limit: number): number[] {
  let { value: a, offset: b = 0 } = params;
  const result: number[] = [];

  b %= a;

  let x = Math.max(0, Math.ceil(-b / a));
  let value = a * x + b;

  while (value <= limit) {
    if (value > 0) {
      result.push(value);
    }
    x++;
    value = a * x + b;
  }

  return result;
}
