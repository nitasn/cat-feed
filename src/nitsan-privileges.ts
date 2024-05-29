import { nameAtom, store } from "./state";

const secretSequence = [
  // "9 Weeks Ago", 
  // "In 2 Weeks", // TODO UNDELETE
  "This Week",
  "Next Week"
];

let idxNext = 0;

let timeoutId: NodeJS.Timeout;


export function weekTitleEasterEggClicked(weekTitle: string) {
  clearTimeout(timeoutId);

  if (weekTitle !== secretSequence[idxNext]) {
    return void (idxNext = 0);
  }

  if (++idxNext === secretSequence.length) {
    return store.set(nameAtom, "nobody");
  }

  timeoutId = setTimeout(() => (idxNext = 0), 10_000);
}
