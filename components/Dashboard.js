import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";

import Calendar from "./Calendar";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Calendar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#c0bfb2",
    flexGrow: 1,
    fontFamily: "vidaloka",
    textAlign: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    padding: 20,
    borderRadius: 20,
  },
  buttonText: {
    textAlign: "center",
  },
});
