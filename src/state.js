// @ts-check

import { getFirstDayOfWeek } from "./utils";
import { atom } from "jotai";

export const weekDisplayed = atom(getFirstDayOfWeek());
