import { StyleSheet, Text, Image, View } from "react-native";
import React from "react";
import nonotes from "../../assets/images/Asset 1.png";

const EmptyNotes = () => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", margin:50 }}>
      <Image
        source={nonotes}
        style={{ opacity: 0.5, height: 200, width: 280 }}
      />
    </View>
  );
};

export default EmptyNotes;

const styles = StyleSheet.create({});
