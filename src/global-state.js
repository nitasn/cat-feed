//@ts-check

import { useState, useEffect } from "react";

/**
 * @param {any} param 
 * @returns {param is Function}
 */
function isFunction(param) {
  return typeof param === "function";
}

/** @template T */
export class GlobalState {

  /** @type {T} */
  #value;

  /** @type {Set<(value: T) => void>} */
  #subs = new Set();

  /**
   * @param {T} initialValue
   */
  constructor(initialValue) {
    this.#value = initialValue;
  }

  /**
   * @returns {T}
   */
  get() { return this.#value; }

  /**
   * @param {T | ((prevValue: T) => T)} param 
   */
  set(param) {
    this.#value = isFunction(param) ? param(this.#value) : param;
    this.#subs.forEach((callback) => callback(this.#value));
  }

  /**
   * @param {(value: T) => void} callback 
   * @returns {() => void} an `unsubscribe` function.
   */
  subscribe(callback) {
    if (typeof callback !== "function") {
      throw Error("param `callback` must be a function");
    }
    this.#subs.add(callback);
    return function unsubscribe() { this.subs.delete(callback); };
  }
}

/**
 * @template T
 * @param {GlobalState<T>} globalState
 * @returns {[T, GlobalState<T>['set']]}
 */
export function useGlobalState(globalState) {
  const [value, setValue] = useState(globalState.get);
  useEffect(() => globalState.subscribe(setValue), [globalState]);
  return [value, globalState.set];
}