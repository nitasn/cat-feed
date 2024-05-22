// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, sleep } from "./utils";
import { useAtom } from "jotai";
import { weekDisplayedAtom } from "./state";
import { useMemo } from "react";
import { randomWeeklyData } from "./gen-data";

// import allData from "./dummy-data";
const allData = {
  "May 5, 2024": randomWeeklyData(),
  "May 12, 2024": randomWeeklyData(),
  "May 19, 2024": randomWeeklyData(),
  "May 26, 2024": randomWeeklyData(),
};

export default function useWeekData() {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);

  const stringWeekStarts = useMemo(() => {
    return dateToShortString(dateWeekStarts);
  }, [dateWeekStarts]);

  const { isPending, error, data } = useQuery({
    queryKey: ["firstDayOfWeek", stringWeekStarts],
    queryFn: async () => {
      await sleep(500);
      const result = allData[stringWeekStarts];
      if (!result) throw Error("Simulating a Network Error");
      return result;
    },
  });

  return { weekLoading: isPending, weekError: error, weekData: data };
}

/**
 * @param {Date} dateWeekStarts
 * @param {string} dayName
 * @param {"morning" | "evening"} meal
 */
export function addMyself(dateWeekStarts, dayName, meal) {
  const { positive, negative } = allData[dateToShortString(dateWeekStarts)][dayName][meal];
  console.log("positive:", positive);
  console.log("negative:", negative);
}
