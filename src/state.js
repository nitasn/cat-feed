import { createGlobalState } from "./global-state";
import { getFirstDayOfWeek } from "./utils";

export const weekDisplayed = createGlobalState(getFirstDayOfWeek());
