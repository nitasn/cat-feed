import { dateFirstDayOfWeek } from "./utils";
import { atom, getDefaultStore, Atom } from "jotai";

import type { Name } from "./types";

export const weekDisplayedAtom = atom(dateFirstDayOfWeek());

export const nameAtom = atom<Name>("nitsan");

///////////////////////////////////////////////////////////////////////////////

const store = getDefaultStore();

export function getAtom<T>(atom: Atom<T>): T {
  return store.get(atom);
}
