import { format, parse, startOfWeek } from "date-fns";

export function dateFirstDayOfWeek(inputDate: Date = new Date()): Date {
  return startOfWeek(inputDate, { weekStartsOn: 0 });
}

export function dateToShortString(date: Date): string {
  return format(date, "MMMM d, yyyy");
}

export function shortStringToDate(str: string): Date {
  return parse(str, "MMMM d, yyyy", new Date());
}

export function advanceDateByDays(date: Date | number | string, numDaysLater: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + numDaysLater);
  return result;
}

export function relativeWeek(dateInput: Date): string {
  const startOfThisWeek = dateFirstDayOfWeek();
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

export function removeIfExists<T>(array: T[], x: T): void {
  const idx = array.indexOf(x);
  if (idx !== -1) array.splice(idx, 1);
}

export function arrayWithout<T>(array: readonly T[], x: T): T[] {
  return array.filter((y) => x !== y);
}

export function arrayDifference<T>(A: readonly T[], B: readonly T[]): T[] {
  return A.filter((a) => !B.includes(a));
}
