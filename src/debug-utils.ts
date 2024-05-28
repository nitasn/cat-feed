import { I18nManager } from "react-native";
import { reloadAsync } from "expo-updates";

export async function forceAppHorizontalDirection(dir: "rtl" | "ltr") {
  I18nManager.allowRTL(dir === "rtl");
  I18nManager.forceRTL(dir === "rtl");
  if (I18nManager.isRTL && dir === "ltr") {
    reloadAsync();
  }
}
