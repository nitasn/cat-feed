// @ts-check

import React from "react";
import RN from "react-native";
import { View, StyleSheet } from "react-native";

/**
 * @param {{
 *   children?: React.ReactNode,
 *   style?: RN.StyleProp<RN.ViewStyle>,
 *   widths: `${number}%`[],
 * }} props
 */
export default function FixedColumns({ style, children, widths }) {
  return (
    <View style={[styles.container, style]}>
      {children &&
        widths.map((width, idx) => (
          <View key={idx} style={{ width }}>
            {children[idx]}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
});
