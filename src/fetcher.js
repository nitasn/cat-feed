// @ts-check

import { useQuery } from "@tanstack/react-query";
import { dateToShortString, sleep } from "./utils";
import { useAtom } from "jotai";
import { weekDisplayed } from "./state";

import dummyData from "./dummy-data";
import { useMemo } from "react";

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

  return { weekPending: isPending, weekError: error, weekData: data };
}
