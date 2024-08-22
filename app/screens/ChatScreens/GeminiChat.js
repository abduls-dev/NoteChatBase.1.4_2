import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
	View,
	Text,
	TextInput,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Image,
	Alert,
	Clipboard,
} from "react-native";
import dots from "./../../../assets/Components/loading.gif";
import { SafeAreaView } from "react-native-safe-area-context";
import TestButton from "../../components/TestButton";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Plus from "../../components/Plus";
import GeminiIcon from "../../../assets/icons/gemini.png";

const GeminiChat = () => {
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [Typing, setTyping] = useState(false);

	const API_KEY = "AIzaSyCvUuATbJSoIFbJCK4vza6y2aF1khSU8QA";
	const Loading = (
		<Image
			style={[
				styles.messageContainer,
				styles.geminiMessageContainer,
				{ height: 50, width: 50, paddingVertical: -5 },
			]}
			source={dots}
		/>
	);

	useEffect(() => {
		const loadMessages = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem("@geminiChatMessages");
				if (jsonValue != null) {
					setMessages(JSON.parse(jsonValue));
				} else {
					setMessages([
						{
							text: "Welcome to Gemini Chat 🤖",
							user: false,
						},
					]);
				}
			} catch (e) {
				console.error("Error loading messages: ", e);
			}
		};

		const startChat = async () => {
			setTyping(true);
			await loadMessages();
			setTyping(false);
		};

		startChat();
	}, []);

	const saveMessages = async (messages) => {
		try {
			const jsonValue = JSON.stringify(messages);
			await AsyncStorage.setItem("@geminiChatMessages", jsonValue);
		} catch (e) {
			console.error("Error saving messages: ", e);
		}
	};

	const sendMessage = async () => {
		const userMessage = { text: userInput, user: true };
		const newMessages = [...messages, userMessage];
		setMessages(newMessages);

		setTyping(true);
		const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-pro" });
		const prompt = userMessage.text;
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();
		const geminiMessage = { text: text, user: false };
		const updatedMessages = [...newMessages, geminiMessage];
		setMessages(updatedMessages);

		await saveMessages(updatedMessages);

		setUserInput("");
		setTyping(false);
	};

	const clearChat = async () => {
		setMessages([]);
		await AsyncStorage.removeItem("@geminiChatMessages");
	};

	const copyChat = async () => {
		const chatText = messages.map((msg) => msg.text).join("\n");
		await Clipboard.setString(chatText);
		Alert.alert(
			"Copied to Clipboard",
			"The entire chat has been copied to your clipboard."
		);
	};

	const copyMessage = async (message) => {
		await Clipboard.setString(message);
		Alert.alert(
			"Copied to Clipboard",
			"The message has been copied to your clipboard."
		);
	};

	const renderMessage = ({ item, index }) => {
		const formatText = (inputText) => {
			return inputText.split("**").map((chunk, index) => {
				return index % 2 === 0 ? (
					<Text key={index}>{chunk}</Text>
				) : (
					<Text
						key={index}
						style={{ fontWeight: "bold" }}
					>
						{chunk}
					</Text>
				);
			});
		};

		const DeleteMessage = () => {
			const MessagesCopy = [...messages];
			MessagesCopy.splice(index, 1);
			setMessages(MessagesCopy);
			saveMessages(MessagesCopy); // Save the updated messages
		};

		const handleLongPress = () => {
			Alert.alert("Options", "Choose an option", [
				{
					text: "Copy Message",
					onPress: () => copyMessage(item.text),
				},
				{
					text: "Delete Message",
					onPress: DeleteMessage,
				},
				{ text: "Cancel", style: "cancel" },
			]);
		};

		return (
			<View
				style={[
					styles.messageContainer,
					item.user
						? styles.userMessageContainer
						: styles.geminiMessageContainer,
				]}
			>
				<TouchableOpacity onLongPress={handleLongPress}>
					<Text style={styles.messageText}>{formatText(item.text)}</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerBackVisible: true,
					headerTitle: () => (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Image
								source={GeminiIcon}
								style={{ height: 27, width: 27 }}
							/>
							<Text style={{ fontSize: 21, marginBottom: 5 }}> Gemini</Text>
						</View>
					),
				}}
			/>

			<FlatList
				data={messages}
				renderItem={renderMessage}
				keyExtractor={(item, index) => index.toString()}
			/>
			{Typing ? Loading : null}
			<View style={styles.inputContainer}>
				<TouchableOpacity
					onPress={clearChat}
					style={styles.clearButton}
				>
					<Text style={styles.clearButtonText}>C</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={copyChat}
					style={styles.copyButton}
				>
					<Text style={styles.copyButtonText}>Copy</Text>
				</TouchableOpacity>
				<TextInput
					placeholder="Type a message"
					onChangeText={setUserInput}
					value={userInput}
					onSubmitEditing={sendMessage}
					style={styles.input}
					placeholderTextColor="#7d7d7d"
				/>
				<TestButton
					Size={50}
					Send={true}
					onPress={sendMessage}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	messageContainer: {
		padding: 10,
		marginVertical: 5,
		marginHorizontal: 10,
		borderRadius: 10,
		maxWidth: "80%",
	},
	userMessageContainer: {
		alignSelf: "flex-end",
		backgroundColor: "#DCF8C6",
	},
	geminiMessageContainer: {
		alignSelf: "flex-start",
		backgroundColor: "#F4F4F4",
	},
	messageText: { fontSize: 16 },
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		borderTopWidth: 1,
		borderTopColor: "#ccc",
	},
	input: {
		flex: 1,
		padding: 10,
		backgroundColor: "#F4F4F4",
		borderRadius: 25,
		height: 40,
		marginRight: 5,
	},
	clearButton: {
		backgroundColor: "#ff4c4c",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		height: 40,
		marginRight: 10,
	},
	clearButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	copyButton: {
		backgroundColor: "#007bff",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		width: 60,
		height: 40,
		marginRight: 10,
	},
	copyButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	sendButton: {
		backgroundColor: "#0c6157",
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		height: 50,
	},
	sendButtonText: {
		color: "#fff",
		fontSize: 16,
	},
});

export default GeminiChat;
