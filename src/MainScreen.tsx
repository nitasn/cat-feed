import { Ionicons } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BlurContainer from "./BlurContainer";
import { WeekTable, columnWidths, mealsColor } from "./WeekTable";
import { useWeekData } from "./fetcher";
import { nameAtom, store, weekDisplayedDateAtom, weekKeyAtom } from "./state";
import { advanceDateByDays, dateFirstDayOfWeek, debouncify, relativeWeek } from "./utils";
import { useEasterEggClicker } from "./hooks";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <BlurContainer componentAbove={<SunAndMoon />}>
        <BlurContainerContent />
      </BlurContainer>
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

  const easterEggOnPress = useEasterEggClicker({
    clicksNeeded: 13,
    msToClearCount: 300,
    onAchieved: () => store.set(nameAtom, "nobody"),
  });

  return (
    <View style={styles.header}>
      <IconButton glyph="arrow-back" onPress={changeWeekBy(-1)} />
      <Pressable onPress={easterEggOnPress}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
        <Text style={{ color: "maroon", fontSize: 16 }}>Cannot connect to server 😕</Text>
        <Text style={{ color: "gray", fontSize: 16 }}>{weekError.message}</Text>
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
});
