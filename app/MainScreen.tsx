import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WeekSlideSingleton from "./WeekSlideSingleton";
import { withLightHaptics } from "./haptics";
import { useEasterEggClicker } from "./hooks";
import { weekTitleEasterEggClicked } from "./nitsan-privileges";
import { rowLTR } from "./stuff";
import { State } from "./types-fix";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";

export default function MainScreen() {
  const weekStartState = useState<Date>(dateFirstDayOfWeek);

  return (
    <View style={styles.container}>
      <WeekChooserHeader weekStartState={weekStartState} />
      <WeekSlideSingleton weekStartState={weekStartState} />
    </View>
  );
}

interface IconButtonProps {
  glyph: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

function HeaderArrowBtn({ glyph, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerArrowBtn} {...withLightHaptics}>
      <Ionicons color="black" name={glyph} size={24} />
    </TouchableOpacity>
  );
}

/**
 * Looks like `<-- This Week -->` or `<-- Next Week -->` etc.
 */
function WeekChooserHeader({ weekStartState }: { weekStartState: State<Date> }) {
  const [weekStart, setWeekStart] = weekStartState;

  const title = useMemo(() => {
    return relativeWeek(weekStart);
  }, [weekStart]);

  const changeWeekBy = (numWeeks: number) => () => {
    const laterDate = advanceDateByDays(weekStart, 7 * numWeeks);
    setWeekStart(dateFirstDayOfWeek(laterDate));
  };

  const onEasterEggPress = useEasterEggClicker({
    clicksNeeded: 13,
    msToClearCount: 500,
    onAchieved: () => weekTitleEasterEggClicked(title),
  });

  return (
    <View style={styles.header}>
      <HeaderArrowBtn glyph="arrow-back" onPress={changeWeekBy(-1)} />
      <Pressable onPress={onEasterEggPress} hitSlop={50}>
        <Text style={styles.title}>{title}</Text>
      </Pressable>
      <HeaderArrowBtn glyph="arrow-forward" onPress={changeWeekBy(+1)} />
    </View>
  );
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
    flexDirection: rowLTR,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "black",
  },
  headerArrowBtn: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
});
