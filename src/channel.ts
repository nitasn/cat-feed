import { produce } from "immer";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { nameAtom } from "./state";
import { days, meals, type Change, type ChangePath, type ManyWeeksData, type WeekData } from "./types";
import { arrayWith, arrayWithout, dateToShortString, objectWithoutKey, sleep } from "./utils";

const store = getDefaultStore();

function debouncify<Args extends any[]>({ ms }: { ms: number }, callback: (...args: Args) => any) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), ms);
  };
}

import { BalancedExample as dummyData } from "./dummy-data"; // TODO REMOVE
import { fetchWeek } from "./server-mock";
import { getProperty } from "dot-prop";
const cacheAtom = atom<ManyWeeksData>(dummyData);

const weekKeysLoadingAtom = atom<string[]>([]);
const weekKeysErrorsAtom = atom<Record<string, Error>>({});

export function useWeekData(dateWeekStarts: Date) {
  const cache = useAtomValue(cacheAtom);
  const weekKey = dateToShortString(dateWeekStarts);
  const weekKeysErrors = useAtomValue(weekKeysErrorsAtom);
  const weekKeysLoading = useAtomValue(weekKeysLoadingAtom);

  if (!cache[weekKey]) {
    makeSureWeRequest(weekKey);
  }

  return {
    weekLoading: weekKeysLoading.includes(weekKey),
    weekError: weekKeysErrors[weekKey],
    weekData: cache[weekKey],
  };
}

/**
 * Retries a few times, with exponentioal backoff.
 */
async function tryMultipleTimes<Res, Err>(asyncFn: () => Promise<Res | Err>, _attemptsSoFar = 0) {
  const MAX_ATTEMPTS = 3;

  try {
    return await asyncFn();
  } catch (error) {
    if (_attemptsSoFar >= MAX_ATTEMPTS) return error as Err;
    await sleep(500 * 2 ** _attemptsSoFar);
    return await tryMultipleTimes(asyncFn, _attemptsSoFar + 1);
  }
}

function mergeReceivedWeekWithPendingChanges(weekKey: string, receivedWeek: WeekData) {
  store.set(cacheAtom, (cache) => ({
    ...cache,
    [weekKey]: produce(receivedWeek, (recvWeek) => {
      for (const day of days) {
        for (const meal of meals) {
          recvWeek[day][meal].pendingChangingTo = cache[weekKey][day][meal].pendingChangingTo;
        }
      }
    }),
  }));
}

async function makeSureWeRequest(weekKey: string) {
  if (store.get(weekKeysLoadingAtom).includes(weekKey)) {
    return; // don't fire another request if one with the same key is pending (avoiding race conditions)
  }

  store.set(weekKeysLoadingAtom, (weekKeysLoading) => arrayWith(weekKeysLoading, weekKey));
  store.set(weekKeysErrorsAtom, (weekKeysErrors) => objectWithoutKey(weekKeysErrors, weekKey));

  try {
    const receivedWeek = await tryMultipleTimes(() => fetchWeek(weekKey));
    mergeReceivedWeekWithPendingChanges(weekKey, receivedWeek);
  } catch (error) {
    store.set(weekKeysErrorsAtom, (weekKeysErrors) => ({ ...weekKeysErrors, [weekKey]: error as Error }));
  } finally {
    store.set(weekKeysLoadingAtom, (weekKeysLoading) => arrayWithout(weekKeysLoading, weekKey));
  }
}

const stagingChanges: Change[] = [];

const debouncedSendChanges = debouncify({ ms: 300 }, () => {
  const changes = stagingChanges.slice();
  stagingChanges.length = 0; // clear it
  // TODO
});

export const toggleMyself = (mealPath: ChangePath) => {
  const name = store.get(nameAtom);

  // todo: what if i'm already pending?

  const newCache = produce(store.get(cacheAtom), (cache) => {
    const mealData = getProperty(cache, mealPath)!;
    const changeTo = mealData.positive.includes(name) ? "negative" : "positive";
    mealData.pendingChangingTo = changeTo;
    stagingChanges.push({ name, mealPath, changeTo });
  });

  store.set(cacheAtom, newCache);

  debouncedSendChanges();
};
