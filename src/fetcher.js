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

  const weeklyData = queryClient.getQueryData(queryKey);
  const weekClone = JSON.parse(JSON.stringify(weeklyData));

  /** @type {MealData} */
  const dailyData = weekClone[dayName][meal];

  // positive -> negeative
  if (dailyData.positive.includes(name)) {
    removeFromArray(dailyData.positive, name);
    dailyData.negative.unshift(name);
  }
  // negeative -> positive
  else if (dailyData.negative.includes(name)) {
    removeFromArray(dailyData.negative, name);
    dailyData.positive.unshift(name);
  }
  // neutral -> positive
  else {
    dailyData.positive.unshift(name);
  }

  // Cancel any outgoing refetches, so they don't overwrite our optimistic update
  await queryClient.cancelQueries({ queryKey });

  dailyData.pending = [...(dailyData.pending ?? []), name];

  // Optimistically update to the new value
  queryClient.setQueryData(queryKey, weekClone);

  try {
    const serverWeekData = await updateAndFetch(keyStartWeek, weekClone);
    queryClient.setQueryData(queryKey, serverWeekData);
  } catch (e) {
    console.log("Error fetching weekly data from server:", e.message);
  } finally {
    // Always refetch after error or success?
    queryClient.invalidateQueries({ queryKey });
  }
}
