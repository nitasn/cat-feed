export const names = ["imma", "nitsan", "tal", "ronnie", "shahar"] as const;

export const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export type Name = (typeof names)[number];

export type DayName = (typeof days)[number];

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

export type ManyWeeksData = Record<string, WeekData>;

export interface CompactChange {
  dateWeekStarts: Date;
  dayName: DayName;
  mealName: MealName;
}

export interface Change extends CompactChange {
  person: Name; // todo change to personName: PersonName
  becoming: PosNeg;
}

//////////////////
