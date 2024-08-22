import React, { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

const ShakeButton = ({ onPress, children }) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const shakeButton = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      <TouchableOpacity onPress={() => { onPress(); shakeButton(); }}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ShakeButton;
