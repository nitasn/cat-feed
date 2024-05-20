// @ts-check

import { dateFirstDayOfWeek } from "./utils";
import { atom } from "jotai";

export const weekDisplayed = atom(dateFirstDayOfWeek());
