import JWT from "expo-jwt";
import { SupportedAlgorithms } from "expo-jwt/dist/types/algorithms";
import { emptyWeeklyData } from "./gen-data";
import { type MealPath, type Name, type PosNeg, type WeekData } from "./types";

const SERVER_URL = "http://192.168.1.120:3000";
// const SERVER_URL = "https://cat-feed-server.vercel.app";

function authorizationHeader() {
  const payload = { iat: Date.now() };
  const secret = process.env.EXPO_PUBLIC_JWT_SECRET as string;
  const token = JWT.encode(payload, secret, { algorithm: SupportedAlgorithms.HS512 });
  return { Authorization: `Bearer ${token}` };
}

async function fetchGET(path: string) {
  const res = await fetch(SERVER_URL + path, { headers: authorizationHeader() });
  return await res.json();
}

async function fetchPOST(path: string, body: Object) {
  const res = await fetch(SERVER_URL + path, {
    method: "POST",
    headers: { ...authorizationHeader(), "Content-Type": "application/json" },
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
