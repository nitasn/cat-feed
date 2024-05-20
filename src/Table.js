import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import useWeekData from "./fetcher";
import { BlurView } from "expo-blur";

export function Table() {
  const { weekLoading, weekError, weekData } = useWeekData();

  if (weekLoading) {
    return (
      <BlurView intensity={80} tint="default" style={tableStyles.blurContainer}>
        <ActivityIndicator />
      </BlurView>
    );
  }

  const text = weekLoading
    ? "Week Pending..."
    : weekError
      ? `Week Error: ${weekError.message}`
      : JSON.stringify(weekData);

  return (
    <BlurView intensity={80} tint="default" style={tableStyles.blurContainer}>
      <Text>{text}</Text>
    </BlurView>
  );
}
const tableStyles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    alignSelf: "stretch",
    padding: 20,
    margin: 20,
    overflow: "hidden",
    borderRadius: 20,
  },
});
