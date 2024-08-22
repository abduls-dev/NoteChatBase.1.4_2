import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DocumentBubble from "./DocumentBubble";
import TipLeft from '../../assets/Components/BubbleTipLeft.png'
import TipRight from '../../assets/Components/TipRight1.png'
import CurrentTime from "./CurrentTime";

const MessageBubble = ({
  message,
  MessageTime,
  onSwap,
  isSender,
  onPress,
  onLongPress,
  Type,
  DocumentTitle,
  DocumentSize,
  DocumentExtension,
  onDocumentPress,
  onDocumentLongPress
}) => {

  // TEXT RENDER
  return Type === "text" ? (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.container, isSender ? styles.right : styles.left]}
      >
        
        <View style={styles.content}>
          <Text style={styles.message} >
            {message}
          </Text>
        </View>
          <Text style={styles.TimeText}>{MessageTime}</Text>
      </TouchableOpacity>
    </>

    // IMAGE RENDER
  ) : Type === "image" ? (
    <View style={{ justifyContent: isSender ? "flex-start" : "flex-end" }}>
      <View style={[{ alignItems: "center" },
          isSender  ? { flexDirection: "row" }  : { flexDirection: "row-reverse" },]}>

        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
          <View style={{ marginBottom: -10 }}>
            <Image
              style={[styles.ImageBorder, { borderColor: isSender ? "white" : "#82a096" },]}
              source={{ uri: message }}
            />
            <Text style={styles.ImageTime}>{MessageTime}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwap} style={styles.SwapButton}>
          <AntDesign name="retweet" size={17} color={"#ffffff"} />
        </TouchableOpacity>
      </View>
    </View>

    // DOCUMENT RENDER
  ) : Type === "document" ? (
      <View  style={[  { alignItems: "center" },  
             isSender  ? { flexDirection: "row" } : { flexDirection: "row-reverse" },]}>
              {/* <Image source={isSender ? TipLeft : TipRight} style={[isSender? { bottom:24, left:10 } : { bottom:24, right:10 }]}/> */}
        <DocumentBubble
          DocumentTime={MessageTime}
          DocumentSize={DocumentSize}
          DocumentTitle={DocumentTitle}
          DocumentExtension={DocumentExtension}
          onPress={onDocumentPress}
          onLongPress={onDocumentLongPress}
          ParentStyle={{ justifyContent: isSender ? "flex-start" : "flex-end" }}
          BubbleColor={isSender ? "white" : "#DCF8C6"}
        />
        <TouchableOpacity onPress={onSwap} style={styles.SwapButton}>
          <AntDesign name="retweet" size={17} color={"#ffffff"} />
        </TouchableOpacity>
      </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "70%",
    marginVertical: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  left: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  right: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  message: {
    fontSize: 16,
  },
  TimeText: {
    fontSize: 10,
    color: "#00000098",
    bottom: 0,
    margin: 0,
    alignSelf:'flex-end'
  },
  content: {
    flexDirection: "row",
  },
  ImageBorder: {
    height: 330,
    width: 260,
    borderRadius: 7,
    borderWidth: 2,
  },
  ImageTime: {
    fontSize: 10,
    color: "#ffffff",
    marginHorizontal: 10,
    bottom: 20,
    backgroundColor: "#00000050",
    paddingHorizontal: 3,
    paddingVertical: 0.5,
    borderRadius: 10,
    alignSelf:'flex-end'
  },
  SwapButton: {
    backgroundColor: "#00000031",
    height: 28,
    width: 28,
    borderRadius: 30,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    // right: 170,
    // top: 50,
  },
});

export default MessageBubble;
