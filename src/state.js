// @ts-check

import { dateFirstDayOfWeek } from "./utils";
import Jotai, { atom, getDefaultStore } from "jotai";

export const weekDisplayedAtom = atom(dateFirstDayOfWeek());

export const nameAtom = atom(/** @type {Name} */ ("nitsan"));

///////////////////////////////////////////////////////////////////////////////

const store = getDefaultStore();

/**
 * @template T
 * @param {Jotai.Atom<T>} atom
 * @returns {T}
 */
export function getAtom(atom) {
  return store.get(atom);
}
