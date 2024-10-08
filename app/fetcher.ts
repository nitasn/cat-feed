import { useQuery } from "@tanstack/react-query";
import { produce } from "immer";
import { errorHaptics } from "./haptics";
import queryClient from "./query-client";
import { Change, FailureResponse, fetchWeek, postChanges } from "./server-bridge";
import { nameAtom, store } from "./state";
import {
  DayName,
  MealData,
  MealName,
  MealPath,
  PosNeg,
  WeekData,
  days,
  meals,
  opposite,
  positiveNegative,
} from "./types";
import {
  debouncify,
  filterInPlace,
  groupArrayBy,
  pushIfNotExists,
  removeIfExists,
  tryMultipleTimes,
} from "./utils";

// todo: instead of adding a `wasFired` field, use a weakMap
const changes: Array<Change & { wasFired?: boolean }> = [];

function mergeFetchedWeekWithPendingState(weekKey: string, fetchedWeek: WeekData) {
  const myName = store.get(nameAtom);
  const existingWeek: WeekData | undefined = queryClient.getQueryData(["weekData", weekKey]);

  if (!existingWeek) {
    return fetchedWeek;
  }

  // 1. preserve the `pendingChange?` fields.
  // 2. ignore values that involve me if any change i sent is in air.

  return produce(existingWeek, (existingWeek) => {
    days.forEach((dayName) => {
      meals.forEach((mealName) => {
        positiveNegative.forEach((posNeg: PosNeg) => {
          const incomingNames = fetchedWeek[dayName][mealName][posNeg];
          const existingNames = existingWeek[dayName][mealName][posNeg];
          const myPresence = existingNames.includes(myName);
          existingNames.length = 0;
          incomingNames.forEach((name) => {
            if (name !== myName || myPresence || changes.length === 0) {
              existingNames.push(name);
            }
          });
        });
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
    refetchInterval: __DEV__ ? false : 10_000,
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

  function updateCache(forEachChange: (mealData: MealData, change: Change) => void) {
    newChangesByWeek.forEach((weeklyNewChanges, weekKey) => {
      queryClient.setQueryData(["weekData", weekKey], (weekData: WeekData) => {
        return produce(weekData, (weekData) => {
          for (const change of weeklyNewChanges) {
            const [_, dayName, mealName] = change.mealPath.split(".");
            const mealData = weekData[dayName as DayName][mealName as MealName];
            forEachChange(mealData, change);
          }
        });
      });
    });
  }

  try {
    const results = await tryMultipleTimes(() => postChanges(changesToSend));

    // server has reponded and (hopefully) ack'd our changes.

    const failures = results.filter(({ success }) => !success) as FailureResponse[];

    if (failures.length) {
      // todo better handler
      alert(`Change(s) rejected by the server 😕 \n${failures[0].error}`);
      errorHaptics();
    }

    updateCache((mealData, { changeTo, name, mealPath }) => {
      if (results.find(({ path }) => path === mealPath)?.success) {
        removeIfExists(mealData[opposite(changeTo)], name);
        pushIfNotExists(mealData[changeTo], name);
      }
      delete mealData.pendingChange;
    });
  }
  catch (error) {
    updateCache((mealData) => delete mealData.pendingChange);

    // todo better handler
    alert(`Couldn't send data to server 😕 \n${(error as Error).message}`);
    errorHaptics();
  }

  filterInPlace(changes, (change) => !changesToSend.includes(change));
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
