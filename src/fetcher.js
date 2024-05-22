// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, removeFromArray, sleep } from "./utils";
import { useAtom, atom, getDefaultStore } from "jotai";
import { nameAtom, weekDisplayedAtom, getAtom } from "./state";
import queryClient from "./query-client";

import dummyData from "./dummy-data";

// todo: don't need allDataAtom, can use queryClient.getQueryData
const allDataAtom = atom(/** @type {ManyWeeksData} */ ({}));

getDefaultStore().set(allDataAtom, dummyData);

async function queryFn({ queryKey: [_, keyStartWeek] }) {
  console.log("querying", keyStartWeek);

  await sleep(500);
  const result = getAtom(allDataAtom)[keyStartWeek];
  if (!result) throw Error("Simulating a Network Error");
  return result;
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

  const weekClone = JSON.parse(JSON.stringify(getAtom(allDataAtom)[keyStartWeek]));
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

  getDefaultStore().set(allDataAtom, { ...getAtom(allDataAtom), [keyStartWeek]: weekClone });
  queryClient.invalidateQueries({ queryKey: ["weeklyData", keyStartWeek] });
}
