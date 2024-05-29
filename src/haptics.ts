import * as Haptics from "expo-haptics";

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
