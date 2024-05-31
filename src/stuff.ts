import { Dimensions, StyleProp, ViewStyle } from "react-native";
import type { Name } from "./types";
import { I18nManager } from "react-native";

// @ts-ignore ("nobody" is not present)
export const personToImage: Record<Name, number> = {
  imma: require("../assets/people/imma.jpg"),
  nitsan: require("../assets/people/nitsan.jpg"),
  tal: require("../assets/people/tal.jpg"),
  ronnie: require("../assets/people/ronnie.jpg"),
  shahar: require("../assets/people/shahar.jpg"),
};

/**
 * When using on android, backgroundColor must be set!!
 */
export const dropShadow: StyleProp<ViewStyle> = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

export const isLTR = !I18nManager.isRTL;

export const rowLTR = isLTR ? "row" : "row-reverse";

export const signLTR = isLTR ? +1 : -1;

export const vw = Dimensions.get("window").width / 100;
export const vh = Dimensions.get("window").height / 100;
export const vmin = Math.min(vw, vh);
export const vmax = Math.max(vw, vh);
