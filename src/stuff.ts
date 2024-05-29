import { StyleProp, ViewStyle } from "react-native";
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

// @ts-ignore ("nobody" is not present)
export const personToGrayScaleImage: Record<Name, number> = {
  imma: require("../assets/people-gray/imma.jpg"),
  nitsan: require("../assets/people-gray/nitsan.jpg"),
  tal: require("../assets/people-gray/tal.jpg"),
  ronnie: require("../assets/people-gray/ronnie.jpg"),
  shahar: require("../assets/people-gray/shahar.jpg"),
};

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

export const rowLTR = (isLTR ? "row" : "row-reverse");
