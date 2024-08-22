import {
	Dimensions,
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState, useEffect } from "react";
import Plus from "./components/Plus";
import { Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import nonotes from "../assets/images/Asset 1.png";
import DeleteModal from "./components/DeleteModal";

const Home = () => {
	const [NoteList, setNoteList] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		getNotes();
	}, []);

	const getNotes = async () => {
		try {
			const loadedVal = await AsyncStorage.getItem("NOTES" || "[]");
			const parsedVal = JSON.parse(loadedVal);
			setNoteList(parsedVal);
		} catch (e) {
			console.log("Unable to Load Value");
		}
	};

	const DeleteAll = async () => {
		setNoteList([]);
		AsyncStorage.setItem("NOTES", JSON.stringify([]));
	};

	const DeleteNote = async (index) => {
		const updatedList = [...NoteList]; // Create a shallow copy of the original array
		updatedList.splice(index, 1); // Remove the item at the specified index
		setNoteList(updatedList); // Update state with the modified array
		await AsyncStorage.setItem("NOTES", JSON.stringify(updatedList)); // Update AsyncStorage as well
	};

	const renderItem = ({ item, index }) => {
		return (
			<TouchableOpacity
				key={index}
				style={styles.Item}
				// onPress={() => {router.push("screens/Note", { singleNote: item } )}}
				onPress={() => {
					router.push({
						pathname: "screens/NoteScreens/OpenedNote",
						params: { NoteID: index, content: item },
					});
				}}
				onLongPress={() => DeleteNote(index)}
			>
				<Text style={{ fontWeight: "bold" }}>{"Note " + (index + 1)}</Text>
				<Text numberOfLines={1}>{item}</Text>
			</TouchableOpacity>
		);
	};

	return (
		// Stack Delete Button
		<>
			{
				<Stack.Screen
					options={{
						headerRight: () => (
							<TouchableOpacity onPress={() => setModalVisible(true)}>
								<Text style={{ marginRight: 10 }}>Delete</Text>
							</TouchableOpacity>
						),
					}}
				/>
			}

			{/* DELETE MODAL */}
			<DeleteModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onDelete={() => {
					DeleteAll(), setModalVisible(false);
				}}
			/>

			{/* Chats subtitle */}
			<Text style={styles.subtitle}>Chats</Text>
			<View style={styles.container}>
				{NoteList.length == 0 ? (
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<Image
							style={{ opacity: 0.5, height: 150, width: 200 }}
							source={nonotes}
						/>
					</View>
				) : null}

				{/* Main Chats List */}

				<FlatList
					data={NoteList}
					renderItem={renderItem}
				/>

				{/* PLUS Button */}
				{/* <Plus onPress={() => router.push("screens/NoteScreens/CreateNote")} /> */}
				<Plus
					onPress={() => router.push("screens/ChatScreens/MainChatScreen")}
				/>
			</View>
		</>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	Item: {
		justifyContent: "flex-start",
		padding: 10,
		backgroundColor: "#e0e0e0",
		margin: 2,
		borderRadius: 5,
		width: Dimensions.get("window").width * 0.97,
	},
	subtitle: { margin: 3, color: "#777777", fontSize: 12 },
});
