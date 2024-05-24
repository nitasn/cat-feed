import { Atom, atom, getDefaultStore } from "jotai";
import { dateFirstDayOfWeek, dateToShortString } from "./utils";

import type { Name } from "./types";

export const weekDisplayedDateAtom = atom(dateFirstDayOfWeek());

export const weekKeyAtom = atom((get) => dateToShortString(get(weekDisplayedDateAtom)));

export const nameAtom = atom<Name>("nobody");

///////////////////////////////////////////////////////////////////////////////

const store = getDefaultStore();

export function getAtom<T>(atom: Atom<T>): T {
  return store.get(atom);
}
