import { GlobalState } from "./global-state";
import { getFirstDayOfWeek } from "./utils";

export const weekDisplayed = new GlobalState(getFirstDayOfWeek());
