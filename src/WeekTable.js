// @ts-check

import { useAtom } from "jotai";
import React, { useRef } from "react";
import RN, { StyleSheet, Text, View, ImageBackground, Pressable, ActivityIndicator } from "react-native";
import { weekDisplayedAtom } from "./state";
import { advanceDateByDays, arrayDifference } from "./utils";
import { format } from "date-fns";
import FixedColumns from "./FixedColumns";
import { Ionicons } from "@expo/vector-icons";
import { toggleMyself } from "./fetcher";

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
      // day column was pressed
    } else if (normalizedX < columnWeights[0] + columnWeights[1] + spill) {
      toggleMyself(dateWeekStarts, dayName, "morning");
    } else {
      toggleMyself(dateWeekStarts, dayName, "evening");
    }
  };

  return (
    <>
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
      </Pressable>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

/**
 * @param {{ dayName: string, dayData: DailyData }} props
 */
function DayColumn({ dayData, dayName }) {
  const [dateWeekStarts] = useAtom(weekDisplayedAtom);
  const date = advanceDateByDays(dateWeekStarts, dayToIndex[dayName]);

  /**
   * @param {"morning" | "evening"} meal
   */
  const isMealTakenCareOf = (meal) => {
    const staysPositive = arrayDifference(dayData[meal].positive, dayData[meal].pending ?? []);
    const willBePositive = arrayDifference(dayData[meal].pending ?? [], dayData[meal].positive);
    return staysPositive.length || willBePositive.length;
  };

  const dayTakenCareOf = isMealTakenCareOf("morning") && isMealTakenCareOf("evening");
  const color = dayTakenCareOf ? styles.colorGood : styles.colorBad;

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
  const pending = people.pending ?? [];
  const pendingAppending = arrayDifference(pending, people.positive);

  return (
    <View style={styles.peopleColumn}>
      {pendingAppending.map((name) => (
        <PersonBubble key={name} name={name} pending={true} />
      ))}
      {people.positive.map((name) => (
        <PersonBubble key={name} name={name} pending={pending.includes(name)} />
      ))}
    </View>
  );
}

/**
 *
 * @param {{ name: Name, pending: boolean }} props
 */
function PersonBubble({ name, pending }) {
  return (
    <ImageBackground source={personToImage[name]} style={styles.personBubble}>
      <View style={[styles.bubbleOverlay, pending && styles.bubbleOverlayPending]}>
        {pending && <ActivityIndicator color="#ffffff85" size="small" />}
      </View>
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
  bubbleOverlay: {
    flex: 1,
    borderRadius: Number.MAX_SAFE_INTEGER,
    borderWidth: 1.5,
    borderColor: "#676767b3",
  },
  bubbleOverlayPending: {
    backgroundColor: "#8080806e",
    justifyContent: "center",
    alignItems: "center",
  },
});
