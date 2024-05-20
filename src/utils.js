// @ts-check

/**
 * @param {Date | number | string} date Date instance or unix timestamp.
 * @returns {string} First day of the week, e.g. "May 19, 2024".
 */
export function getFirstDayOfWeek(date = Date.now()) {
  const resultDate = new Date(date);
  const dayOfWeek = resultDate.getDay();
  resultDate.setDate(resultDate.getDate() - dayOfWeek);
  return resultDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/**
 * @param {Date | number | string} date
 * @param {number} numDaysLater
 * @returns {Date}
 */
export function advanceDateByDays(date, numDaysLater) {
  const result = new Date(date);
  result.setDate(result.getDate() + numDaysLater);
  return result;
}

/**
 * Returns a string like "This Week" or "Next Week" or "2 Weeks Ago" etc.
 * @param {Date | number | string} dateInput 
 */
export function relativeWeek(dateInput) {
  const now = new Date();
  // Align current date to the start of the current week (Sunday)
  const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const inputDate = new Date(dateInput);
  // Adjust the input date to the start of its week (Sunday)
  const startOfInputWeek = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate() - inputDate.getDay());
  startOfInputWeek.setHours(0, 0, 0, 0);

  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksDifference = (+startOfInputWeek - +startOfThisWeek) / msPerWeek;

  if (weeksDifference === 0) {
    return "This Week";
  } else if (weeksDifference === 1) {
    return "Next Week";
  } else if (weeksDifference > 1) {
    return `In ${Math.round(weeksDifference)} Weeks`;
  } else if (weeksDifference === -1) {
    return "Last Week";
  } else { // weeksDifference < -1
    return `${-Math.round(weeksDifference)} Weeks Ago`;
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));