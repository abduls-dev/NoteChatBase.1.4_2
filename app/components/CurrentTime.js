import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CurrentTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12; // Convert hours from 24-hour to 12-hour format
    hours = hours ? hours : 12; // If hours is 0, set it to 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Pad minutes with leading zero if necessary
  
    // Construct the time string in AM/PM format
    const currentTime = `${hours}:${formattedMinutes} ${ampm}`;
    return currentTime;
}

export default CurrentTime;

