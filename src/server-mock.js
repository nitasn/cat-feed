// @ts-check

import dummyData from "./dummy-data";
import { sleep } from "./utils";
import { emptyWeeklyData } from "./gen-data";

let allWeeks = dummyData;

/**
 * @param {string} keyStartWeek
 * @returns {Promise<WeeklyData>}
 */
export async function fetchWeek(keyStartWeek) {
  await sleep(500);
  return allWeeks[keyStartWeek] ?? emptyWeeklyData();
}

/**
 * @param {string} keyStartWeek
 * @param {WeeklyData} newWeeklyData
 * @returns {Promise<WeeklyData>}
 */
export async function updateAndFetch(keyStartWeek, newWeeklyData) {
  await sleep(1000);

  // deep clone for referential equality
  allWeeks = JSON.parse(JSON.stringify(allWeeks));

  // eliminate potential bugs (it's a test anyway)
  allWeeks[keyStartWeek] = JSON.parse(JSON.stringify(newWeeklyData));

  return allWeeks[keyStartWeek];
}
