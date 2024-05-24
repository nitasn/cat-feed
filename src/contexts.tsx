import { createContext } from "react";
import { DayName } from "./types";

// @ts-ignore
export const WeekKeyContext = createContext<string>();

// @ts-ignore
export const DayNameContext = createContext<DayName>();
