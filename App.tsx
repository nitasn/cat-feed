import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Platform, SafeAreaView, StyleSheet } from "react-native";
import Main from "./src/Main";
import queryClient from "./src/query-client";

// @ts-ignore
import backgroundImage from "./assets/street.webp";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ImageBackground source={backgroundImage} style={styles.image} resizeMode="stretch">
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <Main />
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
  // @ts-ignore
  image: {
    flex: 1,
    // web full screen
    ...(Platform.OS === "web" && { position: "absolute", inset: 0, width: "100vw", height: "100vh" }),
  },
});
