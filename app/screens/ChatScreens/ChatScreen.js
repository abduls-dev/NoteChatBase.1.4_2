import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Keyboard,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MessageField from "../../components/MessageField";
import MessageBubble from "../../components/MessageBubble";
import DeleteModal from "../../components/DeleteModal";
import { Stack, router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import PhotoModal from "../../components/PhotoModal";
import TestButton from "../../components/TestButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateBasedID from "../../components/DateID";
import CurrentTime from "../../components/CurrentTime";
import FadeInView from "../../components/FadeInView";
import DropDown from "../../components/ModalExample";
import ProfilePicture from "../../components/ProfilePicture";

const ChatScreen = () => {
	// Core States
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [selectedImage, setSelectedImage] = useState("");

	// Modal States
	const [modalVisible, setModalVisible] = useState(false);
	const [PicModal, setPicModal] = useState(false);

	// Chat States
	const [Chat, setChat] = useState([]);

	useEffect(() => {
		if (ChatID) {
			getMessages();
		}
	}, []);

	const params = useLocalSearchParams();
	const { ChatID } = params;

	// GetMessages Function
	const getMessages = async () => {
		try {
			const loadedMessages = await AsyncStorage.getItem("NUM");
			const parsedMessages = JSON.parse(loadedMessages);
			const FetchedMessages = parsedMessages[ChatID]; // Ensure FetchedMessages is always an array
			setMessages(FetchedMessages);
		} catch (error) {
			console.log("Error loading messages");
		}
	};

	// Save Updated Conversation
	const CurrentConvoSave = async () => {
		const loadedMessages = (await AsyncStorage.getItem("NUM")) || "[]";
		const parsedMessages = JSON.parse(loadedMessages);
		console.log("Loaded Conversations:", parsedMessages);
		parsedMessages[ChatID] = messages;
		const JSONValue = JSON.stringify(parsedMessages);
		await AsyncStorage.setItem("UPDATE", JSONValue);
		console.log("Total Array after saving:", JSONValue);
	};

	// Save New as New Conversation
	const saveMessages = async () => {
		try {
			const JSONValue = JSON.stringify(messages);
			await AsyncStorage.setItem("messageList", JSONValue);
			console.log("Saved Current convo:", JSONValue);
		} catch (error) {
			console.warn("Failed to save value");
			Alert.alert("Save Failure", "Failed to save the messages.");
		}
	};

	useEffect(() => {
		if (ChatID) {
			CurrentConvoSave();
		} else {
			saveMessages();
		}
	}, [messages]);

	// OnTouch Send Function
	const HandleSend = async () => {
		// Make it async to wait for saving
		const newMessage = {
			ID: DateBasedID(),
			type: "text",
			isSender: false,
			content: message.trim(),
			time: CurrentTime(),
		};

		if (newMessage.content.trim() !== "") {
			const AppendedValue = [...messages, newMessage];
			setMessages(AppendedValue);
			setMessage("");
			Keyboard.dismiss();
		}
	};

	// Pick Image
	const PickImage = async () => {
		try {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();

			if (status !== "granted") {
				Alert.alert("Permission denied.");
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({});

			if (result.canceled) {
				console.log("Image picker cancelled");
				return;
			}

			if (result.assets && result.assets.length > 0) {
				const newImage = {
					ID: DateBasedID(),
					type: "image",
					isSender: false,
					content: result.assets[0].uri,
					time: CurrentTime(),
				};

				console.log(result.assets[0].uri);
				setMessages((prev) => [...prev, newImage]);
			} else {
				console.log("No image selected");
			}
		} catch (error) {
			console.error("Error picking image:", error);
		}
	};

	// Pick Document
	const pickDocument = async () => {
		try {
			const document = await DocumentPicker.getDocumentAsync({
				type: "application/*",
			});

			if (!document.canceled) {
				const newDoc = {
					ID: DateBasedID(),
					type: "document",
					isSender: false,
					name: document.assets[0].name,
					size: document.assets[0].size,
					content: document.assets[0].uri,
					extension: document.assets[0].mimeType,
					time: CurrentTime(),
				};
				setMessages((prev) => [...prev, newDoc]);
				console.log(newDoc);
			}
		} catch (error) {
			Alert.alert("Error", "Failed to pick document.");
			console.log(error);
		}
	};

	// Open Document
	const openPDF = async (pdfUri) => {
		try {
			const cUri = await FileSystem.getContentUriAsync(pdfUri);
			await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
				data: cUri,
				flags: 1,
			});
		} catch (e) {
			console.log(e.message);
		}
	};

	// Position Function
	const toggleSender = (index) => {
		const MessagesCopy = [...messages]; // Make a copy of the messages array
		MessagesCopy[index].isSender = !MessagesCopy[index].isSender; // Toggle the isSender property of the message object at the specified index
		setMessages(MessagesCopy); // Update the state with the modified messages array
	};

	// Delete Single Message
	const toggleDelete = (index) => {
		const MessagesCopy = [...messages];
		MessagesCopy.splice(index, 1);
		setMessages(MessagesCopy);
	};

	// Delete All Messages Function
	const DeleteChat = () => {
		setMessages([]), setModalVisible(false);
	};

	// Delete Button
	const DeleteButton = () => {
		return (
			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<Text style={{ marginRight: 10 }}>Delete</Text>
			</TouchableOpacity>
		);
	};

	const HeaderTitle = () => {
		return (
			<TouchableOpacity
				onPress={() =>
					router.navigate({
						pathname: "screens/ChatScreens/ChatMedia",
						params: { ID: ChatID },
					})
				}
			>
				<Text style={{ fontSize: 20 }}>
					{ChatID ? "Note " + (parseInt(ChatID) + 1) : "New Note"}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerLeft: () => (
						<View style={{ right: 20 }}>
							<ProfilePicture
								borderWidth={0}
								size={35}
								DefaultIcon={true}
								onPress={() =>
									router.navigate({
										pathname: "screens/ChatScreens/ChatMedia",
										params: { ID: ChatID },
									})
								}
							/>
						</View>
					),
					headerTitle: () => (
						<View style={{ right: 10 }}>
							<HeaderTitle />
						</View>
					),
					headerRight: () => (
						<DropDown
							DeleteTitle={"Delete"}
							MediaVisibility={true}
							AnimationSpeed={100}
							SettingsVisibility={false}
							OnPressDeleteAll={() => setModalVisible(true)}
							OnPressMedia={() =>
								router.navigate({
									pathname: "screens/ChatScreens/ChatMedia",
									params: { ID: ChatID },
								})
							}
						/>
					),
				}}
			/>

			<DeleteModal
				visible={modalVisible}
				Message="Are you sure you want to delete the entire chat?"
				onClose={() => setModalVisible(false)}
				onDelete={DeleteChat}
			/>

			<View style={styles.container}>
				{/* // Messages */}
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{}}
				>
					<FadeInView duration={500}>
						{messages?.map((message, index) => (
							<React.Fragment key={"fragment_" + index}>
								<MessageBubble
									key={index}
									message={message.content}
									isSender={message.isSender}
									MessageTime={message.time}
									onSwap={() => toggleSender(index)}
									onPress={() => {
										message.type === "image"
											? (setPicModal(true), setSelectedImage(message.content))
											: toggleSender([index]);
									}}
									onLongPress={() => toggleDelete(index)}
									Type={message.type}
									// Document Render
									DocumentSize={message.size}
									DocumentTitle={message.name}
									DocumentExtension={message.extension}
									onDocumentPress={() => openPDF(message.content)}
									onDocumentLongPress={() => toggleDelete(index)}
								/>
								{message.type === "image" ? (
									<PhotoModal
										key={"photoModal_" + index}
										visible={PicModal}
										ImageSource={selectedImage}
										onClose={() => setPicModal(false)}
									/>
								) : null}
							</React.Fragment>
						))}
					</FadeInView>
				</ScrollView>

				{/* // TextField */}
				<MessageField
					messageValue={message}
					onChangeText={(text) => setMessage(text)}
					onSend={HandleSend}
					AttachmentButton={true}
					PhotoFunction={PickImage}
					AttachFunction={pickDocument}
				/>
			</View>
		</>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e5e5e5",
		justifyContent: "space-between",
		padding: 10,
		paddingBottom: 10,
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
	Image: {
		width: 160,
		height: 160,
		borderRadius: 20,
		margin: 3,
	},
	Shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.27,
		shadowRadius: 10,
		elevation: 1,
		borderRadius: 20,
	},
});
