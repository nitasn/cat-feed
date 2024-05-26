import { getProperty } from "dot-prop";
import { BalancedExample as dummyData } from "./dummy-data";
import { emptyWeeklyData } from "./gen-data";
import { opposite, type MealPath, type Name, type PosNeg, type WeekData } from "./types";
import { removeIfExists, sleep } from "./utils";
import { produce } from "immer";

// let allWeeks: Record<string, WeekData> = dummyData;

// export async function fetchWeek(keyStartWeek: string): Promise<WeekData> {
//   await sleep(500);
//   return allWeeks[keyStartWeek] ?? emptyWeeklyData();
// }

// export async function postChanges(changes: Change[]): Promise<void> {
//   await sleep(500);

//   allWeeks = produce(allWeeks, (allWeeks) => {
//     for (const { mealPath, changeTo, name } of changes) {
//       let mealData = getProperty(allWeeks, mealPath);
//       if (!mealData) {
//         const weekKey = mealPath.slice(0, mealPath.indexOf("."));
//         allWeeks[weekKey] = emptyWeeklyData();
//         mealData = getProperty(allWeeks, mealPath)!;
//       }
//       removeIfExists(mealData[opposite(changeTo)], name);
//       if (!mealData[changeTo].includes(name)) mealData[changeTo].unshift(name);
//       // console.log("server state was set:", mealPath, "=", mealData);
//     }
//   });
// }

const SERVER_URL = "http://localhost:3000";

async function fetchGET(path: string) {
  const res = await fetch(SERVER_URL + path);
  return await res.json();
}

async function fetchPOST(path: string, body: Object) {
  const res = await fetch(SERVER_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function fetchWeek(weekKey: string): Promise<WeekData> {
  const weekData = await fetchGET(`/api/get-week/?dateWeekStarts=${weekKey}`);
  if (weekData.error) throw Error(weekData.error);
  return weekData === "EMPTY WEEK" ? emptyWeeklyData() : (weekData as WeekData);
}

export interface Change {
  mealPath: MealPath;
  changeTo: PosNeg;
  name: Name;
}

export interface SuccessResponse {
  weekKey: string, 
  path: "WEEK ITSELF" | MealPath,
  success: true,
}

export interface FailureResponse {
  weekKey: string, 
  path: "WEEK ITSELF" | MealPath,
  success: false,
  error: string;
}

export async function postChanges(changes: Change[]) {
  // throw new Error("hello");
  const results = await fetchPOST("/api/post-changes", { changes });
  return results as Array<SuccessResponse | FailureResponse>;
}
