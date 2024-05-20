/**
 * @typedef {"nitsan" | "tal" | "ronnie" | "shahar" | "imma"} Name
 */

/**
 * @typedef {Object} DailyData
 * @property {Name[]} morning
 * @property {Name[]} evening
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