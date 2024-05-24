import { useQuery } from "@tanstack/react-query";
import { Change, fetchWeek, postChanges } from "./server-mock";
import { getDefaultStore } from "jotai";
import { DayName, ManyWeeksData, MealName, MealPath, Name, PosNeg, WeekData, opposite } from "./types";
import { filterInPlace, groupArrayBy, removeFromArray, removeIfExists, tryMultipleTimes } from "./utils";
import queryClient from "./query-client";
import { produce } from "immer";
import { getProperty } from "dot-prop";

const store = getDefaultStore();

function debouncify<Args extends any[]>({ ms }: { ms: number }, callback: (...args: Args) => any) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), ms);
  };
}

export function useWeekData(weekKey: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["weekData", weekKey],
    queryFn: () => fetchWeek(weekKey),
    refetchInterval: 5000,
  });

  return { weekLoading: isLoading, weekError: error, weekData: data };
}

type ExtChange = Change & { isInAir: boolean };

const changes: ExtChange[] = [];

const debouncedSendChanges = debouncify({ ms: 300 }, async () => {
  const newChanges = changes.filter((change) => !change.isInAir);

  newChanges.forEach((change) => {
    change.isInAir = true;
  });

  try {
    await tryMultipleTimes(() => postChanges(newChanges));
  } catch (error) {
    return alert(`Error :/ \n coudn't post to server`); // todo better handler
  }

  newChanges.forEach((change) => {
    removeFromArray(changes, change);
  });

  const newChangesByWeek = groupArrayBy(changes, (change) => extractWeekKey(change.mealPath));

  newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
    queryClient.setQueryData(["weekData", weekKey], (existingWeekData: WeekData) => {
      return produce(existingWeekData, (weekData) => {
        for (const { mealPath, changeTo, name } of weeklyNewChanges) {
          const [_, dayName, mealName] = mealPath.split(".");
          const mealData = weekData[dayName as DayName][mealName as MealName];
          removeIfExists(mealData[opposite(changeTo)], name);
          mealData[changeTo].push(name);
        }
      });
    });
  });

  queryClient.invalidateQueries({ queryKey: ["weekData"] });
});

function extractWeekKey(mealPath: MealPath) {
  return mealPath.slice(mealPath.indexOf("."));
}
