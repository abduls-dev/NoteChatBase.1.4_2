import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	FlatList,
	Image,
	TouchableOpacity,
	Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Stack, router, useFocusEffect } from "expo-router";
import DeleteModal from "../../components/DeleteModal";
import Plus from "../../components/Plus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import EmptyNotes from "../../components/EmptyNotes";
import FadeInView from "../../components/FadeInView";
import ProfilePicture from "../../components/ProfilePicture";
import cade from "../../../assets/images/cade.jpg";
import DropDown from "../../components/ModalExample";
import { Provider } from "react-native-paper";
import TopRightModal from "../../components/TopRightModal";
import CustomModal from "../../components/CustomModal";
import { TouchableNativeFeedback } from "react-native";
import Divider from "../../components/Divider";

const { height } = Dimensions.get("window");
const minListHeight = height + 1; // Add 1 to ensure it exceeds screen height

const SampleData = [
	{ Title: "Base" },
	{ Title: "Shoryuken!" },
	{ Title: "Photo chat" },
];

const HomeScreen = () => {
	// Core Message STates
	const [Carrier, setCarrier] = useState("");
	const [AllConvos, setAllConvos] = useState([]);
	const [UpdatedConvos, setUpdatedConvos] = useState([]);

	// Extra States
	const [modalVisible, setModalVisible] = useState(false);
	const [menuModal, setMenuModal] = useState(false);
	const [DP, setDP] = useState(cade);
	const [Metadata, setMetadata] = useState([]);

	// Load the saved profile photo URI from AsyncStorage
	useFocusEffect(
		React.useCallback(() => {
			const loadProfileData = async () => {
				try {
					// Load Profile Data and Chat Metadata
					const data = await AsyncStorage.getItem("PFP");
					const metadata = await AsyncStorage.getItem("Metadata");

					// Set Data to loaded Data (if exists)
					if (data) {
						const profileData = JSON.parse(data);
						setDP(profileData.Photo);
					} else {
						setDP(cade);
					}

					// Set Metadata to loaded Metadata (if exists)
					if (metadata) {
						const ParsedData = JSON.parse(metadata);
						setMetadata(ParsedData);
					}
				} catch (error) {
					console.error("Error loading profile data.", error);
				}
			};

			loadProfileData();
		}, [DP])
	);

	// SAVE CONVO FUNCTION
	const SaveAllConvos = async () => {
		if (AllConvos.length > 0) {
			const StringifiedConvos = JSON.stringify(AllConvos);
			await AsyncStorage.setItem("NUM", StringifiedConvos);
			console.log("Saved Entire Array:", StringifiedConvos);
		} else {
			console.log("AllConvos array is empty, not saving anything.");
		}
	};

	// LOAD CONVO FUNCTION
	const LoadAllConvos = async () => {
		try {
			const loadedVal = await AsyncStorage.getItem("NUM");
			const parsedVal = loadedVal ? JSON.parse(loadedVal) : [];

			if (Array.isArray(parsedVal)) {
				if (JSON.stringify(parsedVal) !== JSON.stringify(AllConvos)) {
					setAllConvos(parsedVal);
					console.log("Set NUM Val:", parsedVal);
				}
			} else {
				console.log("Loaded value is not an array:", parsedVal);
				setAllConvos([]);
			}
		} catch (error) {
			console.error("Failed to load value or value is empty:", error);
			setAllConvos([]);
		}
	};

	// ADD NEW CONVERSATION
	useFocusEffect(
		React.useCallback(() => {
			const LoadNewMessages = async () => {
				try {
					const loadedVal = await AsyncStorage.getItem("messageList");
					if (loadedVal !== null && loadedVal !== "[]") {
						setCarrier(JSON.parse(loadedVal));
						await AsyncStorage.setItem("messageList", "[]"); // Clear the "messageList" key
					}
				} catch (error) {
					console.error(
						"Failed to load data from AsyncStorage into Carrier:",
						error
					);
				}
			};

			LoadNewMessages();
		}, [])
	);

	// UPDATE CONVERSATIONS
	useFocusEffect(
		React.useCallback(() => {
			const LoadUpdatedMessages = async () => {
				try {
					const loadedVal = await AsyncStorage.getItem("UPDATE");
					if (loadedVal !== null && loadedVal !== "[]") {
						setUpdatedConvos(JSON.parse(loadedVal));
						await AsyncStorage.setItem("UPDATE", "[]"); // Clear the "UPDATE" key
					}
				} catch (error) {
					console.error(
						"Failed to load data from AsyncStorage into UpdatedConvos:",
						error
					);
				}
			};

			LoadUpdatedMessages();
		}, [])
	);

	// Load Chats on Startup
	useEffect(() => {
		LoadAllConvos();
	}, []);

	// Add New Chat to Array Call
	useEffect(() => {
		const NewMetaData = {
			Title: null,
			Photo: null,
			Wallpaper: null,
		};

		if (Carrier !== "") {
			setAllConvos((prevAllConvos) => [...prevAllConvos, Carrier]);
			setMetadata((Data) => [...Data, NewMetaData]);
			setCarrier(""); // Clear the Carrier state
			SaveAllConvos();
		}
	}, [Carrier]);

	// Update Existing Conversations Call
	useEffect(() => {
		if (UpdatedConvos !== "") {
			setAllConvos(UpdatedConvos);
			setUpdatedConvos(""); // Clear the Carrier state
			SaveAllConvos();
		}
	}, [UpdatedConvos]);

	// Delete Empty Array Call
	useEffect(() => {
		DeleteEmptyArray();
		SaveAllConvos();
	}, [AllConvos]);

	// Delete Note Function
	const DeleteNote = async (index) => {
		const updatedList = [...AllConvos];
		const metadata = [...Metadata];
		updatedList.splice(index, 1);
		metadata.splice(index, 1);
		setAllConvos(updatedList);
		setMetadata(metadata);
		await AsyncStorage.setItem("NUM", JSON.stringify(updatedList));
	};

	// Delete Empty Array Function
	const DeleteEmptyArray = () => {
		AllConvos.forEach((subArray, index) => {
			if (subArray.length === 0) {
				DeleteNote(index);
			}
		});
	};

	// Delete All Chats Function
	const DeleteAllConvos = () => {
		setCarrier([]);
		setAllConvos([]);
		setUpdatedConvos([]);
		setMetadata([]);
		AsyncStorage.setItem("messageList", JSON.stringify([]));
		AsyncStorage.setItem("UPDATE", JSON.stringify([]));
		AsyncStorage.setItem("NUM", JSON.stringify([]));
		AsyncStorage.setItem("Metadata", JSON.stringify([]));
	};

	// Render ITEM function
	const renderItem = ({ item, index }) => {
		const LastItem = item ? item[item.length - 1] : null;
		const LastItemType = LastItem ? LastItem.type : null;

		let content;
		if (LastItemType === "text") {
			content = (
				<Text
					style={{ maxWidth: "80%" }}
					numberOfLines={1}
				>
					{LastItem.content}
				</Text>
			);
		} else if (LastItemType === "image") {
			content = (
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Ionicons
						color={"#909090"}
						name="camera"
						size={17}
						style={{ marginRight: 0 }}
					/>
					<Text> Photo</Text>
				</View>
			);
		} else if (LastItemType === "document") {
			content = (
				<Text style={{ fontWeight: "bold" }}>
					<FontAwesome6 name="file" /> {LastItem.name}
				</Text>
			);
		}

		return (
			LastItemType && (
				<TouchableNativeFeedback
					background={TouchableNativeFeedback.Ripple("#d9e5eb", false)}
					key={index}
					onPress={() => {
						router.push({
							pathname: "screens/ChatScreens/ChatScreen",
							params: { ChatID: index, content: item },
						});
					}}
					onLongPress={() => DeleteNote(index)}
				>
					<View
						style={[
							styles.Item,
							{ flexDirection: "row", alignItems: "center" },
						]}
					>
						<ProfilePicture
							size={50}
							borderWidth={0}
							Default={true}
							disabled={true}
						/>
						<View style={{ flex: 1, marginLeft: 10 }}>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignContent: "center",
									marginBottom: 5,
								}}
							>
								<Text style={{ fontWeight: "bold", fontSize: 18 }}>
									{/* {"Note " + (index + 1)} */}
									{Metadata[index] && Metadata[index].Title
										? Metadata[index].Title
										: "Note " + (index + 1)}
								</Text>
								<Text style={{ fontSize: 10, margin: 2 }}>{LastItem.time}</Text>
							</View>
							{content}
						</View>
						{/* <Divider color="#e1e1e1" /> */}
					</View>
				</TouchableNativeFeedback>
			)
		);
	};

	return (
		<>
			{
				<Stack.Screen
					options={{
						headerRight: () => (
							<DropDown
								DeleteTitle={"Delete All"}
								OnPressDeleteAll={() => setModalVisible(true)}
							/>
						),
						headerLeft: () => (
							<ProfilePicture
								Default={false}
								source={DP === cade ? cade : { uri: DP }}
								onPress={() => router.push("screens/ChatScreens/ProfilePage")}
							/>
						),
					}}
				/>
			}

			{/* DELETE MODAL */}
			<DeleteModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onDelete={() => {
					DeleteAllConvos(), setModalVisible(false);
				}}
			/>

			{/* Chats subtitle */}
			<Text style={styles.subtitle}>Chats</Text>
			<View style={styles.container}>
				<FadeInView duration={800}>
					<View style={{ flexDirection: "row" }}></View>

					{/* Chats */}
					{AllConvos.length > 0 ? (
						<FlatList
							data={AllConvos}
							renderItem={renderItem}
							alwaysBounceVertical={true}
							bounces={true}
						/>
					) : (
						<EmptyNotes />
					)}

					{/* New Chat */}
				</FadeInView>
				<Plus
					Gemini={true}
					onPress={() => router.push("screens/ChatScreens/GeminiChat")}
				/>
				<Plus
					Size={60}
					onPress={() => router.push("screens/ChatScreens/ChatScreen")}
				/>
			</View>
		</>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#eaf2f4",
	},
	Item: {
		justifyContent: "flex-start",
		padding: 15,
		paddingVertical: 13,
		backgroundColor: "#ffffff",
		margin: 2,
		borderRadius: 5,
		width: Dimensions.get("window").width * 0.97,
	},
	subtitle: {
		margin: 3,
		color: "#777777",
		fontSize: 12,
		backgroundColor: "#eaf2f4",
	},
	Load: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		width: 110,
		height: 30,
		marginHorizontal: 5,
		backgroundColor: "#bed0c7",
		borderWidth: 2,
		borderColor: "#82a096",
		borderRadius: 5,
	},
});
