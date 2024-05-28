import { nameAtom, store } from "./state";

const secretSequence = [
  "9 Weeks Ago",
  "In 2 Weeks",
  "This Week",
  // "This Week",
  // "Next Week",
];

let idxNext = 0;

let timeoutId: NodeJS.Timeout;

const TIME_BETWEEN_EGGS = 10_000;

export function weekTitleEasterEggClicked(weekTitle: string) {
  clearTimeout(timeoutId);

  if (weekTitle !== secretSequence[idxNext]) {
    console.log("reset");
    
    return void (idxNext = 0);
  }

  if (++idxNext === secretSequence.length) {
    return store.set(nameAtom, "nobody");
  }

  timeoutId = setTimeout(() => (idxNext = 0), TIME_BETWEEN_EGGS);
}
