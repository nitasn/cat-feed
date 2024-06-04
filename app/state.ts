import { atom, getDefaultStore } from "jotai";
import { createContext } from "react";
import type { Name } from "./types";

///////////////////////////////////////////////////////////////////////////////

export const nameAtom = atom<Name>("nobody");

export const store = getDefaultStore();

///////////////////////////////////////////////////////////////////////////////

export type WeekDisplayed = { weekKey: string; dateWeekStarts: Date };

// @ts-ignore an object is provided by <WeekSlideAnimator /> to its children
export const WeekDisplayedContext = createContext<WeekDisplayed>(null);
