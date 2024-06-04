import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WeekTable } from "./WeekTable";
import { useWeekData } from "./fetcher";
import { rowLTR } from "./stuff";
import { useContext } from "react";
import { WeekDisplayedContext } from "./state";

/**
 * Shows "Loading..." while awaiting week data from server.
 * When resolves, shows week table.
 * If rejected, shows error message.
 */
export default function WeekContentGuard() {
  const { weekKey } = useContext(WeekDisplayedContext);
  const { weekLoading, weekError, weekData } = useWeekData(weekKey);

  if (weekLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#333", fontSize: 16 }}>Loading...</Text>
        <ActivityIndicator color="black" />
      </View>
    );
  }

  if (weekError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: "maroon", fontSize: 16 }}>Cannot connect to server 😕</Text>
        <Text style={{ color: "gray", fontSize: 16 }}>{weekError.message}</Text>
      </View>
    );
  }

  if (weekData) {
    return <WeekTable weekData={weekData} />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: rowLTR,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
