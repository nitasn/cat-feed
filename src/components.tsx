import { ReactNode, useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";

export function Booten({ onPress, children }: { onPress?: () => void; children: ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;

  const animateOpacity = (toValue: number) => {
    Animated.timing(opacity, {
      toValue,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.linear),
    }).start();
  };

  return (
    <Pressable onPressIn={() => animateOpacity(0.2)} onPressOut={() => animateOpacity(1)} onPress={onPress}>
      <Animated.View style={{ opacity }}>{children}</Animated.View>
    </Pressable>
  );
}
