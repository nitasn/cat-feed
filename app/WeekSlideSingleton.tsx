import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, FlatList, StyleSheet, View } from "react-native";
import BlurContainer, { blurContainerContentOffset } from "./BlurContainer";
import WeekContentGuard from "./WeekContentGuard";
import WeekTableHeader from "./WeekTableHeader";
import { WeekDisplayedContext } from "./state";
import { State } from "./types-fix";
import { advanceDateByDays, dateFirstDayOfWeek, dateToShortString } from "./utils";
import { vw } from "./stuff";
import { isSameDay } from "date-fns";

const _thisWeekStart = dateFirstDayOfWeek();
const sundays = [advanceDateByDays(_thisWeekStart, -7), _thisWeekStart, advanceDateByDays(_thisWeekStart, +7)];
let index = 1;

function pushWeek() {
  sundays.push(advanceDateByDays(sundays[sundays.length - 1], +7));
}

function unshiftWeek() {
  sundays.unshift(advanceDateByDays(sundays[0], -7));
}

export default function WeekSlideSingleton({ weekStartState }: { weekStartState: State<Date> }) {
  const [weekStart, setWeekStart] = weekStartState;
  const flatListRef = useRef<FlatList>(null);

  const addWeekIfNeeded = () => {
    if (index === sundays.length - 1) {
      pushWeek();
    }
    if (index === 0) {
      unshiftWeek();
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }
  };

  useEffect(() => {
    index = sundays.findIndex((w) => isSameDay(w, weekStart));
    flatListRef.current?.scrollToIndex({ index, animated: true });
    addWeekIfNeeded();
  }, [weekStart]);

  return (
    <FlatList
      ref={flatListRef}
      data={sundays}
      renderItem={({ item }) => <SlidingWeek weekStart={item} />}
      horizontal
      keyExtractor={(date) => date.toISOString()}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      initialScrollIndex={1}
      getItemLayout={(_, index) => ({
        index,
        length: 100 * vw,
        offset: 100 * vw * index,
      })}
      onScrollBeginDrag={(e) => {
        index = Math.floor(e.nativeEvent.contentOffset.x / (100 * vw));
        addWeekIfNeeded();
      }}
      onMomentumScrollEnd={(e) => {
        index = Math.floor(e.nativeEvent.contentOffset.x / (100 * vw));
        console.log("onMomentumScrollEnd to index", index);
        setWeekStart(sundays[index]);
      }}
    />
  );
}

function SlidingWeek({ weekStart }: { weekStart: Date }) {
  const provided = useMemo(() => {
    return {
      dateWeekStarts: weekStart,
      weekKey: dateToShortString(weekStart),
    };
  }, [weekStart]);

  return (
    <WeekDisplayedContext.Provider value={provided}>
      <BlurContainer componentAbove={<WeekTableHeader />} style={styles.week}>
        <WeekContentGuard />
      </BlurContainer>
    </WeekDisplayedContext.Provider>
  );
}

const styles = StyleSheet.create({
  week: {
    width: 100 * vw - blurContainerContentOffset,
  },
});
