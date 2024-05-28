import { nameAtom, store } from "./state";

const secretSequence = ["9 Weeks Ago", "In 2 Weeks", "This Week", "Next Week"];

const tracker = {
  __idx: 0,

  get idxNext() {
    return this.__idx;
  },

  set idxNext(idx) {
    this.__idx = idx;
    console.log("idx next:", this.__idx);
  },
};

let timeoutId: NodeJS.Timeout;

export function weekTitleEasterEggClicked(weekTitle: string) {
  clearTimeout(timeoutId);

  if (weekTitle !== secretSequence[tracker.idxNext]) {
    return void (tracker.idxNext = 0);
  }

  if (++tracker.idxNext === secretSequence.length) {
    return store.set(nameAtom, "nobody");
  }

  timeoutId = setTimeout(() => (tracker.idxNext = 0), 10_000);
}
