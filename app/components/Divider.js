import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = ({ color = "#75a7c0" }) => {
  return <View style={[styles.divider, {backgroundColor:color}]} />;
};

const styles = StyleSheet.create({
  divider: {
    position:'absolute',
    alignSelf:'flex-end',
    height: 1.5,
    width: "85%",
    backgroundColor: '#DDDDDD',
    right:0
  },
});

export default Divider;

// const LoadUpdatedConvos = async () => {
  //   const loadedVal = await AsyncStorage.getItem("UPDATE" || "[]");
  //   const parsedVal = JSON.parse(loadedVal);

  //   if (parsedVal && parsedVal.length !== 0 && parsedVal !== AllConvos) {
  //     setUpdatedConvos(parsedVal);
  //     console.log("Updated Convos:", parsedVal);
  //   } else {
  //     setUpdatedConvos([]);
  //     console.log(
  //       "Convos were undefined, null, empty, or equal to AllConvos:",
  //       parsedVal
  //     );
  //   }
  // };
