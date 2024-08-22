import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { TouchableNativeFeedback } from "react-native";

const screenWidth = Dimensions.get("window").width;

const PaddedButton = ({ Title, onPress, BarColor="#50cf50", BarVisible=true }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple("#DDDDDD", false)}
      >
        <View style={[styles.PaddingContainer, {backgroundColor:BarVisible ? "#f4f4f4" : "white",}]}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{Title}</Text>
          {BarVisible ? <View style={[styles.GreenBar, {backgroundColor:BarColor}]} /> : null}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default PaddedButton;

const styles = StyleSheet.create({
  PaddingContainer: {
    padding: 20,
    width: screenWidth / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Ensure the container can be used as a reference for absolute positioning
  },
  GreenBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "#50cf50",
  },
});
