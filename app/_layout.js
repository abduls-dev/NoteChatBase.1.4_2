import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import cade from "../assets/images/cade.jpg";
import ProfilePicture from "./components/ProfilePicture";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";

const _layout = () => {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerTitle: () => (
						<View style={{ margin: 20 }}>
							<Text style={{ fontSize: 20 }}>NoteChat</Text>
						</View>
					),
					headerTitleAlign: "center",
				}}
			/>

			<Stack.Screen
				name="screens/ChatScreens/ProfilePage"
				options={{ headerTitle: "Profile" }}
			/>
			{/* <Stack.Screen
        name="screens/NoteScreens/CreateNote"
        asChild
        options={{
          headerTitle: "Create a Note",
          headerRight: () => (
            <TouchableOpacity>
              <Text style={{ marginRight: 20 }}>Delete</Text>
            </TouchableOpacity>
          ),
        }}
      /> */}
		</Stack>
	);
};

export default _layout;

const styles = StyleSheet.create({});
