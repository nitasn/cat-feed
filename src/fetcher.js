// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, removeFromArray, sleep } from "./utils";
import { useAtom } from "jotai";
import { nameAtom, weekDisplayedAtom, getAtom } from "./state";
import queryClient from "./query-client";
import { emptyWeeklyData } from "./gen-data";

import dummyData from "./dummy-data";

Object.entries(dummyData).forEach(([keyStartWeek, weeklyData]) => {
  queryClient.setQueryData(["weeklyData", keyStartWeek], weeklyData);
});

async function queryFn({ queryKey: [_, keyStartWeek] }) {
  await sleep(500);
  const existingData = queryClient.getQueryData(["weeklyData", keyStartWeek]);
  return existingData ?? emptyWeeklyData();
  // if (!existingData) throw Error("Simulating a Network Error");
  // return existingData;
}

export default function useWeekData() {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);

  const keyStartWeek = dateToShortString(dateWeekStarts);

  const { isPending, error, data } = useQuery({ queryKey: ["weeklyData", keyStartWeek], queryFn });

  return { weekLoading: isPending, weekError: error, weekData: data };
}

/**
 * @param {Date} dateWeekStarts
 * @param {string} dayName
 * @param {"morning" | "evening"} meal
 */
export function toggleMyself(dateWeekStarts, dayName, meal) {
  const keyStartWeek = dateToShortString(dateWeekStarts);

  const weeklyData = queryClient.getQueryData(["weeklyData", keyStartWeek]);
  const weekClone = JSON.parse(JSON.stringify(weeklyData));

  /** @type {DailyData} */
  const dailyData = weekClone[dayName];
  const { positive, negative } = dailyData[meal];

  const name = getAtom(nameAtom);

  if (positive.includes(name)) {
    // console.log("pos -> neg");
    removeFromArray(positive, name);
    negative.unshift(name);
  } //
  else if (negative.includes(name)) {
    // console.log("neg -> pos");
    removeFromArray(negative, name);
    positive.unshift(name);
  } //
  else {
    // console.log("neut -> pos");
    positive.unshift(name);
  }

  // Optimistically update to the new value
  queryClient.setQueryData(["weeklyData", keyStartWeek], weekClone);

  queryClient.invalidateQueries({ queryKey: ["weeklyData", keyStartWeek] });
}
