// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, sleep } from "./utils";
import { useAtom } from "jotai";
import { weekDisplayed } from "./state";
import { useMemo } from "react";
import { randomWeeklyData } from "./gen-data";

// import dummyData from "./dummy-data";
const dummyData = {
  "May 5, 2024": randomWeeklyData(),
  "May 12, 2024": randomWeeklyData(),
  "May 19, 2024": randomWeeklyData(),
  "May 26, 2024": randomWeeklyData(),
};

export default function useWeekData() {
  const [dateWeekStarts] = useAtom(weekDisplayed);

  const stringWeekStarts = useMemo(() => {
    return dateToShortString(dateWeekStarts);
  }, [dateWeekStarts]);

  const { isPending, error, data } = useQuery({
    queryKey: ["firstDayOfWeek", stringWeekStarts],
    queryFn: async () => {
      await sleep(500);
      const result = dummyData[stringWeekStarts];
      if (!result) throw Error("Network Error");
      return result;
    },
  });

  return { weekLoading: isPending, weekError: error, weekData: data };
}
