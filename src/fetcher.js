// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, removeFromArray, sleep } from "./utils";
import { useAtom } from "jotai";
import { nameAtom, weekDisplayedAtom, getAtom } from "./state";
import queryClient from "./query-client";
import { fetchWeek, updateAndFetch } from "./server-mock";

// import dummyData from "./dummy-data";
// Object.entries(dummyData).forEach(([keyStartWeek, weeklyData]) => {
//   queryClient.setQueryData(["weeklyData", keyStartWeek], weeklyData);
// });

export default function useWeekData() {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);
  const keyStartWeek = dateToShortString(dateWeekStarts);

  const { isPending, error, data } = useQuery({
    queryKey: ["weeklyData", keyStartWeek],
    queryFn: () => fetchWeek(keyStartWeek),
  });

  return { weekLoading: isPending, weekError: error, weekData: data };
}

/**
 * @param {Date} dateWeekStarts
 * @param {string} dayName
 * @param {"morning" | "evening"} meal
 */
export async function toggleMyself(dateWeekStarts, dayName, meal) {
  const keyStartWeek = dateToShortString(dateWeekStarts);
  const queryKey = ["weeklyData", keyStartWeek];
  const name = getAtom(nameAtom);

  // todo: this function could be simplified with immer.js

  const cachedWeek = queryClient.getQueryData(queryKey);

  // @ts-ignore
  if (cachedWeek[dayName][meal].pending?.length) {
    return; // can't change while pending
  }

  // Cancel any outgoing refetches, so they don't overwrite our optimistic update
  await queryClient.cancelQueries({ queryKey });

  // for referential inequality of state
  const weekClone = JSON.parse(JSON.stringify(cachedWeek));

  /** @type {MealData} */
  const mealData = weekClone[dayName][meal];

  // to reconstruct state later
  const mealClone = JSON.parse(JSON.stringify(mealData));

  // Make it pending locally
  mealData.pending ??= [];
  if (!mealData.pending.includes(name)) {
    mealData.pending.push(name);
  }

  // "Optimistically update" to show pending state
  queryClient.setQueryData(queryKey, weekClone);

  // ------------------------------
  // | Prepare request for server |
  // ------------------------------

  // positive -> negeative
  if (mealClone.positive.includes(name)) {
    removeFromArray(mealClone.positive, name);
    mealClone.negative.unshift(name);
  }
  // negeative -> positive
  else if (mealClone.negative.includes(name)) {
    removeFromArray(mealClone.negative, name);
    mealClone.positive.unshift(name);
  }
  // neutral -> positive
  else {
    mealClone.positive.unshift(name);
  }

  const weekForServer = weekClone;
  weekForServer[dayName][meal] = mealClone;

  try {
    const weekFromServer = await updateAndFetch(keyStartWeek, weekForServer);
    queryClient.setQueryData(queryKey, weekFromServer);
  } catch (e) {
    console.log("Error fetching weekly data from server:", e.message);
    // todo some indication
  } finally {
    // Always refetch after error or success?
    queryClient.invalidateQueries({ queryKey });
  }
}
