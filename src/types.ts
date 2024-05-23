export const names = ["imma", "nitsan", "tal", "ronnie", "shahar"] as const;

export const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export const meals = ["morning", "evening"] as const;

export type Name = (typeof names)[number];

export type DayName = (typeof days)[number];

export type MealName = (typeof meals)[number];

export interface MealData {
  positive: Name[];
  negative: Name[];
  pendingChangingTo?: PosNeg; // internal state for optimistic updates
}

export type PosNeg = "positive" | "negative";

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

// export interface CompactChange {
//   dateWeekStarts: Date;
//   dayName: DayName;
//   mealName: MealName;
// }

export type ChangePath = `${string}.${DayName}.${MealName}`;

export interface Change {
  mealPath: ChangePath;
  changeTo: PosNeg;
  name: Name;
}

//////////////////
