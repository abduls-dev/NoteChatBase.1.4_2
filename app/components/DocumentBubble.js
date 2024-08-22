import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { AntDesign, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import PDFIcon from '../../assets/icons/pdf.png'
import ArchiveIcon from '../../assets/icons/zip.png'
import FileIcon from '../../assets/icons/file.png'
import WordIcon from '../../assets/icons/word.png'
import PowerPointIcon from '../../assets/icons/powerpoint.png'
const DocumentBubble = ({
  onPress,
  onLongPress,
  ItemIndex,
  width = 250,
  DocumentTime,
  DocumentTitle,
  DocumentSize,
  DocumentExtension,
  ParentStyle,
  BubbleColor, 
}) => {
  const convertBytes = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  const renderIcon = (DocumentExtension) => {
    if (DocumentExtension === "application/pdf") {
      // return <AntDesign name="pdffile1" size={38} style={{ marginRight: 3 }} />;
      return <Image source={PDFIcon} style={{ height:36, width:36, marginRight:9 }}/>
    } else if (
      DocumentExtension === "application/vnd.rar" ||
      DocumentExtension === "application/rar"     ||
      DocumentExtension === "application/x-zip-compressed" ||
      DocumentExtension === "application/zip"
    ) {
      return (
        // <FontAwesome5
        //   name="file-archive"
        //   size={38}
        //   style={{ marginRight: 3 }}
        // />
        <Image source={ArchiveIcon} style={{ height:36, width:36, marginRight:9 }}/>
      );
    } else if (
      DocumentExtension === "application/msword" ||
      DocumentExtension ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        // <FontAwesome6 name="file-word" size={33} style={{ marginRight: 9, marginLeft:5 }} />
        <Image source={WordIcon} style={{ height:36, width:36, marginRight:9 }}/>
      );
    } else if (
      DocumentExtension ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return (
        // <FontAwesome6 name="file-powerpoint" size={33} style={{ marginRight: 9, marginLeft:5 }} />
        <Image source={PowerPointIcon} style={{ height:36, width:36, marginRight:9 }}/>
      );
    } else {
      // return <AntDesign name="file1" size={38} style={{ marginRight: 3 }} />;
      return <Image source={FileIcon} style={{ height:35, width:25, marginHorizontal:5, marginRight:10 }}/>
    }
  };

  return (
    <TouchableOpacity key={ItemIndex} onPress={onPress} onLongPress={onLongPress} style={ParentStyle}>
      <View
        style={{
          backgroundColor: BubbleColor,
          padding: 10,
          height: 60,
          width: width,
          margin: 2,
          borderRadius: 5,
          flexDirection: "row",
        }}
      >
        {renderIcon(DocumentExtension)}

        <View style={{ flexDirection: "column", width: "95%",  borderRadius:5 }}>
          <Text
            numberOfLines={1}
            key={ItemIndex}
            style={{ margin: 2, maxWidth: "81%", fontWeight:900 }}
          >
            {DocumentTitle}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",
              margin: 2,
              maxWidth: "80%",
              width: "inherit",
            }}
          >
            <Text style={{ fontSize: 10 }}>{convertBytes(DocumentSize)}</Text>
            {/* <GetTime style={{ fontSize: 10, alignItems: "flex-end" }} /> */}
            <Text style={{ fontSize: 10, alignItems: "flex-end" }}>{DocumentTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentBubble;

const styles = StyleSheet.create({});
