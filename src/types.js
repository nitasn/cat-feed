/**
 * @typedef {"nitsan" | "tal" | "ronnie" | "shahar" | "imma"} Name
 */

/**
 * @typedef {Object} MealData
 * @property {Name[]} positive definitely present
 * @property {Name[]} negative definitely NOT present
 * @property {Name[]} [pending] state in optimistic update
 */

/**
 * @typedef {Object} DailyData
 * @property {MealData} morning
 * @property {MealData} evening
 */

/**
 * @typedef {Object} WeeklyData
 * @property {DailyData} sunday
 * @property {DailyData} monday
 * @property {DailyData} tuesday
 * @property {DailyData} wednesday
 * @property {DailyData} thursday
 * @property {DailyData} friday
 * @property {DailyData} saturday
 */

/**
 * @typedef {Object.<string, WeeklyData>} ManyWeeksData
 */
