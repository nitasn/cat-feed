import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from "react-native";

interface FixedColumnsProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  widths: DimensionValue[];
}

export default function FixedColumns({ style, children, widths }: FixedColumnsProps) {
  return (
    <View style={[styles.container, style]}>
      {React.Children.map(children, (child, idx) => (
        <View key={idx} style={{ width: widths[idx] }}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
