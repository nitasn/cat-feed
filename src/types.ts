export type Name = "nitsan" | "tal" | "ronnie" | "shahar" | "imma";

export interface MealData {
  positive: Name[];
  negative: Name[];
  pendingBecoming?: PosNeg; // internal state for optimistic updates
}

export type PosNeg = "positive" | "negative";

export type MealName = "morning" | "evening";

export interface DayData {
  morning: MealData;
  evening: MealData;
}

export interface WeekData {
  sunday: DayData;
  monday: DayData;
  tuesday: DayData;
  wednesday: DayData;
  thursday: DayData;
  friday: DayData;
  saturday: DayData;
}

export type DayName = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type ManyWeeksData = Record<string, WeekData>;

export interface ToggleProps {
  dateWeekStarts: Date;
  dayName: DayName;
  mealName: MealName;
}

export interface Change extends ToggleProps {
  person: Name; // todo change to personName: PersonName
  becoming: PosNeg;
}

//////////////////

export const names: Name[] = ["imma", "nitsan", "tal", "ronnie", "shahar"];

export const days: DayName[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
