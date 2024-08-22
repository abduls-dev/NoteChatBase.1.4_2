import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Assuming you're using Expo for vector icons
import { GlobalStyles } from "./../components/GlobalStyles";
import FadeInView from "./FadeInView";

const ActiveColor = GlobalStyles.Icons.ActiveColor;
const DisabledColor = GlobalStyles.Icons.DisabledColor;

const EditableBioSection = ({ width, value = "Title", onChangeText, Fade }) => {
  const [editingBio, setEditingBio] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEditPress = () => {
    if (editingBio) {
      setEditingBio(false);
      onChangeText(editedValue); // Call onChangeText with edited value
    } else {
      setEditingBio(true);
    }
  };

  const handleTextChange = (text) => {
    setEditedValue(text); // Update edited value
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: width,
      }}
    >
      {editingBio ? (
        <TextInput
          style={{ fontSize: 20, flex: 1, top: 3 }}
          value={editedValue}
          onChangeText={handleTextChange}
          onSubmitEditing={handleEditPress} // Call handleEditPress when submitting
          onBlur={handleEditPress}
          autoFocus
        />
      ) : Fade ? (
        <FadeInView>
          <Text style={{ fontSize: 20, flex: 1 }}>{value}</Text>
        </FadeInView>
      ) : (
        <Text style={{ fontSize: 20, flex: 1 }}>{value}</Text>
      )}
      <TouchableOpacity onPress={handleEditPress}>
        <MaterialCommunityIcons
          name="pencil"
          size={20}
          color={editingBio ? DisabledColor : ActiveColor} // Use disabled color when editing
          style={{ marginLeft: 5, bottom: 3 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default EditableBioSection;

const styles = StyleSheet.create({});
