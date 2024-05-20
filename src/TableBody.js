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
 * @param {{ dayName: string, dayData: DailyData }} props
 */
function Row({ dayName, dayData }) {
  return (
    <>
      <View style={styles.row}>
        <DayColumn dayName={dayName} />
        <PeopleColumn dayData={dayData} />
      </View>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

/**
 * @param {{ dayData: DailyData }} props
 */
function PeopleColumn({ dayData }) {
  console.log(dayData);
  return (
    <View style={styles.peopleBubblesArea}>
      {dayData.positive.map((name) => (
        <PersonBubble key={`positive:${name}`} name={name} attendending={true} />
      ))}
      {dayData.negative.map((name) => (
        <PersonBubble key={`negative:${name}`} name={name} attendending={false} />
      ))}
    </View>
  );
}

/**
 *
 * @param {{ name: string, attendending: boolean }} props
 */
function PersonBubble({ name, attendending }) {
  const char = name[0].toUpperCase();

  const backgroundColor = attendending ? "#32cd3255" : "#ff450055";

  return (
    <View style={[styles.personBubble, { backgroundColor }]}>
      <Text>{char}</Text>
    </View>
  );
}

/**
 * @param {{ dayName: string }} props
 */
function DayColumn({ dayName }) {
  const [dateWeekStarts] = useAtom(weekDisplayed);
  const date = advanceDateByDays(dateWeekStarts, dayOffset[dayName]);

  return (
    <View>
      <Text style={styles.dayName}>{dayName}</Text>
      <Text style={styles.date}>{format(date, "MMMM d")}</Text>
    </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  personBubble: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Number.MAX_SAFE_INTEGER,
  },
  peopleBubblesArea: {
    flexDirection: "row",
    gap: 3,
  },
});
