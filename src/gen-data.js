// @ts-check

/** @type {Name[]} */
const names = ["imma", "nitsan", "tal", "ronnie", "shahar"];

/**
 * Random sampling with repetitions.
 * @template T
 * @param {T[]} array
 * @param {number} k
 * @returns {T[]}
 */
function randomSample(array, k) {
  const result = [];
  for (let i = 0; i < k; i++) {
    result.push(randomChoice(array));
  }
  return result;
}

/**
 * @template T
 * @param {T[]} array
 * @returns {T}
 */
function randomChoice(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function noDups(array) {
  return Array.from(new Set(array));
}

/**
 * @template T
 * @param {T[]} A
 * @param {T[]} B
 * @returns {T[]}
 */
function arrayDifference(A, B) {
  return A.filter((a) => !B.includes(a));
}

/**
 * @returns {{ positive: Name[], negative: Name[] }}
 */
function randomPosNeg() {
  // return { positive: names, negative: names }; // for testing

  const maxPos = randomChoice([0, 1, 2, 3, 4, 5]);
  const positive = noDups(randomSample(names, maxPos));

  const remainingNames = arrayDifference(names, positive);

  const maxNeg = randomChoice([0, 1, 2]);
  const negative = noDups(randomSample(remainingNames, maxNeg));

  return { positive, negative };
}

/**
 * @returns {WeeklyData}
 */
export function randomWeeklyData() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const daysEntries = days.map((day) => [day, { morning: randomPosNeg(), evening: randomPosNeg() }]);
  return Object.fromEntries(daysEntries);
}

export function emptyWeeklyData() {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const daysEntries = days.map((day) => [day, { 
      morning: { positive: [], negative: [] }, 
      evening: { positive: [], negative: [] } 
  }]);
  return Object.fromEntries(daysEntries);
}
