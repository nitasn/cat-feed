import { BalancedExample as dummyData } from "./dummy-data";
import { emptyWeeklyData } from "./gen-data";
import { dateToShortString, removeIfExists, sleep } from "./utils";

import type { Change, WeekData } from "./types";
import { getProperty } from "dot-prop";

let allWeeks: Record<string, WeekData> = dummyData;

export async function fetchWeek(keyStartWeek: string): Promise<WeekData> {
  await sleep(500);
  return allWeeks[keyStartWeek] ?? emptyWeeklyData();
}

export async function updateAndFetch(keyStartWeek: string, newWeeklyData: WeekData): Promise<WeekData> {
  await sleep(1000);

  // clone for referential equality
  allWeeks = { ...allWeeks, [keyStartWeek]: { ...newWeeklyData } };

  return allWeeks[keyStartWeek];
}

export async function postChanges(changes: Change[]): Promise<void> {
  await sleep(1000);

  // deep clone for referential equality
  allWeeks = JSON.parse(JSON.stringify(allWeeks));

  for (const change of changes) {
    const mealData = getProperty(allWeeks, change.mealPath)!;
    if (change.changeTo === "positive") {
      removeIfExists(mealData.positive, change.name);
    }
    // TODO continue
  }
}
