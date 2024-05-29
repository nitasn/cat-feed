import { QueryClientProvider } from "@tanstack/react-query";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Platform, SafeAreaView, StyleSheet } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import backgroundImage from "./assets/splash.png";
import NameGuard from "./src/NameGuard";
import queryClient from "./src/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <ImageBackground source={backgroundImage} style={styles.container} resizeMode="stretch">
        <SafeAreaView style={styles.safeArea}>
          <RootSiblingParent>
            <NameGuard />
          </RootSiblingParent>
        </SafeAreaView>
      </ImageBackground>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: Platform.select({
      android: Constants.statusBarHeight,
      ios: 0,
    }),
  },
});
