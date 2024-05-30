import JWT from "expo-jwt";
import { SupportedAlgorithms } from "expo-jwt/dist/types/algorithms";
import { emptyWeeklyData } from "./gen-data";
import { type MealPath, type Name, type PosNeg, type WeekData } from "./types";

const baseurl = __DEV__ ? "http://localhost:3000" : (process.env.EXPO_PUBLIC_SERVER_URL as string);

function authorizationHeader() {
  const payload = { iat: Math.floor(Date.now() / 1000) };
  const secret = process.env.EXPO_PUBLIC_JWT_SECRET as string;
  const token = JWT.encode(payload, secret, { algorithm: SupportedAlgorithms.HS512 });
  return { Authorization: `Bearer ${token}` };
}

async function fetchGET(path: string) {
  const res = await fetch(baseurl + path, { headers: authorizationHeader() });
  return await _continueWithJson(res);
}

async function fetchPOST(path: string, body: Object) {
  const res = await fetch(baseurl + path, {
    method: "POST",
    headers: { ...authorizationHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await _continueWithJson(res);
}

async function _continueWithJson(res: Response) {
  const data = await res.json();

  if (res.status >= 400) {
    throw Error(data.error ? `Error message: ${data.error}` : `HTTP status: ${res.status}`);
  }

  return data;
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
