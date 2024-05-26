import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import MainScreen from "./MainScreen";
import WelcomeScreen from "./WelcomeScreen";
import { nameAtom, store } from "./state";
import { Name } from "./types";

const nameRetrievalPromise = AsyncStorage.getItem("name");

store.sub(nameAtom, () => {
  const name = store.get(nameAtom);
  AsyncStorage.setItem("name", name);
});

function useNameRetrieval() {
  const [name, setName] = useAtom(nameAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    nameRetrievalPromise
      .then((name) => {
        name && setName(name as Name);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { loading, name };
}

export default function Main() {
  const { loading, name } = useNameRetrieval();

  if (loading) {
    return null; // it takes ~13ms
  }

  return name === "nobody" ? <WelcomeScreen /> : <MainScreen />;
}
