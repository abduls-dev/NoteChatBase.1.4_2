import React, { useState } from "react";
import {
  View,
  Modal,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { Button, Menu, Provider as PaperProvider } from "react-native-paper";

export default function CustomModal({ visible, onClose }) {
  const [menuItems] = useState([
    {
      id: 1,
      title: "Option 1",
      onPress: () => console.log("Option 1 pressed"),
    },
    {
      id: 2,
      title: "Option 2",
      onPress: () => console.log("Option 2 pressed"),
    },
    // Add more menu items as needed
  ]);

  const handleMenuItemPress = (onPress) => {
    onPress();
    onClose(); // Close the modal after selecting a menu item
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
      
    >
      <Pressable style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {menuItems.map((item) => (
            <TouchableNativeFeedback
              key={item.id}
              onPress={() => handleMenuItemPress(item.onPress)}
              background={TouchableNativeFeedback.Ripple('#ddd', true)}
            >
              <View style={styles.menuItem}>
                <Text>{item.title}</Text>
              </View>
            </TouchableNativeFeedback>
          ))}

        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start", // Align modal content to the bottom
    alignItems: "flex-end", // Align modal content to the right
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    margin: 20, // Add margin for the modal content
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
