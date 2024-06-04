import { atom, getDefaultStore } from "jotai";
import { dateFirstDayOfWeek, dateToShortString } from "./utils";
import type { Name } from "./types";
import { createContext } from "react";

///////////////////////////////////////////////////////////////////////////////

// To be used by components OTHEN THAN <WeekTable> (e.g. by the `<-- This Week -->` header),
// as we'll create multiple <WeekTable> instances and slide between them with animation

export const weekDisplayedDateAtom = atom(dateFirstDayOfWeek());

export const weekKeyAtom = atom((get) => dateToShortString(get(weekDisplayedDateAtom)));

///////////////////////////////////////////////////////////////////////////////

export const nameAtom = atom<Name>("nobody");

///////////////////////////////////////////////////////////////////////////////

export const store = getDefaultStore();

///////////////////////////////////////////////////////////////////////////////

export const WeekDisplayedContext = createContext({
  weekKey: store.get(weekKeyAtom),
  dateWeekStarts: store.get(weekDisplayedDateAtom),
});
