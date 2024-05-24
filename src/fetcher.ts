import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { getDefaultStore } from "jotai";
import queryClient from "./query-client";
import { Change, fetchWeek, postChanges } from "./server-mock";
import { nameAtom } from "./state";
import { DayName, MealName, MealPath, PosNeg, WeekData, days, meals, opposite } from "./types";
import { debouncify, groupArrayBy, removeFromArray, removeIfExists, tryMultipleTimes } from "./utils";

const store = getDefaultStore();

function mergeReceivedWeekWithPendingChanges(weekKey: string, receivedWeek: WeekData) {
  const existingWeekData: WeekData | undefined = queryClient.getQueryData(["weekData", weekKey]);

  if (!existingWeekData) {
    return receivedWeek;
  }

  return produce(existingWeekData, (weekData) => {
    for (const day of days) {
      for (const meal of meals) {
        weekData[day][meal].pendingChangingTo = receivedWeek[day][meal].pendingChangingTo;
      }
    }
  });
}

export function useWeekData(weekKey: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["weekData", weekKey],
    queryFn: async () => {
      const recievedWeek = await fetchWeek(weekKey);
      return mergeReceivedWeekWithPendingChanges(weekKey, recievedWeek);
    },
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
    console.log("sending change:", change.mealPath, "->", change.changeTo);
  });

  try {
    await tryMultipleTimes(() => postChanges(newChanges));
  } catch (error) {
    return alert(`Error :/ \n coudn't post to server`); // todo better handler
  }

  newChanges.forEach((change) => {
    removeFromArray(changes, change);
  });

  // after successfully posting changes to the server,
  // we apply the changes to our copy of the data.

  const newChangesByWeek = groupArrayBy(changes, (change) => extractWeekKey(change.mealPath));

  newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
    queryClient.setQueryData(["weekData", weekKey], (existingWeekData: WeekData) => {
      return produce(existingWeekData, (weekData) => {
        for (const { mealPath, changeTo, name } of weeklyNewChanges) {
          const [_, dayName, mealName] = mealPath.split(".");
          const mealData = weekData[dayName as DayName][mealName as MealName];
          removeIfExists(mealData[opposite(changeTo)], name);
          mealData[changeTo].push(name);
          mealData.pendingChangingTo = undefined;
        }
      });
    });
  });

  queryClient.invalidateQueries({ queryKey: ["weekData"] });
});

function extractWeekKey(mealPath: MealPath) {
  return mealPath.slice(mealPath.indexOf("."));
}

export const toggleMyself = (mealPath: MealPath) => {
  const name = store.get(nameAtom);

  if (changes.find((change) => change.mealPath === mealName)) {
    // if already pending, ignore, to avoid race conditions
  }

  const [weekKey, dayName, mealName] = mealPath.split(".");

  let changeTo: PosNeg;
  queryClient.setQueryData(["weekData", weekKey], (existingWeekData: WeekData) => {
    return produce(existingWeekData, (weekData) => {
      const mealData = weekData[dayName as DayName][mealName as MealName];
      changeTo = mealData.positive.includes(name) ? "negative" : "positive";
      mealData.pendingChangingTo = changeTo;
    });
  });

  changes.push({ mealPath, changeTo: changeTo!, name, isInAir: false });

  debouncedSendChanges();
};
