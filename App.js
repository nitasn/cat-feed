import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";
import { ImageBackground } from "react-native";

import TableOfWeek from "./src/TableOfWeek";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <ImageBackground source={require("./assets/background-blur.webp")} style={styles.image}>
        <SafeAreaView style={styles.container}>
          <TableOfWeek />
        </SafeAreaView>
      </ImageBackground>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
