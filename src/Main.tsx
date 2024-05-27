import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom, useAtomValue } from "jotai";
import MainScreen from "./MainScreen";
import WelcomeScreen from "./WelcomeScreen";
import { nameAtom, store } from "./state";
import { Name } from "./types";

const nameRetrievalLoadingAtom = atom(true);

AsyncStorage.getItem("name")
  .then((name) => {
    name && store.set(nameAtom, name as Name);
  })
  .finally(() => {
    store.set(nameRetrievalLoadingAtom, false);
  });

store.sub(nameAtom, () => {
  const name = store.get(nameAtom);
  AsyncStorage.setItem("name", name);
});

export default function Main() {
  const name = useAtomValue(nameAtom);
  const isNameLoading = useAtomValue(nameRetrievalLoadingAtom);

  if (isNameLoading) {
    // the name usually finishes loading before the app loads...
    // the entire app loading is ~13ms
    return null;
  }

  return name === "nobody" ? <WelcomeScreen /> : <MainScreen />;
}
