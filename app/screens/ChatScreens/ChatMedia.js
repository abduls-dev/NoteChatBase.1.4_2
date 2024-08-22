import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	ScrollView,
	Image,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
	Stack,
	router,
	useFocusEffect,
	useLocalSearchParams,
} from "expo-router";
import { TouchableNativeFeedback } from "react-native";
import PaddedButton from "../../components/PaddedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyNotes from "../../components/EmptyNotes";
import DocumentBubble from "../../components/DocumentBubble";
import PhotoModal from "../../components/PhotoModal";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ProfilePicture from "../../components/ProfilePicture";
import ChatIcon from "../../../assets/icons/ChatIcon2.png";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import EditableBioSection from "../../components/EditableText";
import { GlobalStyles } from "./../../components/GlobalStyles";

const ActiveColor = GlobalStyles.Icons.ActiveColor;
const DisabledColor = GlobalStyles.Icons.DisabledColor;

const screenWidth = Dimensions.get("window").width;

const ChatMedia = () => {
	const params = useLocalSearchParams();
	const { ID } = params;

	const [selected, setSelected] = useState(true);
	const [AllMedia, setAllMedia] = useState([]);
	const [PhotoList, setPhotoList] = useState([]);
	const [DocList, setDocList] = useState([]);

	const [PhotoView, setPhotoView] = useState(false);
	const [PicModal, setPicModal] = useState(false);

	const [ClickedPhoto, setClickedPhoto] = useState(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [loading, setLoading] = useState(false);

	const [Title, setTitle] = useState(
		ID ? "Note " + (parseInt(ID) + 1) : "New Note"
	);
	const [Editing, setEditing] = useState(false);
	const [Fadable, setFadable] = useState(false);

	const [Metadata, setMetadata] = useState({
		Title: null,
		Photo: null,
	});

	// Save Updated Conversation
	// const SaveUpdatedChat = async () => {
	//   const loadedMessages = (await AsyncStorage.getItem("Metadata")) || "[]";
	//   const parsedMessages = JSON.parse(loadedMessages);
	//   console.log("Loaded Conversations:", parsedMessages);
	//   parsedMessages[ChatID] = Metadata;
	//   const JSONValue = JSON.stringify(parsedMessages);
	//   await AsyncStorage.setItem("Metadata", JSONValue);
	//   console.log("Total Array after saving:", JSONValue);
	// };

	// // Save New as New Conversation
	// const SaveNewChat = async () => {
	//   try {
	//     const loadedData = (await AsyncStorage.getItem("Metadata")) || "[]";
	//     const parsedData = JSON.parse(loadedData);
	//     const NewMetaData = [...parsedData, Metadata]
	//     const JSONValue = JSON.stringify(Metadata);
	//     await AsyncStorage.setItem("Metadata", JSONValue);
	//     console.log("Saved Current convo:", JSONValue);
	//   } catch (error) {
	//     console.warn("Failed to save value");
	//     Alert.alert("Save Failure", "Failed to save the messages.");
	//   }
	// };

	// useEffect(() => {
	//   if (ChatID) {
	//     SaveUpdatedChat();
	//   } else {
	//     SaveNewChat();
	//   }
	// }, [messages]);

	const loadAllConvos = async () => {
		try {
			const loadedVal = await AsyncStorage.getItem("NUM");
			const parsedVal = loadedVal ? JSON.parse(loadedVal) : [];

			if (Array.isArray(parsedVal)) {
				const fetchedMessages = parsedVal[ID] || []; // Ensure fetchedMessages is always an array
				setAllMedia(fetchedMessages);
				console.log("Set NUM Val:", fetchedMessages);
			} else {
				console.log("Loaded value is not an array:", parsedVal);
			}
		} catch (error) {
			console.error("Failed to load value or value is empty:", error);
		}
	};

	const loadMessageList = async () => {
		try {
			const loadedVal = await AsyncStorage.getItem("messageList");
			if (loadedVal !== null && loadedVal !== "[]") {
				const messageList = JSON.parse(loadedVal);
				setAllMedia(messageList);
				console.log("Loaded messageList:", messageList);
			}
		} catch (error) {
			console.error(
				"Failed to load data from AsyncStorage into AllMedia:",
				error
			);
		}
	};

	const loadUpdate = async () => {
		try {
			const loadedVal = await AsyncStorage.getItem("UPDATE");
			if (loadedVal !== null && loadedVal !== "[]") {
				const updateList = JSON.parse(loadedVal);
				const currentChat = updateList[ID];
				setAllMedia(currentChat);
				console.log("Loaded UPDATE:", updateList);
			}
		} catch (error) {
			console.error(
				"Failed to load data from AsyncStorage into AllMedia:",
				error
			);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			const loadData = async () => {
				setLoading(true); // Start loading
				await loadAllConvos();
				await loadMessageList();
				await loadUpdate();
				setLoading(false); // End loading
			};

			loadData();
		}, [])
	);

	useEffect(() => {
		if (AllMedia.length > 0) {
			const photos = AllMedia.filter((item) => item.type === "image");
			setPhotoList(photos);

			const docs = AllMedia.filter((item) => item.type === "document");
			setDocList(docs);
		}
	}, [AllMedia]);

	const pickImage = async () => {
		// Request permission to access media library
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("Sorry, we need camera roll permissions to make this work!");
			return;
		} else {
			console.log("Permission Granted!");
		}

		// Launch the image picker
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true, // Enables simple cropping
			aspect: [1, 1], // Aspect ratio if allowsEditing is true
			quality: 1,
		});

		if (!result.canceled) {
			// Further crop the image using ImageManipulator
			const croppedImage = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[
					{
						crop: {
							originX: 0,
							originY: 0,
							width: result.assets[0].width,
							height: result.assets[0].height,
						},
					},
				],
				{ compress: 1, format: ImageManipulator.SaveFormat.PNG }
			);

			setSelectedImage(croppedImage.uri);
			// saveProfileData(croppedImage.uri, bio);
			console.log("Photo Saved!");
		} else {
			console.log("No Image selected.");
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

	const handleScroll = () => {
		console.log("Scrolling:", Editing);
	};

	const PaddedButtons = () => {
		return (
			<View>
				<View style={{ height: 40, backgroundColor: "#f1f1f1" }}></View>
				<View style={{ flexDirection: "row" }}>
					<PaddedButton
						onPress={() => setSelected(true)}
						Title={"Photos"}
						BarVisible={selected}
						BarColor="#75a7c0"
					/>
					<PaddedButton
						onPress={() => setSelected(false)}
						Title={"Documents"}
						BarVisible={!selected}
						BarColor="#75a7c0"
					/>
				</View>
			</View>
		);
	};

	const CustomHeader = () => {
		return (
			<View
				style={{
					flexDirection: "row",
					margin: 50,
					marginLeft: 15,
					marginBottom: 5,
				}}
			>
				<TouchableNativeFeedback
					onPress={() => router.back()}
					background={TouchableNativeFeedback.Ripple("#d9e5eb", false)}
					style={{ borderRadius: 100, height: 30, width: 30 }}
				>
					<Ionicons
						size={25}
						name="arrow-back"
					/>
				</TouchableNativeFeedback>

				{/* Chat Title */}
				<Text style={{ fontSize: 20, marginLeft: 30 }}>
					{/* {ID ? "Note " + (parseInt(ID) + 1) : "New Note"} */}
					<EditableBioSection
						width={screenWidth / 2 + 100}
						value={Title}
						onChangeText={(text) => setTitle(text)}
						Fade={Fadable}
					/>
				</Text>
			</View>
		);
	};

	useEffect(() => {
		if (!Title || Title === "") {
			setTitle(ID ? "Note " + (parseInt(ID) + 1) : "New Note");
			setFadable(true);
		}
	}, [Title]);

	return (
		<>
			<Stack.Screen
				options={{ headerShown: false }}
				// options={{
				//   headerTitle: "Chat Media",
				//   headerStyle: {
				//     backgroundColor: "transparent",
				//   },
				//   headerTransparent: true,
				// }}
			/>

			<ScrollView
				onScroll={handleScroll}
				stickyHeaderIndices={[2]}
			>
				<CustomHeader />
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<TouchableOpacity
						onPress={() => setPhotoView(true)}
						// onPress={ async () => {const data =  JSON.parse(await AsyncStorage.getItem("PFP")); console.log(data)}}
						style={[styles.header]}
					>
						<Image
							source={
								selectedImage === null ? ChatIcon : { uri: selectedImage }
							}
							style={styles.profilePicture}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={pickImage}
						style={{ left: 85, bottom: 71 }}
					>
						<MaterialCommunityIcons
							name="pencil-circle"
							size={40}
							color={ActiveColor}
							style={{ backgroundColor: "#ffffff", borderRadius: 30 }}
						/>
					</TouchableOpacity>
				</View>

				<View>
					<PaddedButtons />
				</View>

				<ScrollView contentContainerStyle={styles.scrollViewContent}>
					{loading ? (
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								flex: 1,
								margin: 100,
							}}
						>
							<ActivityIndicator
								size={80}
								color="#75a7c0"
								style={styles.loader}
							/>
						</View>
					) : (
						<ScrollView contentContainerStyle={styles.scrollViewContent}>
							{selected ? (
								PhotoList.length > 0 ? (
									PhotoList.map((item, index) => (
										<TouchableOpacity
											key={index}
											style={styles.itemContainer}
											onPress={() => {
												setClickedPhoto(item.content), setPicModal(true);
											}}
										>
											<Image
												source={{ uri: item.content }} // Ensure the URI is formatted correctly
												style={styles.image}
												onError={(e) =>
													console.log("Image Load Error:", e.nativeEvent.error)
												}
											/>
										</TouchableOpacity>
									))
								) : (
									<EmptyNotes />
								)
							) : DocList.length > 0 ? (
								DocList.map((item, index) => (
									<DocumentBubble
										key={index}
										DocumentSize={item.size}
										DocumentTitle={item.name}
										DocumentExtension={item.extension}
										onPress={() => openPDF(item.content)}
										ParentStyle={{
											width: screenWidth - 10,
											backgroundColor: "#e6e6e6",
											margin: 2,
											marginRight: 10,
											marginleft: 20,
											borderRadius: 10,
										}}
									/>
								))
							) : (
								<EmptyNotes />
							)}
						</ScrollView>
					)}
				</ScrollView>
				<PhotoModal
					ImageSource={ClickedPhoto}
					visible={PicModal}
					onClose={() => {
						setPicModal(false), setClickedPhoto(null);
					}}
				/>

				{selectedImage !== null ? (
					<PhotoModal
						ImageSource={selectedImage}
						visible={PhotoView}
						onClose={() => setPhotoView(false)}
					/>
				) : (
					<PhotoModal
						Default={true}
						visible={PhotoView}
						onClose={() => setPhotoView(false)}
					/>
				)}
			</ScrollView>
		</>
	);
};

export default ChatMedia;

const size = 250;

const styles = StyleSheet.create({
	PaddingContainer: {
		padding: 20,
		width: screenWidth / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	scrollViewContent: {
		flexDirection: "row",
		flexWrap: "wrap",
		maxWidth: screenWidth,
		paddingVertical: 1,
	},
	itemContainer: {
		width: "33%", // Three items per row
		padding: 1,
		alignItems: "center",
	},
	image: {
		width: "100%",
		aspectRatio: 1, // Ensure images maintain aspect ratio
		borderRadius: 8,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 100,
		marginBottom: 20,
	},
	outline: {
		borderWidth: 4,
		borderRadius: size,
		padding: 5,
		borderColor: "#00275163",
	},
	profilePicture: {
		width: size,
		height: size,
		borderRadius: size,
	},
});
