import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Wine from "react-native-vector-icons/MaterialCommunityIcons";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayBackgroundImage, setDayBackgroundImage] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const calculateWineDaysInYear = (year) => {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    let wineDaysCount = 0;

    for (
      let currentDate = new Date(startOfYear);
      currentDate <= endOfYear;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const isoDateString = currentDate.toISOString();
      const backgroundImage = dayBackgroundImage[isoDateString];

      if (backgroundImage && backgroundImage === require("./wine.png")) {
        wineDaysCount++;
      }
    }

    return wineDaysCount;
  };
  const wineDaysInYear = calculateWineDaysInYear(currentMonth.getFullYear());

  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("backgroundImages");

        if (storedImages) {
          setDayBackgroundImage(JSON.parse(storedImages));
        }

        setImagesLoaded(true);
      } catch (error) {
        console.error("Error loading background images:", error);
      }
    };

    loadBackgroundImages();
  }, []);

  if (!imagesLoaded) {
    return <ActivityIndicator size="large" color="#771011" />;
  }

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthData = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth(month, year); i++) {
      days.push(new Date(year, month, i));
    }

    return { firstDay, lastDay, days };
  };

  const renderDay = (day) => {
    const backgroundImage =
      dayBackgroundImage[day.toISOString()] || require("./wineWithout.png");
    const isWine = backgroundImage === require("./wine.png");

    const dayTextColorStyle = isWine
      ? { color: "#ece6d3" } 
      : { color: "#6f635b" }; 

    return (
      <TouchableOpacity
        key={day.toISOString()}
        onPress={() => handleDayPress(day)}
        style={[styles.dayContainer]}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.dayBackgroundImage}
          onLoad={() => setImagesLoaded(true)}
        >
          <Text style={[styles.dayText, dayTextColorStyle]}>
            {day.getDate()}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const handleDayPress = async (day) => {
    const backgroundImage =
      dayBackgroundImage[day.toISOString()] || require("./wineWithout.png");
    const isWine = backgroundImage === require("./wine.png");

    setDayBackgroundImage((prevImages) => {
      const updatedImages = {
        ...prevImages,
        [day.toISOString()]: isWine
          ? require("./wineWithout.png")
          : require("./wine.png"),
      };

      try {
        AsyncStorage.setItem("backgroundImages", JSON.stringify(updatedImages));
      } catch (error) {
        console.error("Error saving background images:", error);
      }

      return updatedImages;
    });
  };

  const simulateWineDayPress = () => {
    const simulatedDay = new Date();
    const newBackgroundImage = require("./wine.png");
    handleDayPress(simulatedDay, newBackgroundImage);
  };

  const simulateWineWithoutDayPress = () => {
    const simulatedDay = new Date();
    const newBackgroundImage = require("./wineWithout.png");
    handleDayPress(simulatedDay, newBackgroundImage);
  };

  const handleButtonPress = () => {
    simulateWineDayPress();
    simulateWineWithoutDayPress();
    setShowCalendar(true);
  };

  const renderMonth = (monthDate) => {
    const { days } = getMonthData(
      monthDate.getFullYear(),
      monthDate.getMonth()
    );
    const dayOfWeekNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    return (
      <View key={monthDate.toISOString()} style={styles.monthContainer}>
        <Text style={styles.header}>
          {monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
          <Wine name="glass-wine" size={30} />
        </Text>
        <View style={styles.weekContainer}>
          <View style={styles.rowContainer}>
            {dayOfWeekNames.map((dayName, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.dayOfWeekText}>{dayName}</Text>
              </View>
            ))}
          </View>

          {Array.from({ length: 6 }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.rowContainer}>
              {Array.from({ length: 7 }, (_, colIndex) => {
                const dayIndex = rowIndex * 7 + colIndex;
                const day = days[dayIndex];
                return day ? (
                  renderDay(day)
                ) : (
                  <View key={colIndex} style={styles.dayContainer} />
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!showCalendar ? (
        <>
          <View>
            <TouchableOpacity
              underlayColor="#6f635b"
              onPress={handleButtonPress}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>Start</Text>
              <Text style={styles.buttonText}>
                <Wine name="glass-wine" size={40} />
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.titleText}>
              mark in the calendar the days when you enjoyed a glass of wine
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.titleTextHeader}>
            Welcome to the Wine Calendar
          </Text>
          {Array.from({ length: 12 }, (_, index) => {
            const monthDate = new Date(currentMonth.getFullYear(), index);
            return renderMonth(monthDate);
          })}
          <Text style={styles.titleTextFooter}>
            the number of days when you've enjoyed a glass of wine:{" "}
            <Text style={styles.titleTextMark}>{wineDaysInYear}</Text>
          </Text>
        </>
      )}
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontFamily: "vidaloka",
    color: "#6f635b",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    fontFamily: "newFont",
    color: "#221712",
  },
  dayOfWeekText: {
    fontFamily: "newFont",
    color: "#221712",
    margin: 0,
    padding: 0,
    fontSize: 18,
    alignItems: "flex-start",
  },
  dayContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    // borderColor:"red",
    // borderWidth:1,
  },
  dayText: {
    bottom: 15,
    fontFamily: "newFont",
    fontSize: 18,
  },
  footer: {
    height: 100,
  },
  dayBackgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  buttonContainer: {
    backgroundColor: "#771011",
    padding: 10,
    borderRadius: 10,
    marginTop: 100,
    alignItems: "center",
    margin: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#ece6d3",
    fontSize: 20,
    fontFamily: "vidaloka",
    padding: 5,
  },
  titleText: {
    color: "#6f635b",
    fontSize: 30,
    fontFamily: "newFont",
    textAlign: "center",
  },
  titleTextMark: {
    color: "#771011",
  },
  titleTextFooter: {
    color: "#ece6d3",
    fontSize: 20,
    fontFamily: "newFont",
    textAlign: "center",
  },
  titleTextHeader: {
    fontFamily: "newFont",
    color: "#771011",
    textAlign: "center",
    fontSize: 25,
    marginBottom: 20,
  },
});

export default Calendar;
