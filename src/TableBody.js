// @ts-check

import { useAtom } from "jotai";
import React from "react";
import RN, { StyleSheet, Text, View, ImageBackground } from "react-native";
import { weekDisplayed } from "./state";
import { advanceDateByDays } from "./utils";
import { format } from "date-fns";

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
  imma: "#ef9696",
  nitsan: "#E0AED0",
  tal: "#76babd",
  ronnie: "#756AB6",
  shahar: "#c5c587",
};

/** @type {Name[]} */
const names = ["imma", "nitsan", "tal", "ronnie", "shahar"];

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
      <View style={styles.row}>
        <DayColumn dayName={dayName} />
        <PeopleColumn positive={dayData.morning.positive} />
        <PeopleColumn positive={dayData.evening.positive} />
      </View>

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
    <View>
      <Text style={styles.dayName}>{dayNameAbbreviation[dayName]}</Text>
      <Text style={styles.date}>{format(date, "MMM d")}</Text>
    </View>
  );
}

// return (
//   <View style={styles.peopleBubblesArea}>
//     {people.positive.map((name) => (
//       <PersonBubble key={`positive:${name}`} name={name} attending={true} />
//     ))}
//     {people.negative.map((name) => (
//       <PersonBubble key={`negative:${name}`} name={name} attending={false} />
//     ))}
//   </View>
// );

/**
 * @param {{ positive: Name[] }} props
 */
function PeopleColumn({ positive }) {
  const circleRadius = 11;

  return (
    <View
      style={{
        width: 2 * circleRadius + 8,
        height: 2 * circleRadius + 8,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {names.map((name, idx) => {
        const angle = 2 * Math.PI * (idx / 5) - Math.PI / 2;
        const translateX = circleRadius * Math.cos(angle);
        const translateY = circleRadius * Math.sin(angle);

        return (
          <Dot
            color={positive.includes(name) ? personToColor[name] : undefined}
            key={idx}
            style={{
              transform: [{ translateX: translateX }, { translateY: translateY }],
              position: "absolute",
            }}
          />
        );
      })}
    </View>
  );
}

/**
 *
 * @param {{ color?: string, style?: RN.StyleProp<RN.ViewStyle> }} props
 */
function Dot({ color = undefined, style = {} }) {
  return <View style={[styles.dot, { backgroundColor: color }, style]} />;
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
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
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
  dayName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
    color: "black,",
  },
  date: {
    fontSize: 12,
    // color: "white"
  },
  dot: {
    width: 10,
    aspectRatio: 1,
    borderColor: "#333333cc",
    borderWidth: 1.5,
    borderRadius: Number.MAX_SAFE_INTEGER,
  },
  personBubble: {
    width: 36,
    height: 36,
    borderRadius: Number.MAX_SAFE_INTEGER,
    overflow: "hidden",
    marginHorizontal: -5,
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
  peopleBubblesArea: {
    flexDirection: "row",
  },
});
