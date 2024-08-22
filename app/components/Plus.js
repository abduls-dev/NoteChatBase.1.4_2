import React from "react";
import { TouchableOpacity, View, StyleSheet, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GeminiIcon from "../../assets/icons/gemini.png";

const Plus = ({ onPress, Gemini = false, Size = 30 }) => {
  return !Gemini ? (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPress}>
      <View style={[styles.button, { width: Size, height: Size }]}>
        <Ionicons name="add" size={Size - 15} color="white" />
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[styles.container, { bottom: 100, right: 28 }]}
      onPress={onPress}
    >
      <Image source={GeminiIcon} style={{ height: 47, width: 45 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#75a7c0", // You can change the background color
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height:4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 5,
    
  },
});

export default Plus;
