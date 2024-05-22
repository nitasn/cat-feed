// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, removeFromArray, sleep } from "./utils";
import { useAtom } from "jotai";
import { nameAtom, weekDisplayedAtom, getAtom } from "./state";
import { useMemo } from "react";
import queryClient from "./query-client";

import allData from "./dummy-data";

async function queryFn({ queryKey }) {
  const [_, keyStartWeek] = queryKey;
  console.log("querying", keyStartWeek);
  await sleep(500);
  const result = allData[keyStartWeek];
  if (!result) throw Error("Simulating a Network Error");
  return result;
}

export default function useWeekData() {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);

  const keyStartWeek = useMemo(() => {
    return dateToShortString(dateWeekStarts);
  }, [dateWeekStarts]);

  const { isPending, error, data } = useQuery({
    queryKey: ["weeklyData", keyStartWeek],
    queryFn,
  });

  return { weekLoading: isPending, weekError: error, weekData: data };
}

/**
 * @param {Date} dateWeekStarts
 * @param {string} dayName
 * @param {"morning" | "evening"} meal
 */
export function toggleMyself(dateWeekStarts, dayName, meal) {
  const keyStartWeek = dateToShortString(dateWeekStarts);

  /** @type {DailyData} */
  const dailyData = allData[keyStartWeek][dayName];
  const { positive, negative } = dailyData[meal];
  const name = getAtom(nameAtom);

  if (positive.includes(name)) {
    console.log("pos -> neg");
    removeFromArray(positive, name);
    negative.push(name);
  } else if (negative.includes(name)) {
    console.log("neg -> pos");
    removeFromArray(negative, name);
    positive.push(name);
  } else {
    console.log("neut -> pos");
    positive.push(name);
  }

  queryClient.invalidateQueries({ queryKey: ["weeklyData", keyStartWeek] });
}
