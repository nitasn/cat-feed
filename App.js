// @ts-check

import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import { ImageBackground } from "react-native";
import React from "react";
import Layout from "./src/Layout";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// @ts-ignore
const backgroundImage = require("./assets/street.webp");
// const backgroundImage = require("./assets/background-blur.webp");

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <ImageBackground source={backgroundImage} style={styles.image} resizeMode="stretch">
        <SafeAreaView style={styles.container}>
          <Layout />
        </SafeAreaView>
      </ImageBackground>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // @ts-ignore
  image: {
    flex: 1,
    // web full screen
    ...(Platform.OS === "web" && { position: "absolute", inset: 0, width: "100vw", height: "100vh" }),
  },
});
