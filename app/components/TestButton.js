import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const TestButton = ({
  Message = "Console Log",
  onPress,
  Send,
  style = styles.Load,
  Size = 15,
}) => {
  return !Send ? (
    <TouchableOpacity style={style} onPress={onPress}>
      <Text>{Message}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[styles.Send, { width: Size, height: Size }]}
      onPress={onPress}
    >
      <Ionicons
        style={{ marginRight: -2 }}
        name="send"
        size={(Size / 2) + 3}
        color={"#ffffff"}
      />
    </TouchableOpacity>
  );
};

export default TestButton;

const styles = StyleSheet.create({
  Load: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 110,
    height: 30,
    marginHorizontal: 5,
    backgroundColor: "#bed0c7",
    borderWidth: 2,
    borderColor: "#82a096",
    borderRadius: 5,
  },
  Send: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: "#00db9a",
    borderWidth: 2,
    borderColor: "#0fc487",
  },
});
