import { arrayDifference } from "./utils";
import { days, names } from "./types";
import type { Name, WeekData } from "./types";

function randomSample<T>(array: readonly T[], k: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < k; i++) {
    result.push(randomChoice(array));
  }
  return result;
}

function randomChoice<T>(array: readonly T[]): T {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function noDups<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

function randomPosNeg(): { positive: Name[]; negative: Name[] } {
  const maxPos = randomChoice([0, 1, 2, 3, 4, 5]);
  const positive = noDups(randomSample(names, maxPos));

  const remainingNames = arrayDifference(names, positive);

  const maxNeg = randomChoice([0, 1, 2]);
  const negative = noDups(randomSample(remainingNames, maxNeg));

  return { positive, negative };
}

export function randomWeeklyData(): WeekData {
  const daysEntries = days.map((day) => [day, { morning: randomPosNeg(), evening: randomPosNeg() }]);
  return Object.fromEntries(daysEntries) as WeekData;
}

export function emptyWeeklyData(): WeekData {
  const daysEntries = days.map((day) => [
    day,
    {
      morning: { positive: [], negative: [] },
      evening: { positive: [], negative: [] },
    },
  ]);
  return Object.fromEntries(daysEntries) as WeekData;
}
