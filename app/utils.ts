import { format, parse, setHours, startOfDay, startOfHour, startOfWeek } from "date-fns";

function dateFirstDayOfWeek(inputDate: Date): Date {
  return startOfWeek(inputDate, { weekStartsOn: 0 });
}

export function timestampFirstDayOfWeek(inputDate: Date = new Date()): number {
  return +dateFirstDayOfWeek(inputDate);
}

export function dateToShortString(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function shortStringToDate(str: string): Date {
  return parse(str, "MMM d, yyyy", 0);
}

/**
 * @param hour between 0 and 24
 */
export function atRoundHour(date: Date | number, hour: number) {
  return startOfHour(setHours(date, hour));
}

export function advanceTimestampByDays(timestamp: number, numDaysLater: number): number {
  const result = new Date(timestamp);
  result.setDate(result.getDate() + numDaysLater);
  return +result;
}

export function relativeWeek(dateInput: Date): string {
  const startOfThisWeek = dateFirstDayOfWeek(new Date());
  const startOfThatWeek = dateFirstDayOfWeek(dateInput);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksDifference = Math.round((startOfThatWeek.getTime() - startOfThisWeek.getTime()) / msPerWeek);

  if (weeksDifference === 0) {
    return "This Week";
  } else if (weeksDifference === 1) {
    return "Next Week";
  } else if (weeksDifference > 1) {
    return `In ${weeksDifference} Weeks`;
  } else if (weeksDifference === -1) {
    return "Last Week";
  } else {
    return `${-weeksDifference} Weeks Ago`;
  }
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export function removeFromArray<T>(array: T[], x: T): void {
  array.splice(array.indexOf(x), 1);
}

export function arraySetAdd<T>(array: T[], x: T): void {
  if (!array.includes(x)) {
    array.push(x);
  }
}

export function removeIfExists<T>(array: T[], x: T): void {
  const idx = array.indexOf(x);
  if (idx !== -1) array.splice(idx, 1);
}

export function pushIfNotExists<T>(array: T[], x: T): void {
  if (!array.includes(x)) {
    array.push(x);
  }
}

export function arrayWithout<T>(array: readonly T[], x: T): T[] {
  return array.filter((y) => x !== y);
}

export function arrayWith<T>(array: T[], x: T): T[] {
  return array.includes(x) ? array : [...array, x];
}

export function objectWithoutKey<T>(obj: Record<string, T>, keyToRemove: string): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== keyToRemove));
}

export function arrayDifference<T>(A: readonly T[], B: readonly T[]): T[] {
  return A.filter((a) => !B.includes(a));
}

export function filterInPlace<T>(array: T[], predicate: (t: T) => boolean) {
  let i = array.length;
  while (i--) {
    if (!predicate(array[i])) {
      array.splice(i, 1);
    }
  }
}

export function groupArrayBy<T, K>(array: readonly T[], mappingFn: (t: T) => K) {
  const groups = new Map<K, T[]>();
  array.forEach((t) => {
    const k = mappingFn(t);
    if (!groups.has(k)) {
      groups.set(k, [t]);
    } else {
      groups.get(k)!.push(t);
    }
  });
  return groups;
}

/**
 * Retries a few times, with exponentioal backoff.
 */
export async function tryMultipleTimes<T>(asyncFn: () => Promise<T>, _attemptsSoFar = 0) {
  const MAX_ATTEMPTS = 3;

  try {
    return await asyncFn();
  } catch (error) {
    if (_attemptsSoFar >= MAX_ATTEMPTS) {
      throw error;
    }
    await sleep(500 * 2 ** _attemptsSoFar);
    return await tryMultipleTimes(asyncFn, _attemptsSoFar + 1);
  }
}

export function debouncify<Args extends any[]>({ ms }: { ms: number }, callback: (...args: Args) => any) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), ms);
  };
}
