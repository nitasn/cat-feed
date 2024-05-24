import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WeekTable, columnWidths, mealsColor } from "./WeekTable";
import { useWeekData } from "./fetcher";
import { weekDisplayedDateAtom, weekKeyAtom } from "./state";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";

import type { BlurViewProps } from "expo-blur";

export default function Layout() {
  const blurTint: BlurViewProps["tint"] | undefined = Platform.select({
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
  const [W0, W1, W2] = columnWidths;

  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 26, marginBottom: 10, marginTop: -2 }}>
      <View style={{ width: W0, alignItems: "flex-start" }}>
        {/* <Ionicons color={color} name="paw-outline" size={24} /> */}
      </View>
      <View style={{ width: W1, alignItems: "flex-end" }}>
        <Ionicons color={mealsColor.morning} name="sunny" size={26.2} />
      </View>
      <View style={{ width: W2, alignItems: "flex-end" }}>
        <Ionicons color={mealsColor.evening} name="moon" size={24} />
      </View>
    </View>
  );
}

interface IconButtonProps {
  glyph: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function IconButton({ glyph, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconButton}>
      <Ionicons color="black" name={glyph} size={24} />
    </TouchableOpacity>
  );
}

function Header() {
  const [firstDayOfWeek, setFirstDayOfWeek] = useAtom(weekDisplayedDateAtom);

  const title = useMemo(() => {
    return relativeWeek(firstDayOfWeek);
  }, [firstDayOfWeek]);

  const changeWeekBy = (numWeeks: number) => () => {
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
  const weekKey = useAtomValue(weekKeyAtom);
  const { weekLoading, weekError, weekData } = useWeekData(weekKey);

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
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
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
