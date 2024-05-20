import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { getLaterDate, relativeWeek } from "./utils";

// import dummyData from "./dummyData";

import { useGlobalState } from "./global-state";
import { weekDisplayed } from "./state";

/**
 * @param {{ glyph: keyof typeof Ionicons.glyphMap }}
 */
export function IconButton({ glyph, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={glyph} size={30} />
    </TouchableOpacity>
  );
}

export default function TableOfWeek() {
  return (
    <View style={styles.container}>
      <Header />
    </View>
  );
}

function Header() {
  const [firstDayOfWeek, setFirstDayOfWeek] = useGlobalState(weekDisplayed);

  const title = useMemo(() => {
    return relativeWeek(firstDayOfWeek);
  }, [firstDayOfWeek]);

  const changeWeekBy = (numWeeks) => () => {
    setFirstDayOfWeek(getLaterDate(firstDayOfWeek, { numDaysLater: 7 * numWeeks }));
  };

  return (
    <View style={styles.header}>
      <IconButton glyph="arrow-back" onPress={changeWeekBy(-1)} />
      <Text style={styles.title}>{title}</Text>
      <IconButton glyph="arrow-forward" onPress={changeWeekBy(+1)} />
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
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
  },
});
