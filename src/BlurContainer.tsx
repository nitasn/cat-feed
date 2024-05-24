import { BlurView, type BlurViewProps } from "expo-blur";
import { ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BlurContainerProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  componentAbove?: ReactNode;
}

export default function BlurContainer({ children, componentAbove, style }: BlurContainerProps) {
  const blurTint: BlurViewProps["tint"] | undefined = Platform.select({
    ios: "light",
    android: "prominent",
  });

  return (
    <View style={styles.blurWrapper}>
      {componentAbove}
      <BlurView intensity={70} tint={blurTint} style={[styles.blurContainer, style]}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  blurWrapper: {
    flex: 1,
    margin: 18,
    alignSelf: "stretch",
  },
  blurContainer: {
    flex: 1,
    padding: 18,
    overflow: "hidden",
    borderRadius: 16,
  },
});

export const blurContainerContentOffset = styles.blurWrapper.margin + styles.blurContainer.padding;
