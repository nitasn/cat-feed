import { produce } from "immer";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { getAtom, nameAtom } from "./state";
import type { Change, CompactChange, ManyWeeksData } from "./types";
import { dateToShortString } from "./utils";

function debouncify<Args extends any[]>({ ms }: { ms: number }, callback: (...args: Args) => any) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), ms);
  };
}

import { BalancedExample as dummyData } from "./dummy-data"; // TODO REMOVE
const cacheAtom = atom<ManyWeeksData>(dummyData);

const weekKeysLoading = new Set<string>();
const weekKeysErrors = new Map<string, Error>();

export function useWeekData(dateWeekStarts: Date) {
  const cache = useAtomValue(cacheAtom);
  const weekKey = dateToShortString(dateWeekStarts);
  // TODO maybe fire up request
  return {
    weekLoading: weekKeysLoading.has(weekKey),
    weekError: weekKeysErrors.get(weekKey),
    weekData: cache[weekKey],
  };
}

const stagingChanges: Change[] = [];

const debouncedSendChanges = debouncify({ ms: 300 }, () => {
  const changes = stagingChanges.slice();
  stagingChanges.length = 0; // clear it
  // TODO
});

export const toggleMyself = ({ dateWeekStarts, dayName, mealName }: CompactChange) => {
  const name = getAtom(nameAtom);

  // todo: what if i'm already pending?

  const newCache = produce(getAtom(cacheAtom), (cache) => {
    const mealData = cache[dateToShortString(dateWeekStarts)][dayName][mealName];
    const becoming = mealData.positive.includes(name) ? "negative" : "positive";
    mealData.pendingBecoming = becoming;
    stagingChanges.push({ dateWeekStarts, dayName, mealName, person: name, becoming });
  });

  getDefaultStore().set(cacheAtom, newCache);

  debouncedSendChanges();
};
