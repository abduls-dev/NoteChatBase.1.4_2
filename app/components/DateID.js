import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DateBasedID = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const miliseconds = currentDate.getMilliseconds();
  
    // Concatenate all parts into a single number
    const concatenatedNumber = `${year}${month}${day}${hours}${minutes}${seconds}${miliseconds}`;
  
    // Ensure it's a four-digit number by using modulus operator
    const fourDigitNumber = parseInt(concatenatedNumber) % 10000;
  
    return fourDigitNumber;
}

export default DateBasedID

const styles = StyleSheet.create({})