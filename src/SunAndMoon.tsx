import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { columnWidths, mealsColor } from "./WeekTable";
import { isLTR, rowLTR } from "./stuff";

export default function SunAndMoon() {
  const fn = () => {
    alert("hi");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={fn} style={styles.settings}>
        <Ionicons color="#3333336d" name="settings-outline" size={22} />
      </Pressable>
      <View style={styles.sun}>
        <Ionicons color={mealsColor.morning} name="sunny" size={26.2} />
      </View>
      <View style={styles.moon}>
        <Ionicons color={mealsColor.evening} name="moon" size={24} />
      </View>
    </View>
  );
}

const rowStart = isLTR ? "flex-start" : "flex-end";
const rowEnd = isLTR ? "flex-end" : "flex-start";

const [widthColumnOne, widthColumnTwo, widthColumnThree] = columnWidths;

const styles = StyleSheet.create({
  container: {
    flexDirection: rowLTR,
    paddingHorizontal: 26,
    marginBottom: 10,
    marginTop: -2,
  },
  settings: {
    width: widthColumnOne,
    alignItems: rowStart,
    transform: [{ translateY: 3 }],
  },
  sun: {
    width: widthColumnTwo,
    alignItems: rowEnd,
  },
  moon: {
    width: widthColumnThree,
    alignItems: rowEnd,
  },
});
