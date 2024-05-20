// @ts-check

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useWeekData from "./fetcher";
import { useAtom } from "jotai";
import { weekDisplayed } from "./state";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";

import { BlurView } from "expo-blur";

export default function TableOfWeek() {
  return (
    <View style={styles.container}>
      <Header />
      <Table />
    </View>
  );
}

/**
 * @param {{ glyph: keyof typeof Ionicons.glyphMap, onPress: () => void }} props
 */
export function IconButton({ glyph, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={glyph} size={24} />
    </TouchableOpacity>
  );
}

function Header() {
  const [firstDayOfWeek, setFirstDayOfWeek] = useAtom(weekDisplayed);

  const title = useMemo(() => {
    return relativeWeek(firstDayOfWeek);
  }, [firstDayOfWeek]);

  const changeWeekBy = (numWeeks) => () => {
    const laterDate = advanceDateByDays(firstDayOfWeek, 7 * numWeeks);
    setFirstDayOfWeek(dateFirstDayOfWeek(laterDate));
  };

  return (
    <View style={styles.header}>
      <IconButton glyph="arrow-back" onPress={changeWeekBy(-1)} />
      <Text style={styles.title}>{title}</Text>
      <IconButton glyph="arrow-forward" onPress={changeWeekBy(+1)} />
    </View>
  );
}

function Table() {
  const { weekPending, weekError, weekData } = useWeekData();

  const text = weekPending
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
  },
});
