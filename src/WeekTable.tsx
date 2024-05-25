import { format } from "date-fns";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import type { GestureResponderEvent } from "react-native";
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import FixedColumns from "./FixedColumns";
import { toggleMyself } from "./fetcher";
import { nameAtom, weekDisplayedDateAtom, weekKeyAtom } from "./state";
import type { DayData, DayName, MealName, Name, WeekData } from "./types";
import { days } from "./types";
import { advanceDateByDays, arrayWithout } from "./utils";
import { blurContainerContentOffset } from "./BlurContainer";
import { dropShadow, personToImage } from "./stuff";

export function WeekTable({ weekData }: { weekData: WeekData }) {
  return (
    <View style={styles.container}>
      {Object.entries(weekData).map(([dayName, dayData]) => (
        <Row key={dayName} dayName={dayName} dayData={dayData} />
      ))}
    </View>
  );
}

const dayNameAbbreviation: Record<DayName, string> = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

const dayToIndex = Object.fromEntries(days.map((dayName, index) => [dayName, index])) as Record<
  DayName,
  number
>;

export const mealsColor = {
  morning: "#bc8e56",
  evening: "#808080",
};

export const columnWidths = ["16%", "42%", "42%"] as `${number}%`[];

const columnWeights = columnWidths.map((value) => +value.substring(0, value.length - 1) / 100);

function Row({ dayName, dayData }: { dayName: DayName; dayData: DayData }) {
  const weekKey = useAtomValue(weekKeyAtom);
  const widthRef = useRef(0);

  const onPress = (event: GestureResponderEvent) => {
    const offset = blurContainerContentOffset; // TODO get offset dynamically
    const normalizedX = (event.nativeEvent.pageX - offset) / widthRef.current;
    const spill = 0.1;
    if (normalizedX < columnWeights[0] + spill) {
      // day column was pressed (ignored for now)
    } else if (normalizedX < columnWeights[0] + columnWeights[1] + spill) {
      toggleMyself(`${weekKey}.${dayName}.morning`);
    } else {
      toggleMyself(`${weekKey}.${dayName}.evening`);
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
          <DateColumn dayData={dayData} dayName={dayName} />
          <MealColumn dayData={dayData} mealName="morning" />
          <MealColumn dayData={dayData} mealName="evening" />
        </FixedColumns>
      </Pressable>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

function DateColumn({ dayData, dayName }: { dayName: DayName; dayData: DayData }) {
  const name = useAtomValue(nameAtom);
  const dateWeekStarts = useAtomValue(weekDisplayedDateAtom);

  const isMealTakenCareOf = (meal: MealName) => {
    const { pendingChange } = dayData[meal];

    const staysPositive =
      pendingChange === "negative" ? arrayWithout(dayData[meal].positive, name) : dayData[meal].positive;

    return staysPositive.length || pendingChange === "positive";
  };

  const dayTakenCareOf = isMealTakenCareOf("morning") && isMealTakenCareOf("evening");
  const color = dayTakenCareOf ? styles.colorGood : styles.colorBad;

  return (
    <View style={styles.dayColumn}>
      <Text style={[styles.dayName, color]}>{dayNameAbbreviation[dayName]}</Text>
      <Text style={[styles.date, color]}>
        {format(advanceDateByDays(dateWeekStarts, dayToIndex[dayName]), "MMM d")}
      </Text>
    </View>
  );
}

function MealColumn({ dayData, mealName }: { dayData: DayData; mealName: MealName }) {
  const myName = useAtomValue(nameAtom);
  const { pendingChange } = dayData[mealName];

  return (
    <View style={styles.peopleColumn}>
      {pendingChange === "positive" && (
        <PersonBubble key={myName} name={myName} mealName={mealName} pending={true} />
      )}
      {dayData[mealName].positive.map((name) => (
        <PersonBubble
          key={name}
          name={name}
          mealName={mealName}
          pending={name === myName && pendingChange === "negative"}
        />
      ))}
    </View>
  );
}

function PersonBubble({ name, pending, mealName }: { name: Name; pending: boolean; mealName: MealName }) {
  const style = [
    styles.bubbleOverlay,
    pending && styles.bubbleOverlayPending,
    // { borderColor: mealsColor[mealName] }
  ];

  return (
    <View style={dropShadow}>
      <ImageBackground source={personToImage[name]} style={styles.personBubble}>
        <View style={style}>{pending && <ActivityIndicator color="#ffffff85" size="small" />}</View>
      </ImageBackground>
    </View>
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
