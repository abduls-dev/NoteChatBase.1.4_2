import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import Send from "../../assets/images/Send.png";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ShakeButton from "./ShakeAnimation";

const MessageField = ({
  onSend,
  messageValue,
  onChangeText,
  AttachmentButton = false,
  PhotoButton = true,
  AttachFunction,
  PhotoFunction,
}) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // Here you can implement the logic to send the message
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={messageValue}
        onChangeText={onChangeText}
        style={[styles.Input]}
        placeholder="Type your message here..."
        multiline={true}
        // onSubmitEditing={onSend}
      ></TextInput>
      {AttachmentButton ? (
        <TouchableOpacity
          style={{ position: "absolute", right: 108 }}
          onPress={AttachFunction}
        >
          <Ionicons name="attach" size={28} />
        </TouchableOpacity>
      ) : null}

      {PhotoButton ? (
        <TouchableOpacity
          style={{ position: "absolute", right: 75 }}
          onPress={PhotoFunction}
        >
          <MaterialIcons name="camera-alt" color={"#000000"} size={25} />
        </TouchableOpacity>
      ) : null}

      {messageValue === "" ? (
        <ShakeButton onPress={onSend}>
          <Image source={Send} style={{ height: 51.5, width: 51 }} />
        </ShakeButton>
      ) : (
        <TouchableOpacity onPress={onSend}>
          <Image source={Send} style={{ height: 51.5, width: 51 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "#dddddd",
    backgroundColor: "inherit",
    paddingTop: 0,
  },

  Input: {
    borderColor: "#1a2b3c",
    borderWidth: 2,
    padding: 10,
    paddingVertical: 8,
    borderRadius: 30,
    flex: 1,
    marginRight: 8,
    paddingRight: 75,
    maxHeight: 120,
  },

  button: {
    backgroundColor: "#128C7E",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 30,
  },

  //   input: {
  //     flex: 1,
  //     borderWidth: 2,
  //     borderColor: '#b9b9b9',
  //     borderRadius: 30,
  //     paddingHorizontal: 15,
  //     marginRight: 10,
  //     maxHeight: 150,
  //     justifyContent: 'center',
  //     alignItems: 'center'
  //   },
});

export default MessageField;
