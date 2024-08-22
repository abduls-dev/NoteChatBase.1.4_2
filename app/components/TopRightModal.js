import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';

const TopRightModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = new Animated.Value(0);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    Animated.timing(scaleValue, {
      toValue: modalVisible ? 0 : 1, // Toggle between 0 and 1
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.trigger}>
          <Text style={styles.triggerText}>Open Modal</Text>
        </View>
      </TouchableOpacity>

      {modalVisible && (
        
        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.modalText}>Modal Content</Text>
          </TouchableOpacity>
        </Animated.View>
        
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trigger: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modal: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
  },
});

export default TopRightModal;
