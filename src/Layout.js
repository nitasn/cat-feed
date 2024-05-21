// @ts-check

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useWeekData from "./fetcher";
import { useAtom } from "jotai";
import { weekDisplayedAtom } from "./state";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";

import { BlurView } from "expo-blur";
import { WeekTable, columnWidths } from "./WeekTable";

export default function Layout() {
  /**
   * @type {import('expo-blur').BlurViewProps['tint'] | undefined}
   */
  const blurTint = Platform.select({
    ios: "light",
    android: "prominent",
  });

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.blurWrapper}>
        <SunAndMoon />
        <BlurView intensity={70} tint={blurTint} style={styles.blurContainer}>
          <BlurContainerContent />
        </BlurView>
      </View>
    </View>
  );
}

function SunAndMoon() {
  const sunColor = "#d2a345"; // bc8e56
  const color = "#797979";

  const [W0, W1, W2] = columnWidths;

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 26 }}>
      <View style={{ width: W0, flexDirection: "row", paddingBottom: 8, justifyContent: "flex-start" }}>
        {/* <Ionicons color={color} name="paw-outline" size={24} /> */}
      </View>
      <View style={{ width: W1, flexDirection: "row", paddingBottom: 8, justifyContent: "flex-end" }}>
        <Ionicons color={color} style={{ transform: [{ scale: 1.1 }] }} name="sunny-outline" size={24} />
      </View>
      <View style={{ width: W2, flexDirection: "row", paddingBottom: 8, justifyContent: "flex-end" }}>
        <Ionicons color={color} style={{ transform: [{ scale: 0.99 }] }} name="moon-outline" size={24} />
      </View>
    </View>
  );
}

/**
 * @param {{ glyph: keyof typeof Ionicons.glyphMap, onPress: () => void }} props
 */
function IconButton({ glyph, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      <Ionicons color="black" name={glyph} size={24} />
    </TouchableOpacity>
  );
}

function Header() {
  const [firstDayOfWeek, setFirstDayOfWeek] = useAtom(weekDisplayedAtom);

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

function BlurContainerContent() {
  const { weekLoading, weekError, weekData } = useWeekData();

  if (weekLoading) {
    return (
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}>
        <Text style={{ color: "#333", fontSize: 16 }}>Loading...</Text>
        <ActivityIndicator color="black" />
      </View>
    );
  }

  if (weekError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "maroon", fontSize: 16 }}>Can't load data from server :/</Text>
        <Text style={{ color: "maroon", fontSize: 16 }}>You got internet bro?</Text>
      </View>
    );
  }

  if (weekData) {
    return <WeekTable weekData={weekData} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "black",
  },
  iconButton: {
    paddingVertical: 22,
    paddingHorizontal: 36,
  },
  blurWrapper: {
    flex: 1,
    margin: 20,
    alignSelf: "stretch",
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    overflow: "hidden",
    borderRadius: 16,
  },
});
