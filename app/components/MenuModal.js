import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Menu, Provider as PaperProvider } from "react-native-paper";
import { FontAwesome6 } from "@expo/vector-icons";
import { GlobalStyles } from "./GlobalStyles";
import TestButton from "./TestButton";

const ActiveColor = GlobalStyles.Icons.ActiveColor;
const DisabledColor = GlobalStyles.Icons.DisabledColor;

export default function MenuScreen({
  onDeletePress,
  onDismiss,
  visible = false,
  Anchor = <TestButton />,
  ButtonDisabled = true,
}) {
  return (
    <PaperProvider>
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        anchor={Anchor}
        contentStyle={{ backgroundColor: "#f0f0f0", bottom: 20 }} // Change background color of menu items here
      >
        <Menu.Item
          onPress={() => {
            onDeletePress();
          }}
          title="Delete"
          icon={({ color, size }) => (
            <FontAwesome6
              name="trash"
              size={size}
              color={color}
              style={{ marginRight: 0, top: 3 }}
            />
          )}
        />
        <Menu.Item
          onPress={() => {}}
          title="Settings"
          disabled={ButtonDisabled}
          icon={({ color, size }) => (
            <FontAwesome6
              name="wrench"
              size={size}
              color={ButtonDisabled ? DisabledColor : ActiveColor}
              style={{ marginRight: 0, top: 3 }}
            />
          )}
        />
      </Menu>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
