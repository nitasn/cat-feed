import { isSameDay } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import { FlatList, StyleSheet } from "react-native";
import BlurContainer, { blurContainerContentOffset } from "./BlurContainer";
import WeekContentGuard from "./WeekContentGuard";
import WeekTableHeader from "./WeekTableHeader";
import { WeekDisplayedContext } from "./state";
import { vw } from "./stuff";
import { State } from "./types-fix";
import { advanceDateByDays, dateFirstDayOfWeek, dateToShortString } from "./utils";

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

  const keepWeeksPadded = () => {
    console.log("keepWeeksPadded");

    if (index === sundays.length - 1) {
      pushWeek();
    }
    if (index === 0) {
      unshiftWeek();
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    }
  };

  const insideScroller = useRef(false);

  useEffect(() => {
    if (insideScroller.current) {
    }

    // const newIndex = sundays.findIndex((w) => isSameDay(w, weekStart));

    // if (index !== newIndex) {
    //   const oldIndex = index;
    //   keepWeeksPadded();
    //   index = sundays.findIndex((w) => isSameDay(w, weekStart));
    //   console.log("scroll from outside | from", oldIndex, "to", index);

    //   flatListRef.current?.scrollToIndex({ index, animated: true });
    //   console.log({ index, outOf: sundays.length });
    // }
  }, [weekStart]);

  return (
    <FlatList
      ref={flatListRef}
      data={sundays}
      renderItem={({ item }) => <WeekCard weekStart={item} />}
      horizontal
      keyExtractor={(date) => date.toISOString()}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      initialScrollIndex={index}
      getItemLayout={(_, index) => ({ index, length: 100 * vw, offset: 100 * vw * index })}
      onScrollBeginDrag={keepWeeksPadded}
      onMomentumScrollEnd={(e) => {
        index = Math.floor(e.nativeEvent.contentOffset.x / (100 * vw));
        insideScroller.current = true;
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
