import { Ionicons } from "@expo/vector-icons";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BlurContainer from "./BlurContainer";
import { WeekTable, columnWidths, mealsColor } from "./WeekTable";
import { useWeekData } from "./fetcher";
import { useEasterEggClicker } from "./hooks";
import { weekTitleEasterEggClicked } from "./nitsan-privileges";
import { weekDisplayedDateAtom, weekKeyAtom } from "./state";
import { isLTR, rowLTR } from "./stuff";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";

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

  const rowStart = isLTR ? "flex-start" : "flex-end";
  const rowEnd = isLTR ? "flex-end" : "flex-start";

  return (
    <View style={styles.sunAndMoon}>
      <View style={{ width: W0, alignItems: rowStart }}>
        {/* <Ionicons color={color} name="paw-outline" size={24} /> */}
      </View>
      <View style={{ width: W1, alignItems: rowEnd }}>
        <Ionicons color={mealsColor.morning} name="sunny" size={26.2} />
      </View>
      <View style={{ width: W2, alignItems: rowEnd }}>
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

  const onEasterEggPress = useEasterEggClicker({
    clicksNeeded: 13,
    msToClearCount: 200,
    onAchieved: () => weekTitleEasterEggClicked(title),
  });

  return (
    <View style={styles.header}>
      <IconButton glyph="arrow-back" onPress={changeWeekBy(-1)} />
      <Pressable onPress={onEasterEggPress}>
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
      <View
        style={{ flex: 1, flexDirection: rowLTR, justifyContent: "center", alignItems: "center", gap: 4 }}
      >
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
  sunAndMoon: {
    flexDirection: rowLTR,
    paddingHorizontal: 26,
    marginBottom: 10,
    marginTop: -2,
  },
  header: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: rowLTR,
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
