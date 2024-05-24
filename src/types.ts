export const names = ["imma", "nitsan", "tal", "ronnie", "shahar"] as const;

export const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export const meals = ["morning", "evening"] as const;

export const positiveNegative = ["positive", "negative"] as const;

export type Name = (typeof names)[number];

export type DayName = (typeof days)[number];

export type MealName = (typeof meals)[number];

export interface MealData {
  positive: Name[];
  negative: Name[];
  pendingChange?: PosNeg;
}

export type PosNeg = (typeof positiveNegative)[number];

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

export type MealPath = `${string}.${DayName}.${MealName}`;

export function opposite(flag: PosNeg): PosNeg {
  return flag === "positive" ? "negative" : "positive";
}
