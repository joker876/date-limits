export function generateSequence(params: { slope: number; offset?: number }, limit: number): number[] {
  let { slope: a, offset: b = 0 } = params;
  if (Math.abs(a) === Infinity || Math.abs(b) === Infinity) {
    throw new Error(`Slope and offset cannot be set to Infinity`);
  }
  if (isNaN(a) || isNaN(b)) {
    return [];
  }
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
