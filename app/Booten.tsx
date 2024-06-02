import { ReactNode, useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";

interface BootenProps {
  onPress?: () => void;
  children: ReactNode;
  hitSlop?: number;
}

export default function Booten({ onPress, children, hitSlop }: BootenProps) {
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
    <Pressable
      hitSlop={hitSlop}
      onPress={onPress}
      onPressIn={() => animateOpacity(0.2)}
      onPressOut={() => animateOpacity(1)}
    >
      <Animated.View style={{ opacity }}>{children}</Animated.View>
    </Pressable>
  );
}
