import { Entries } from "type-fest/source/entries";
import type { Dispatch, SetStateAction } from "react";

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>;
  }
}

export type State<T> = [value: T, setValue: Dispatch<SetStateAction<T>>];
