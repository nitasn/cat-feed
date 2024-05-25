import { StyleProp, ViewStyle } from "react-native";
import type { Name } from "./types";

// @ts-ignore ("nobody" is not present)
export const personToImage: Record<Name, number> = {
  imma: require("../assets/people/imma.jpg"),
  nitsan: require("../assets/people/nitsan.jpg"),
  tal: require("../assets/people/tal.jpg"),
  ronnie: require("../assets/people/ronnie.jpg"),
  shahar: require("../assets/people/shahar.jpg"),
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
