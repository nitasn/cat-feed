import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import queryClient from "./query-client";
import { Change, fetchWeek, postChanges } from "./server-mock";
import { nameAtom } from "./state";
import { DayName, MealName, MealPath, PosNeg, WeekData, opposite } from "./types";
import { debouncify, groupArrayBy, removeIfExists, sleep, tryMultipleTimes } from "./utils";

const store = getDefaultStore();

const changesAtom = atom([] as (Change & { isInAir: boolean })[]);

export function usePendingChange(mealPath: MealPath): PosNeg | undefined {
  const changes = useAtomValue(changesAtom);
  return changes.find((change) => change.mealPath === mealPath)?.changeTo;
}

export function useWeekData(weekKey: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["weekData", weekKey],
    queryFn: () => fetchWeek(weekKey),
    // refetchInterval: 5000,
  });

  return { weekLoading: isLoading, weekError: error, weekData: data };
}

const debouncedSendChanges = debouncify({ ms: 300 }, async () => {
  // changes that weren't sent yet (as opposed to changes awaiting server acknoledgement)
  const changesToSend = store.get(changesAtom).filter((change) => !change.isInAir);

  changesToSend.forEach((change) => {
    change.isInAir = true;
  });

  try {
    await tryMultipleTimes(() => postChanges(changesToSend));
  } catch (error) {
    // todo better handler
    return alert(`Error :/ \n coudn't post to server`);
  }

  // the server has acknoledged the changes we sent!

  // apply the changes to our copy of the data as an "optimistic" update.
  // (more like realistic update, because the server has acknoledged our post)
  const newChangesByWeek = groupArrayBy(store.get(changesAtom), (change) =>
    extractWeekKey(change.mealPath)
  );

  newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
    queryClient.setQueryData(["weekData", weekKey], (weekData: WeekData) => {
      return produce(weekData, (weekData) => {
        for (const { mealPath, changeTo, name } of weeklyNewChanges) {
          const [_, dayName, mealName] = mealPath.split(".");
          const mealData = weekData[dayName as DayName][mealName as MealName];
          removeIfExists(mealData[opposite(changeTo)], name);
          mealData[changeTo].unshift(name);
        }
      });
    });
  });

  // delete ack'd changes from the changes array
  store.set(changesAtom, (changes) => {
    return changes.filter((change) => !changesToSend.includes(change));
  });

  await sleep(10_000);

  // needed? we fetch every 5s anyway...
  queryClient.invalidateQueries({ queryKey: ["weekData"] });
});

function extractWeekKey(mealPath: MealPath) {
  return mealPath.slice(0, mealPath.indexOf("."));
}

export const toggleMyself = (mealPath: MealPath) => {
  const name = store.get(nameAtom);

  if (store.get(changesAtom).find((change) => change.mealPath === mealPath)) {
    return; // if already pending, ignore the tap, to avoid race conditions
  }

  const [weekKey, dayName, mealName] = mealPath.split(".");
  const weekData = queryClient.getQueryData(["weekData", weekKey]) as WeekData;
  const mealData = weekData[dayName as DayName][mealName as MealName];
  const changeTo = mealData.positive.includes(name) ? "negative" : "positive";

  store.set(changesAtom, (changes) => [...changes, { mealPath, changeTo, name, isInAir: false }]);

  debouncedSendChanges();
};
