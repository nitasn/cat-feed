import { getProperty } from "dot-prop";
import { BalancedExample as dummyData } from "./dummy-data";
import { emptyWeeklyData } from "./gen-data";
import { opposite, type MealPath, type Name, type PosNeg, type WeekData } from "./types";
import { removeIfExists, sleep } from "./utils";
import { produce } from "immer";

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

export interface Change {
  mealPath: MealPath;
  changeTo: PosNeg;
  name: Name;
}

export async function postChanges(changes: Change[]): Promise<void> {
  await sleep(500);

  allWeeks = produce(allWeeks, (allWeeks) => {
    for (const { mealPath, changeTo, name } of changes) {
      let mealData = getProperty(allWeeks, mealPath);
      if (!mealData) {
        const weekKey = mealPath.slice(0, mealPath.indexOf("."));
        allWeeks[weekKey] = emptyWeeklyData();
        mealData = getProperty(allWeeks, mealPath)!;
      }
      removeIfExists(mealData[opposite(changeTo)], name);
      if (!mealData[changeTo].includes(name)) mealData[changeTo].unshift(name);
      // console.log("server state was set:", mealPath, "=", mealData);
    }
  });
}
