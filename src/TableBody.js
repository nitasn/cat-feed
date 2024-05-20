// @ts-check

import { useAtom } from "jotai";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { weekDisplayed } from "./state";
import { advanceDateByDays, dateToShortString } from "./utils";
import { format } from "date-fns";

/**
 * @param {{ weekData: WeeklyData}} props
 */
export function TableBody({ weekData }) {
  const rows = Object.entries(weekData).map(([dayName, dayData]) => (
    <Row key={dayName} dayName={dayName} dayData={dayData} />
  ));

  return <View style={styles.container}>{rows}</View>;
}

const dayNameAbbreviation = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

const dayOffset = Object.fromEntries(Object.keys(dayNameAbbreviation).map((key, index) => [key, index]));

/**
 * @param {{ dayName: string, dayData: DailyData}} props
 */
function Row({ dayName, dayData }) {
  const [dateWeekStarts] = useAtom(weekDisplayed);
  const date = advanceDateByDays(dateWeekStarts, dayOffset[dayName]);

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.dayName}>{dayName}</Text>
        <Text style={styles.date}>{format(date, "MMMM d")}</Text>
      </View>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

function Hr() {
  return <View style={styles.hr} />;
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  row: {
    padding: 12,
  },
  hr: {
    backgroundColor: "#33333322",
    width: "100%",
    height: 1,
  },
  dayName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  date: {
    fontSize: 16,
  },
});
