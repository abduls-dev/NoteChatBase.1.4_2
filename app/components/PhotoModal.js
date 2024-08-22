import React from "react";
import {
  Modal,
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import cade from "./../../assets/images/cade.jpg";
import ChatIcon from '../../assets/icons/ChatIcon2.png'

const PhotoModal = ({ visible, onClose, ImageSource, Dummy = false, Default = false }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Image
          source={{ uri: ImageSource }}
          resizeMode="contain"
          style={{ width: screenWidth, height: screenHeight }}
        />

        {Dummy ? (
          <Image
            source={cade}
            resizeMode="contain"
            style={{ width: screenWidth, height: screenHeight, bottom:screenHeight/2 }}
          />
        ) : null}

        {Default ? (
          <Image
            source={ChatIcon}
            resizeMode="contain"
            style={{ width: screenWidth, height: screenHeight, bottom:screenHeight/2 }}
          />
        ) : null}

        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: "#000000",
            position: "absolute",
            bottom: 30,
            marginHorizontal: 30,
            borderRadius: 30,
            padding: 10,
          }}
        >
          <Ionicons name="close" color={"white"} size={35} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 25,
    margin: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5, // shadow on Android
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },

  Button: {
    // backgroundColor: "#f4f4f4",
    // padding:5,
    // paddingHorizontal:15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
  },

  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PhotoModal;
