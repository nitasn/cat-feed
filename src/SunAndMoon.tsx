import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import useSettingsModal from "./SettingsModel";
import { columnWidths, mealsColor } from "./WeekTable";
import { withSelectionHaptics } from "./haptics";
import { isLTR, rowLTR } from "./stuff";

export default function SunAndMoon() {
  const { modal, showModal } = useSettingsModal();

  return (
    <View style={styles.container}>
      {modal}

      <TouchableOpacity style={styles.settings} hitSlop={25} onPress={showModal} {...withSelectionHaptics}>
        <Ionicons color="#33333344" name="settings-outline" size={22} />
      </TouchableOpacity>
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
