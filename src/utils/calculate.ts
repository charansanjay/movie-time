export const average = (arr: number[]): number =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

export const calcAvgRunTime = (arr: number[]) => {
  if (arr.length === 0) return 0;

  // Filter out invalid numbers
  const validNumbers = arr.filter((num) => !isNaN(num));
  const sum = validNumbers.reduce((acc, num) => acc + num, 0);

  return validNumbers.length ? (sum / validNumbers.length) : 0;
}

/* Utility to convert runtime to minutes */
export const parseRuntime = (runtime: string | undefined): number => {

  if (!runtime) return 0; // Handle missing or invalid values

  // Match formats like "2h 30m" or "120 min
  const hourMatch = runtime.match(/(\d+)h/); // Extracts hours - Matches "2h"
  const minuteMatch = runtime.match(/(\d+)m/); // Extracts minutes - Matches "30m"
  const simpleMinuteMatch = runtime.match(/(\d+)\s*min/); // Matches "120 min"

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  const totalMinutes = simpleMinuteMatch ? parseInt(simpleMinuteMatch[1], 10) : hours * 60 + minutes;

  return totalMinutes
};