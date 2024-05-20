import React from "react";

/**
 * @typedef {() => void} Unsubscribe
 */

/**
 * @template T
 * @param {T} [initialValue]
 * @returns {{
 *   get: () => T,
 *   set: (nextValue: T | ((prevValue: T) => T)) => void,
 *   subscribe: (callback: (nextValue: T) => void) => Unsubscribe
 * }}
 */
export function createGlobalState(initialValue = undefined) {
  let value = initialValue;
  const subs = new Set();

  function get() {
    return value;
  }

  function set(param) {
    value = typeof param === "function" ? param(value) : param;
    subs.forEach((callback) => callback(value));
  }

  function subscribe(callback) {
    if (typeof callback !== "function") {
      return console.error("param `callback` must be a function");
    }
    subs.add(callback);
    return function unsubscribe() {
      subs.delete(callback);
    };
  }

  return { get, set, subscribe };
}

/**
 * @template T
 * @param {ReturnType<typeof createGlobalState<T>>} globalState
 * @returns {[T, (nextValue: T | ((prevValue: T) => T)) => void]}
 */
export function useGlobalState(globalState) {
  const [value, setValue] = React.useState(globalState.get);
  React.useEffect(() => globalState.subscribe(setValue), []);
  return [value, globalState.set];
}
