import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import Send from "react-native-vector-icons/Entypo";
import { Linking } from "react-native";


import Calendar from "./Calendar";

export default function Dashboard() {
 
  const sendEmail = () => {
    const email = "unateamdev@gmail.com";
    const subject = "Question from the app";
    const body = "Hello, developer!";

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoLink);
  };

  return (
    <View style={styles.container}>
      <Calendar />
     
      <TouchableOpacity
        underlayColor="#6f635b"
        style={styles.buttonContainer}
        onPress={sendEmail}
      >
        <Text style={styles.buttonText}>
          <Send name="mail" size={50} />
        </Text>
        <Text style={styles.descriptionText}>
          if you have any questions, write to us</Text>
      </TouchableOpacity>
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
  buttonContainer: {
    marginTop: 100,
    alignItems: "center",
    margin: 70,
  
  },
  buttonText: {
    color: "#771011",
    fontSize: 20,
    fontFamily: "vidaloka",
    padding: 5,
  },
  ttitleHeart:{
    color: "#771011",

  },

  descriptionText:{
  
      color: "#6f635b",
      fontFamily: "newFont",
      textAlign: "center",
  
  },

});
