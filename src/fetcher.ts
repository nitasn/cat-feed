import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { getDefaultStore } from "jotai";
import queryClient from "./query-client";
import { Change, fetchWeek, postChanges } from "./server-mock";
import { nameAtom } from "./state";
import { DayName, MealName, MealPath, WeekData, days, meals, opposite } from "./types";
import { debouncify, filterInPlace, groupArrayBy, removeIfExists, tryMultipleTimes } from "./utils";

/*
 * TODO:
 * state can flicker when server overrides our changes;
 * easier to repro if invalidating cache after sending (and sending multiple requests)
 */

const store = getDefaultStore();

const changes: Array<Change & { wasFired?: boolean }> = [];

/**
 * preserve the pendingChange? fields.
 */
function mergeFetchedWeekWithPendingState(weekKey: string, fetchedWeek: WeekData) {
  const existingWeek: WeekData | undefined = queryClient.getQueryData(["weekData", weekKey]);

  if (!existingWeek) {
    return fetchedWeek;
  }

  return produce(existingWeek, (existingWeek) => {
    days.forEach((dayName) => {
      meals.forEach((mealName) => {
        existingWeek[dayName][mealName] = fetchedWeek[dayName][mealName];
      });
    });
  });
}

export function useWeekData(weekKey: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["weekData", weekKey],
    queryFn: async () => {
      const fetchedWeek = await fetchWeek(weekKey);
      return mergeFetchedWeekWithPendingState(weekKey, fetchedWeek);
    },
    refetchInterval: 5000,
  });

  return { weekLoading: isLoading, weekError: error, weekData: data };
}

const debouncedSendChanges = debouncify({ ms: 300 }, async () => {
  // changes that weren't sent yet (as opposed to changes awaiting server acknoledgement)
  const changesToSend = changes.filter((change) => !change.wasFired);

  changesToSend.forEach((change) => {
    change.wasFired = true;
  });

  const newChangesByWeek = groupArrayBy(changes, (change) => extractWeekKey(change.mealPath));

  try {
    await tryMultipleTimes(() => postChanges(changesToSend));
  } catch (error) {
    // if server didn't ack, we remove the pending

    newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
      queryClient.setQueryData(["weekData", weekKey], (weekData: WeekData) => {
        return produce(weekData, (weekData) => {
          for (const { mealPath } of weeklyNewChanges) {
            const [_, dayName, mealName] = mealPath.split(".");
            delete weekData[dayName as DayName][mealName as MealName].pendingChange;
          }
        });
      });
    });

    filterInPlace(changes, (change) => !changesToSend.includes(change));

    // todo better handler
    return alert(`Error :/ \n couldn't post to server \n ${error}`);
  }

  // the server has acknoledged the changes we sent!

  // apply the changes to our copy of the data as an "optimistic" update.
  // (more like realistic update, because the server has acknoledged our post)
  newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
    queryClient.setQueryData(["weekData", weekKey], (weekData: WeekData) => {
      return produce(weekData, (weekData) => {
        for (const { mealPath, changeTo, name } of weeklyNewChanges) {
          const [_, dayName, mealName] = mealPath.split(".");
          const mealData = weekData[dayName as DayName][mealName as MealName];
          removeIfExists(mealData[opposite(changeTo)], name);
          if (!mealData[changeTo].includes(name)) mealData[changeTo].unshift(name);
          delete mealData.pendingChange;
        }
      });
    });
  });

  // delete ack'd changes from the changes array
  filterInPlace(changes, (change) => !changesToSend.includes(change));

  // queryClient.invalidateQueries({ queryKey: ["weekData"] });
});

function extractWeekKey(mealPath: MealPath) {
  return mealPath.slice(0, mealPath.indexOf("."));
}

export const toggleMyself = (mealPath: MealPath) => {
  const name = store.get(nameAtom);

  if (changes.find((change) => change.mealPath === mealPath)) {
    return; // if already pending, ignore the tap, to avoid race conditions
  }

  const [weekKey, dayName, mealName] = mealPath.split(".");
  const weekData = queryClient.getQueryData(["weekData", weekKey]) as WeekData;
  const mealData = weekData[dayName as DayName][mealName as MealName];
  const changeTo = mealData.positive.includes(name) ? "negative" : "positive";

  changes.push({ mealPath, changeTo, name });

  queryClient.setQueryData(["weekData", weekKey], (weekData: WeekData) => {
    return produce(weekData, (weekData) => {
      const [_, dayName, mealName] = mealPath.split(".");
      const mealData = weekData[dayName as DayName][mealName as MealName];
      mealData.pendingChange = changeTo;
    });
  });

  debouncedSendChanges();
};
