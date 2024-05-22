// @ts-check

import { useAtom } from "jotai";
import React, { useRef } from "react";
import RN, { StyleSheet, Text, View, ImageBackground, Pressable } from "react-native";
import { weekDisplayedAtom } from "./state";
import { advanceDateByDays } from "./utils";
import { format } from "date-fns";
import FixedColumns from "./FixedColumns";
import { Ionicons } from "@expo/vector-icons";

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
export function WeekTable({ weekData }) {
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

/** @type {`${number}%`[]} */
export const columnWidths = ["16%", "42%", "42%"];

const columnWeights = columnWidths.map((value) => +value.substring(0, value.length - 1) / 100);

/**
 * @param {{ dayName: string, dayData: DailyData }} props
 */
function Row({ dayName, dayData }) {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);
  const widthRef = useRef(0);

  /**
   * @param {RN.GestureResponderEvent} event
   */
  const onPress = (event) => {
    const offset = 36; // blur container padding + margin
    const normalizedX = (event.nativeEvent.pageX - offset) / widthRef.current;
    const spill = 0.1;
    if (normalizedX < columnWeights[0] + spill) {
      console.log(dayName, "date was pressed");
    } else if (normalizedX < columnWeights[0] + columnWeights[1] + spill) {
      console.log(dayName, "morning was pressed");
    } else {
      console.log(dayName, "evening was pressed");
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onLayout={(event) => {
        widthRef.current = event.nativeEvent.layout.width;
      }}
    >
      <FixedColumns widths={columnWidths} style={styles.row}>
        <DayColumn dayData={dayData} dayName={dayName} />
        <PeopleColumn people={dayData.morning} />
        <PeopleColumn people={dayData.evening} />
      </FixedColumns>

      {dayName !== "saturday" && <Hr />}
    </Pressable>
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
 * @param {{ dayName: string, dayData: DailyData }} props
 */
function DayColumn({ dayData, dayName }) {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);
  const date = advanceDateByDays(dateWeekStarts, dayToIndex[dayName]);

  const booked = dayData.morning.positive.length && dayData.evening.positive.length;
  const color = booked ? styles.colorGood : styles.colorBad;

  return (
    <View style={styles.dayColumn}>
      <Text style={[styles.dayName, color]}>{dayNameAbbreviation[dayName]}</Text>
      <Text style={[styles.date, color]}>{format(date, "MMM d")}</Text>
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
        <PersonBubble key={name} name={name} />
      ))}
    </View>
  );
}

function NobodyBubble() {
  // return null;
  return <Ionicons name="paw" color="black" size={22} />;
}

/**
 *
 * @param {{ name: Name }} props
 */
function PersonBubble({ name }) {
  return (
    <ImageBackground source={personToImage[name]} style={styles.personBubble}>
      <View style={styles.bubbleBorderOverlay} />
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
    paddingVertical: 2,
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
  dayColumn: {
    // backgroundColor: "white"
  },
  dayName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  colorBad: {
    color: "hsl(0, 100%, 17.45%)",
    // color: "black",
  },
  colorGood: {
    color: "hsl(180, 100%, 17.45%)",
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
    marginHorizontal: -7,
  },
  bubbleBorderOverlay: {
    flex: 1,
    opacity: 0.7,
    borderRadius: Number.MAX_SAFE_INTEGER,
    borderWidth: 1.5,
    borderColor: "#676767",
  },
});
