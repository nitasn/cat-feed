import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { getFirstDayOfWeek, getLaterDate, relativeWeek } from "./utils";

import { useGlobalState } from "./global-state";
import { weekDisplayed } from "./state";
import useWeekData from "./fetcher";

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
      <Table />
    </View>
  );
}

function Header() {
  const [firstDayOfWeek, setFirstDayOfWeek] = useGlobalState(weekDisplayed);

  const title = useMemo(() => {
    return relativeWeek(firstDayOfWeek);
  }, [firstDayOfWeek]);

  const changeWeekBy = (numWeeks) => () => {
    const laterDate = getLaterDate(firstDayOfWeek, { numDaysLater: 7 * numWeeks });
    setFirstDayOfWeek(getFirstDayOfWeek(laterDate));
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

  if (weekPending) return <Text>Week Pending...</Text>;

  if (weekError) return <Text>Week Error: {weekError.message}</Text>;

  return <Text>{JSON.stringify(weekData)}</Text>;
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
