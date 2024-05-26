import { getProperty } from "dot-prop";
import { produce } from "immer";
import { BalancedExample as dummyData } from "./dummy-data";
import { emptyWeeklyData } from "./gen-data";
import { Change, FailureResponse, SuccessResponse } from "./server-bridge";
import { opposite, type WeekData } from "./types";
import { removeIfExists, sleep } from "./utils";

let allWeeks: Record<string, WeekData> = dummyData;

export async function fetchWeek(keyStartWeek: string): Promise<WeekData> {
  await sleep(500);
  return allWeeks[keyStartWeek] ?? emptyWeeklyData();
}

export async function postChanges(changes: Change[]): Promise<Array<SuccessResponse | FailureResponse>> {
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
    }
  });

  return changes.map((change) => ({
    path: change.mealPath,
    success: true,
  }));
}
