import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Platform, SafeAreaView, StyleSheet } from "react-native";
import NameGuard from "./NameGuard";
import queryClient from "./query-client";
import backgroundImage from "../assets/splash.png";

// import { forceAppHorizontalDirection } from "./debug-utils";
// forceAppHorizontalDirection("rtl");

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <ImageBackground source={backgroundImage} style={styles.image} resizeMode="stretch">
        <SafeAreaView style={styles.container}>
          <NameGuard />
        </SafeAreaView>
      </ImageBackground>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.select({
      android: 22, // apprx. status bar
      default: 0,
    }),
  },
  image: {
    flex: 1,
    // web full screen
    ...(Platform.OS === "web" && {
      position: "absolute",
      inset: 0,
      width: "100dvw" as unknown as number,
      height: "100dvh" as unknown as number,
    }),
  },
});
