// @ts-check

import { useQuery } from "@tanstack/react-query";
import { sleep } from "./utils";
import { useGlobalState } from "./global-state";
import { weekDisplayed } from "./state";

import dummyData from "./dummy-data";

export default function useWeekData() {
  const [firstDayOfWeek] = useGlobalState(weekDisplayed);

  const { isPending, error, data } = useQuery({
    queryKey: ["firstDayOfWeek", firstDayOfWeek],
    queryFn: async () => {
      await sleep(500);
      const result = dummyData[firstDayOfWeek];
      if (!result) throw Error("Network Error");
      return result;
    },
  });

  return { weekPending: isPending, weekError: error, weekData: data };
}
