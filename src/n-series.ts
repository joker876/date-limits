export function generateSequence(params: { value: number; offset?: number }, limit: number): number[] {
  const { value: a, offset: b = 0 } = params;
  const result: number[] = [];

  let x = Math.max(1, Math.ceil(-b / a));
  let value = a * x + b;

  while (value < limit) {
    result.push(value);
    x++;
    value = a * x + b;
  }

  return result;
}
