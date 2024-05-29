import { format, startOfDay } from "date-fns";
import { useAtomValue } from "jotai";
import { createContext, useContext, useRef } from "react";
import type { GestureResponderEvent } from "react-native";
import { ActivityIndicator, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { blurContainerContentOffset } from "./BlurContainer";
import FixedColumns from "./FixedColumns";
import { toggleMyself } from "./fetcher";
import { nameAtom, weekDisplayedDateAtom, weekKeyAtom } from "./state";
import { dropShadow, personToGrayScaleImage, personToImage, rowLTR } from "./stuff";
import type { DayData, DayName, MealName, Name, WeekData } from "./types";
import { days } from "./types";
import { advanceDateByDays, arrayWithout, atRoundHour, shortStringToDate } from "./utils";

// @ts-ignore (no value initialized)
const RowDateContext = createContext<{ date: Date; isPast: boolean }>();

function toast(message: string) {
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 100,
    shadowColor: "#36363669",
    containerStyle: {
      padding: 10,
      paddingHorizontal: 20,
      backgroundColor: "#54545adc",
      borderRadius: Number.MAX_SAFE_INTEGER,
      transform: [{ translateY: 12 }],
    },
  });
}

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

/** Afternoon == 15:00 */
function pastTodaysAfternoon(date: Date) {
  return +atRoundHour(date, 15) < Date.now();
}

function onMealPress(weekKey: string, dayName: DayName, mealName: MealName) {
  const mealDateTime = advanceDateByDays(shortStringToDate(weekKey), dayToIndex[dayName]);

  if (mealDateTime < startOfDay(Date.now())) {
    return toast("Can't change the past 🐼");
  }

  if (mealName === "morning" && pastTodaysAfternoon(mealDateTime)) {
    return toast("Morning's ended at 15:00 😜");
  }

  toggleMyself(`${weekKey}.${dayName}.${mealName}`);
}

function Row({ dayName, dayData }: { dayName: DayName; dayData: DayData }) {
  const weekKey = useAtomValue(weekKeyAtom);
  const widthRef = useRef(0);

  const dateWeekStarts = useAtomValue(weekDisplayedDateAtom);
  const date = advanceDateByDays(dateWeekStarts, dayToIndex[dayName]);
  const isPast = date < startOfDay(Date.now());

  const onPress = (event: GestureResponderEvent) => {
    const offset = blurContainerContentOffset; // todo get offset dynamically
    const normalizedX = (event.nativeEvent.pageX - offset) / widthRef.current;
    const spill = 0.1;
    if (normalizedX < columnWeights[0] + spill) {
      // day column was pressed (ignored for now)
    } else if (normalizedX < columnWeights[0] + columnWeights[1] + spill) {
      onMealPress(weekKey, dayName, "morning");
    } else {
      onMealPress(weekKey, dayName, "evening");
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
        <RowDateContext.Provider value={{ date, isPast }}>
          <FixedColumns widths={columnWidths} style={styles.row}>
            <DateColumn dayData={dayData} dayName={dayName} />
            <MealColumn dayData={dayData} mealName="morning" />
            <MealColumn dayData={dayData} mealName="evening" />
          </FixedColumns>
        </RowDateContext.Provider>
      </Pressable>

      {dayName !== "saturday" && <Hr />}
    </>
  );
}

function DateColumn({ dayData, dayName }: { dayName: DayName; dayData: DayData }) {
  const name = useAtomValue(nameAtom);
  const { date, isPast } = useContext(RowDateContext);

  const isMealTakenCareOf = (meal: MealName) => {
    const { pendingChange } = dayData[meal];

    const staysPositive =
      pendingChange === "negative" ? arrayWithout(dayData[meal].positive, name) : dayData[meal].positive;

    return staysPositive.length || pendingChange === "positive";
  };

  const color = isPast
    ? styles.colorPast
    : isMealTakenCareOf("morning") && isMealTakenCareOf("evening")
    ? styles.colorGood
    : styles.colorBad;

  return (
    <View style={styles.dayColumn}>
      <Text style={[styles.dayName, color]}>{dayNameAbbreviation[dayName]}</Text>
      <Text style={[styles.date, color]}>{format(date, "MMM d")}</Text>
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
      {[...dayData[mealName].positive].reverse().map((name) => (
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
  const { date, isPast } = useContext(RowDateContext);

  const disabled = isPast || (mealName === "morning" && pastTodaysAfternoon(date));
  const images = disabled ? personToGrayScaleImage : personToImage;

  return (
    <View style={dropShadow}>
      <ImageBackground
        source={images[name]}
        style={[
          styles.personBubble,
          // disabled && { opacity: 0.65 }
        ]}
      >
        <View style={[styles.bubbleOverlay, pending && styles.bubbleOverlayPending]}>
          {pending && <ActivityIndicator color="#ffffff85" size="small" />}
        </View>
      </ImageBackground>
    </View>
  );
}

function Hr() {
  return <View style={styles.hr} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  row: {
    padding: 8, // todo container padding... prev file
    alignItems: "center",
  },
  hr: {
    backgroundColor: "#33333322",
    width: "100%",
    height: 1,
  },
  dayColumn: {},
  dayName: {
    fontSize: 16,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  colorBad: {
    color: "#5b0606",
  },
  colorGood: {
    color: "#005959",
  },
  colorPast: {
    color: "#484848a0",
  },
  peopleColumn: {
    flexDirection: rowLTR,
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
