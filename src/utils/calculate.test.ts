import { describe, it, expect } from 'vitest';
import { average, calcAvgRunTime, parseRuntime } from './calculate';

describe('average function', () => {
  it('should return the average of an array of numbers', () => {
    const result = average([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });

  it('should return 0 for an empty array', () => {
    const result = average([]);
    expect(result).toBe(0);
  });
});

describe('calcAvgRunTime function', () => {
  it('should return the average of an array of numbers', () => {
    const result = calcAvgRunTime([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });

  it('should return 0 for an empty array', () => {
    const result = calcAvgRunTime([]);
    expect(result).toBe(0);
  });

  it('should return 0 for an array with invalid numbers', () => {
    const result = calcAvgRunTime([1, 2, NaN, 3]);
    expect(result).toEqual(2);
  });
});

describe('parseRuntime function', () => {
  it('should parse the values of different formats correctly', () => {
    // Assert: Ensure Parsing works perfctly
    expect(parseRuntime('2h 30m')).toBe(150);
    expect(parseRuntime('120 min')).toBe(120);
    expect(parseRuntime('1h 45m')).toBe(105);
    expect(parseRuntime(undefined)).toBe(0);
    expect(parseRuntime('')).toBe(0);
    expect(parseRuntime('invalid')).toBe(0);
  });
});
