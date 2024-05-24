import { useAtomValue } from "jotai";
import MainScreen from "./MainScreen";
import WelcomeScreen from "./WelcomeScreen";
import { nameAtom } from "./state";

export default function Main() {
  const name = useAtomValue(nameAtom);

  return name === "nobody" ? <WelcomeScreen /> : <MainScreen />;
}
