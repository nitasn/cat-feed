/**
 * @param {Date | number} date Date instance or unix timestamp.
 * @returns {string} First day of the week, e.g. "May 19, 2024".
 */
export function getFirstDayOfWeek(date) {
  const resultDate = new Date(date);
  const dayOfWeek = resultDate.getDay();
  resultDate.setDate(resultDate.getDate() - dayOfWeek);
  return resultDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
