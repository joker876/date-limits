import { generateSequence } from './sequence';

describe('generateSequence', () => {
  it('should generate a correct sequence with positive value and no offset', () => {
    const sequence = generateSequence({ value: 3 }, 10);
    expect(sequence).toEqual([3, 6, 9]);
  });

  it('should handle a positive value with a positive offset', () => {
    const sequence = generateSequence({ value: 4, offset: 1 }, 15);
    expect(sequence).toEqual([1, 5, 9, 13]);
  });

  it('should handle a positive value with a negative offset', () => {
    const sequence = generateSequence({ value: 5, offset: -2 }, 20);
    expect(sequence).toEqual([3, 8, 13, 18]);
  });

  it('should return an empty array if limit is less than the first positive value', () => {
    const sequence = generateSequence({ value: 7 }, 5);
    expect(sequence).toEqual([]);
  });

  it('should handle large offsets by normalizing them', () => {
    const sequence = generateSequence({ value: 6, offset: 20 }, 30);
    expect(sequence).toEqual([2, 8, 14, 20, 26]);
  });

  it('should handle a zero offset', () => {
    const sequence = generateSequence({ value: 5, offset: 0 }, 20);
    expect(sequence).toEqual([5, 10, 15, 20]);
  });

  it('should handle limits that are not divisible by value', () => {
    const sequence = generateSequence({ value: 4 }, 18);
    expect(sequence).toEqual([4, 8, 12, 16]);
  });

  it('should handle negative offsets', () => {
    const sequence = generateSequence({ value: 6, offset: -3 }, 20);
    expect(sequence).toEqual([3, 9, 15]);
  });
  it('should handle negative offsets resulting in the first value being within the limit', () => {
    const sequence = generateSequence({ value: 6, offset: -8 }, 20);
    expect(sequence).toEqual([4, 10, 16]);
  });
});