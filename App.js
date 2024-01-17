import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView } from "react-native";

import Dashboard from "./components/Dashboard";
import * as Font from "expo-font";

const fonts = () =>
  Font.loadAsync({
    vidaloka: require("./assets/fonts/Pacifico-Regular.ttf"),
    newFont: require("./assets/fonts/OverlockSC-Regular.ttf"),
  });

export default function App() {
  const [font, setFont] = useState(false);

  useEffect(() => {
    async function prepare() {
      await fonts();
      setFont(true);
    }

    prepare();
  }, []);

  if (font) {
    return (
      <SafeAreaView style={styles.container}>
        <Dashboard />
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  } else {
    return null;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c0bfb2",
  },
});
