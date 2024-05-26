import { emptyWeeklyData } from "./gen-data";
import { type MealPath, type Name, type PosNeg, type WeekData } from "./types";

const SERVER_URL = "http://localhost:3000";

// const SERVER_URL = "https://cat-feed-server.vercel.app";

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
  path: MealPath;
  success: true;
}

export interface FailureResponse {
  path: MealPath;
  success: false;
  error: string;
}

export async function postChanges(changes: Change[]) {
  const results = await fetchPOST("/api/post-changes", { changes });
  return results as Array<SuccessResponse | FailureResponse>;
}
