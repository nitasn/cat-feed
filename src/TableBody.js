// @ts-check

import { useAtom } from "jotai";
import React from "react";
import RN, { StyleSheet, Text, View, ImageBackground } from "react-native";
import { weekDisplayed } from "./state";
import { advanceDateByDays } from "./utils";
import { format } from "date-fns";
import FixedColumns from "./FixedColumns";

/** @type {Record<Name, number>} */
const personToImage = {
  // @ts-ignore
  imma: require("../assets/people/imma.jpg"),
  // @ts-ignore
  nitsan: require("../assets/people/nitsan.jpg"),
  // @ts-ignore
  tal: require("../assets/people/tal.jpg"),
  // @ts-ignore
  ronnie: require("../assets/people/ronnie.jpg"),
  // @ts-ignore
  shahar: require("../assets/people/shahar.jpg"),
};

/** @type {Record<Name, string>} */
const personToColor = {
  imma: "#76babd",
  nitsan: "#ef9696",
  tal: "#c5c587",
  ronnie: "#756AB6",
  shahar: "#E0AED0",
};

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

const dayToIndex = Object.fromEntries(Object.keys(dayNameAbbreviation).map((key, index) => [key, index]));

/**
 * @param {{ dayName: string, dayData: DailyData }} props
 */
function Row({ dayName, dayData }) {
  return (
    <>
      <FixedColumns widths={["20%", "40%", "40%"]} style={styles.row}>
        <DayColumn dayName={dayName} />
        <PeopleColumn people={dayData.morning} />
        <PeopleColumn people={dayData.evening} />
      </FixedColumns>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

/**
 * @param {number} n
 * @param {number} [m]
 * @returns {number[]}
 */
function range(n, m = undefined) {
  if (m === undefined) {
    return [...Array(n).keys()];
  }
  return range(m - n).map((x) => x + n);
}

/**
 * @param {{ dayName: string }} props
 */
function DayColumn({ dayName }) {
  const [dateWeekStarts] = useAtom(weekDisplayed);
  const date = advanceDateByDays(dateWeekStarts, dayToIndex[dayName]);

  return (
    <View style={styles.dayColumn}>
      <Text style={styles.dayName}>{dayNameAbbreviation[dayName]}</Text>
      <Text style={styles.date}>{format(date, "MMM d")}</Text>
    </View>
  );
}

/**
 * @param {{ people: DailyData["morning"] | DailyData["evening"] }} props
 */
function PeopleColumn({ people }) {
  return (
    <View style={styles.peopleColumn}>
      {people.positive.map((name) => (
        <PersonBubble key={`positive:${name}`} name={name} attending={true} />
      ))}
      {people.negative.map((name) => (
        <PersonBubble key={`negative:${name}`} name={name} attending={false} />
      ))}
    </View>
  );
}
/**
 *
 * @param {{ name: Name, attending: boolean }} props
 */
function PersonBubble({ name, attending }) {
  return (
    <ImageBackground source={personToImage[name]} style={styles.personBubble}>
      <View style={[styles.borderOverlay, attending ? styles.postiveBorderColor : styles.negativeBorderColor]} />
    </ImageBackground>
  );
}

function Hr() {
  return <View style={styles.hr} />;
}

function Vr() {
  return <View style={styles.vr} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  row: {
    padding: 8, // TODO container padding... prev file
    alignItems: "center",
  },
  hr: {
    backgroundColor: "#33333322",
    width: "100%",
    height: 1,
  },
  vr: {
    backgroundColor: "#33333322",
    width: 1,
    height: "100%",
  },
  dayColumn: {},
  dayName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
    color: "black,",
  },
  date: {
    fontSize: 12,
  },
  peopleColumn: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  personBubble: {
    width: 36,
    height: 36,
    borderRadius: Number.MAX_SAFE_INTEGER,
    overflow: "hidden",
    marginHorizontal: -8,
  },
  borderOverlay: {
    flex: 1,
    opacity: 0.7,
    borderRadius: Number.MAX_SAFE_INTEGER,
    borderWidth: 2,
  },
  postiveBorderColor: {
    borderColor: "green",
  },
  negativeBorderColor: {
    borderColor: "red",
  },
});
