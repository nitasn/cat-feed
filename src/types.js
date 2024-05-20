/**
 * @typedef {"nitsan" | "tal" | "ronnie" | "shahar" | "imma"} Name
 */

/**
 * @typedef {Object} DailyData
 * @property {Name[]} positive
 * @property {Name[]} negative
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