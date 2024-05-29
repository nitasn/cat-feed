import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BlurContainer from "./BlurContainer";
import SunAndMoon from "./SunAndMoon";
import WeekContentGuard from "./WeekContentGuard";
import { useEasterEggClicker } from "./hooks";
import { weekTitleEasterEggClicked } from "./nitsan-privileges";
import { weekDisplayedDateAtom } from "./state";
import { rowLTR } from "./stuff";
import { advanceDateByDays, dateFirstDayOfWeek, relativeWeek } from "./utils";
import { withLightHaptics } from "./haptics";

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <BlurContainer componentAbove={<SunAndMoon />}>
        <WeekContentGuard />
      </BlurContainer>
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
