// @ts-check

import { startOfWeek, format, parse } from "date-fns";

/**
 * @param {Date} [inputDate]
 * @returns {Date}
 */
export function dateFirstDayOfWeek(inputDate = new Date()) {
  return startOfWeek(inputDate, { weekStartsOn: 0 });
}

/**
 * @param {Date} date
 * @returns {string}
 */
export function dateToShortString(date) {
  return format(date, "MMMM d, yyyy");
}

/**
 * @param {string} str
 * @returns {Date}
 */
export function shortStringToDate(str) {
  return parse(str, "MMMM d, yyyy", new Date());
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
 * @param {Date} dateInput
 */
export function relativeWeek(dateInput) {
  const startOfThisWeek = dateFirstDayOfWeek();
  const startOfThatWeek = dateFirstDayOfWeek(dateInput);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksDifference = Math.round((+startOfThatWeek - +startOfThisWeek) / msPerWeek);

  if (weeksDifference === 0) {
    return "This Week";
  } else if (weeksDifference === 1) {
    return "Next Week";
  } else if (weeksDifference > 1) {
    return `In ${weeksDifference} Weeks`;
  } else if (weeksDifference === -1) {
    return "Last Week";
  } else {
    return `${-weeksDifference} Weeks Ago`;
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
