// @ts-check

import { dateFirstDayOfWeek } from "./utils";
import { atom } from "jotai";

export const weekDisplayedAtom = atom(dateFirstDayOfWeek());

export const myName = atom(/** @type {Name} */ ("nitsan"));
