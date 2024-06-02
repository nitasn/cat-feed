import { I18nManager } from "react-native";
import { reloadAsync } from "expo-updates";

export async function forceAppHorizontalDirection(dir: "rtl" | "ltr") {
  I18nManager.allowRTL(dir === "rtl");
  I18nManager.forceRTL(dir === "rtl");
  if (I18nManager.isRTL && dir === "ltr") {
    reloadAsync();
  }
}

export class Tracker<T> {
  #value: T;
  #name: string;

  constructor(value: T, name?: string) {
    this.#value = value;
    this.#name = name ?? "value";
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    console.log(`Tracked ${this.#name} -> ${this.#value}`);
  }
}
