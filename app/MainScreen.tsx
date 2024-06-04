import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WeekSlideSingleton from "./WeekSlideSingleton";
import { withLightHaptics } from "./haptics";
import { useEasterEggClicker } from "./hooks";
import { weekTitleEasterEggClicked } from "./nitsan-privileges";
import { rowLTR } from "./stuff";
import { State } from "./types-fix";
import { advanceTimestampByDays, timestampFirstDayOfWeek, relativeWeek } from "./utils";

export default function MainScreen() {
  const weekTimestampState = useState<number>(timestampFirstDayOfWeek);

  return (
    <View style={styles.container}>
      <WeekChooserHeader weekTimestampState={weekTimestampState} />
      <WeekSlideSingleton weekTimestampState={weekTimestampState} />
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
function WeekChooserHeader({ weekTimestampState }: { weekTimestampState: State<number> }) {
  const [weekStart, setWeekStart] = weekTimestampState;

  const title = useMemo(() => {
    return relativeWeek(new Date(weekStart));
  }, [weekStart]);

  const changeWeekBy = (numWeeks: number) => () => {
    const timestamp = advanceTimestampByDays(weekStart, 7 * numWeeks);
    setWeekStart(timestampFirstDayOfWeek(new Date(timestamp)));
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
