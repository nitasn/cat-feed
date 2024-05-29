import * as Haptics from "expo-haptics";
import { sleep } from "./utils";

export const withLightHaptics = {
  onPressIn: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
};

export const withSelectionHaptics = {
  onPressIn: () => {
    Haptics.selectionAsync();
  },
};

export const lightHaptics = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const warningHaptics = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

export const errorHaptics = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

export const successHaptics = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const fwooshWoosh = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  await sleep(200);
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
