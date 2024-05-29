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
