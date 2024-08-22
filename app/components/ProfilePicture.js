import { StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import DefaultIcon from "../../assets/icons/ChatIcon3.png";

export default function ProfilePicture({
  source,
  Default = true,
  onPress,
  disabled,
  borderWidth = 1.5,
  size = 38,
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Image
        source={Default ? DefaultIcon : source}
        style={{
          right: 4,
          width: size,
          height: size,
          borderRadius: 30,
          borderWidth: borderWidth,
          borderColor: "#00000052",
        }}
      />
    </TouchableOpacity>
  );
}
