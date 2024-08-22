import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Text,
  TouchableNativeFeedback,
  Platform,
} from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { router } from "expo-router";

const DropDown = ({
  DeleteTitle,
  OnPressDeleteAll,
  SettingsVisibility = true,
  MediaVisibility,
  OnPressMedia,
  option,
  AnimationSpeed = 250,
}) => {
  const [visible, setVisible] = useState(false);
  // const scaleX = useRef(new Animated.Value(0)).current;
  const scaleY = useRef(new Animated.Value(0)).current;

  const Duration = AnimationSpeed;

  useEffect(() => {
    if (visible) {
      // Animated.timing(scaleX, {
      //   toValue: 1,
      //   duration: Duration,
      //   useNativeDriver: true,
      // }).start();
      Animated.timing(scaleY, {
        toValue: 1,
        duration: Duration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const openMenu = () => setVisible(true);

  const closeMenu = () => {
    Animated.parallel([
      // Animated.timing(scaleX, {
      //   toValue: 0,
      //   duration: Duration - 150,
      //   useNativeDriver: true,
      // }),
      Animated.timing(scaleY, {
        toValue: 0,
        duration: Duration <= 200 ? Duration : Duration - 150,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  // Options
  const menuItems = [
    {
      title: DeleteTitle,
      visible: true,
      disabled: false,
      icon: (
        <MaterialIcons
          name="delete-outline"
          size={20}
          color="#576d7b"
          style={{ marginRight: 12, top: 1 }}
        />
      ),
      action: OnPressDeleteAll,
    },
    {
      title: "Settings",
      visible: SettingsVisibility,
      disabled: true,
      icon: (
        <Feather
          name="edit"
          size={16}
          color={"#576d7b"}
          style={{ marginRight: 14, marginLeft:2, top: 1, }}
        />
      ),
      action: () => Alert.alert("Action :", "Forward"),
    },
    {
      title: "Media",
      visible: MediaVisibility,
      disabled: false,
      icon: (
        <MaterialCommunityIcons
          name="cube-outline"
          size={20}
          color={"#576d7b"}
          style={{ marginRight: 10, top: 1 }}
        />
      ),
      action: OnPressMedia
    },
  ];

  const renderMenuItem = (item, index) => {
    const onPressHandler = () => {
      item.action();
      closeMenu();
    };

    if (Platform.OS === "android") {
      return item.visible ? (
        <TouchableNativeFeedback
          key={index}
          onPress={item.disabled ? null : onPressHandler}
          background={TouchableNativeFeedback.Ripple("#DDDDDD", false)}
        >
          <View style={styles.menuItem}>
            {item.icon}
            <Text
              style={[
                styles.menuItemText,
                { color: item.disabled ? "#afafaf" : "#000000" },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableNativeFeedback>
      ) : null;
    } else {
      return (
        <TouchableOpacity
          key={index}
          onPress={item.disabled ? null : onPressHandler}
        >
          <View style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity onPress={openMenu}>
        <Entypo name="dots-two-vertical" size={20} color="#576d7b" />
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="none"
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={[styles.modalOverlay]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      // { scaleX },
                      { scaleY },
                    ],
                  },
                  styles.shadow, // Apply shadow styles here
                ]}
              >
                {menuItems.map((item, index) => renderMenuItem(item, index))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.088)',
  },
  modalContent: {
    position: "absolute",
    top: 60, // Adjust to position in the top-right corner
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "flex-start",
    // Set transform origin to top right corner
    transformOrigin: "top right",
  },
  menuItem: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 17,
    paddingRight: 25,
    width: "100%",
    flexDirection: "row",
  },
  menuItemText: {
    fontSize: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.24,
    shadowRadius: 13.84,
    elevation: 17, // Ensure this is high enough to see the shadow on Android
  },
});
