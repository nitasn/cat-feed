import { useEffect, useMemo, useRef } from "react";
import { FlatList, StyleSheet } from "react-native";
import BlurContainer, { blurContainerContentOffset } from "./BlurContainer";
import WeekContentGuard from "./WeekContentGuard";
import WeekTableHeader from "./WeekTableHeader";
import { WeekDisplayedContext } from "./state";
import { vw } from "./stuff";
import { State } from "./types-fix";
import { advanceTimestampByDays, timestampFirstDayOfWeek, dateToShortString } from "./utils";
import { isSameDay } from "date-fns";

const _thisWeekStart = timestampFirstDayOfWeek();

const sundays = [
  advanceTimestampByDays(_thisWeekStart, -7),
  _thisWeekStart,
  advanceTimestampByDays(_thisWeekStart, +7),
];

let index = 1;

function keepSundaysPadded() {
  if (index === 0) {
    sundays.unshift(advanceTimestampByDays(sundays[0], -7));
    index = 1;
    return "index changed from 0 to 1";
  }
  if (index === sundays.length - 1) {
    sundays.push(advanceTimestampByDays(sundays[sundays.length - 1], +7));
  }
}

export default function WeekSlideSingleton({ weekTimestampState }: { weekTimestampState: State<number> }) {
  const [weekStart, setWeekStart] = weekTimestampState;
  const flatListRef = useRef<FlatList>(null);

  const firstRender = useRef(true);
  const scrollingByFinger = useRef(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!scrollingByFinger.current) {
      console.log("weekStart changed from outside");

      const oldIndex = index;

      index = sundays.findIndex((w) => isSameDay(w, weekStart));
      keepSundaysPadded();

      if (oldIndex === 1 && index === 1) {
        // console.log("scrolled to the leftmost week, using arrow keys");
        flatListRef.current?.scrollToIndex({ index: 2, animated: false });
      }

      flatListRef.current?.scrollToIndex({ index, animated: true });
    }

    scrollingByFinger.current = false;
  }, [weekStart]);

  return (
    <FlatList
      ref={flatListRef}
      data={sundays}
      renderItem={({ item }) => <WeekCard weekStart={item} />}
      horizontal
      keyExtractor={(timestamp) => timestamp}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      initialScrollIndex={index}
      getItemLayout={(_, index) => ({ index, length: 100 * vw, offset: 100 * vw * index })}
      onScrollBeginDrag={() => {
        if (keepSundaysPadded() === "index changed from 0 to 1") {
          flatListRef.current?.scrollToIndex({ index, animated: false });
        }
      }}
      onMomentumScrollBegin={() => {
        scrollingByFinger.current = true;
      }}
      onMomentumScrollEnd={(e) => {
        index = Math.floor(e.nativeEvent.contentOffset.x / (100 * vw));
        setWeekStart(sundays[index]);
      }}
    />
  );
}

function WeekCard({ weekStart }: { weekStart: Date }) {
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
