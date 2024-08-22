import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Alert,
	TextInput,
} from "react-native";
import cade from "../../../assets/images/cade.jpg";
import PhotoModal from "../../components/PhotoModal";
import {
	Entypo,
	FontAwesome6,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeleteModal from "../../components/DeleteModal";
import { Stack } from "expo-router";
import { GlobalStyles } from "./../../components/GlobalStyles";

const ActiveColor = GlobalStyles.Icons.ActiveColor;
const DisabledColor = GlobalStyles.Icons.DisabledColor;
const DefaultBio = "Moew Moew Moew Moew";

const ProfilePage = () => {
	const [selectedImage, setSelectedImage] = useState(cade);
	const [PhotoViewModal, setPhotoModal] = useState(false);
	const [DeleteModalToggle, setDeleteModalToggle] = useState(false);
	const [bio, setBio] = useState(DefaultBio);
	const [editingBio, setEditingBio] = useState(false);

	useEffect(() => {
		// Load the saved profile photo URI from AsyncStorage
		const loadProfileData = async () => {
			try {
				const data = await AsyncStorage.getItem("PFP");
				if (data) {
					const profileData = JSON.parse(data); // Parse string to object
					setSelectedImage(profileData.Photo);
					setBio(profileData.Bio);
					console.log("data Loaded!");
				}
			} catch (error) {
				console.error("Error loading profile photo:", error);
			}
		};

		loadProfileData();
	}, []); // Run only once when the component mounts

	const saveProfileData = async (photo, bio) => {
		const ProfileData = {
			Photo: photo,
			Bio: bio,
		};
		try {
			await AsyncStorage.setItem("PFP", JSON.stringify(ProfileData));
		} catch (error) {
			console.error("Error saving profile photo:", error);
		}
	};

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
			saveProfileData(croppedImage.uri, bio);
			console.log("Photo Saved!");
		} else {
			console.log("No Image selected.");
		}
	};

	const DeleteProfile = () => {
		setBio(DefaultBio);
		setSelectedImage(cade);
		AsyncStorage.removeItem("PFP");
	};

	const handleEditPress = () => {
		if (editingBio) {
			// Finish editing
			setEditingBio(false);
			saveProfileData(selectedImage, bio);
			console.log("Bio saved!");
		} else {
			// Start editing
			setEditingBio(true);
		}
	};

	const AboutSection = (
		<View style={styles.section}>
			<Text style={styles.sectionHeader}>About</Text>
			<Text style={styles.sectionText}>Name: Cade</Text>
			<Text style={styles.sectionText}>Age: 200</Text>
			<Text style={styles.sectionText}>Location: The Den</Text>
			<Text style={styles.sectionText}>Phone: 090078601</Text>
		</View>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<TouchableOpacity
							disabled={editingBio ? true : false}
							onPress={() => setDeleteModalToggle(true)}
						>
							<MaterialIcons
								name="delete-outline"
								color={editingBio ? DisabledColor : "#3d5361"}
								size={23}
							/>
						</TouchableOpacity>
					),
				}}
			/>

			<DeleteModal
				Message="Are you sure you want to clear profile picture and bio?"
				visible={DeleteModalToggle}
				onClose={() => setDeleteModalToggle(false)}
				onDelete={() => {
					DeleteProfile(), setDeleteModalToggle(false);
				}}
			/>

			<ScrollView
				showsVerticalScrollIndicator={false}
				style={styles.container}
			>
				{/* Header */}
				<View style={{ justifyContent: "center", alignItems: "center" }}>
					<TouchableOpacity
						onPress={() => setPhotoModal(true)}
						// onPress={ async () => {const data =  JSON.parse(await AsyncStorage.getItem("PFP")); console.log(data)}}
						style={[styles.header, styles.outline]}
					>
						<Image
							resizeMode={selectedImage === cade ? "cover" : "contain"}
							source={selectedImage === cade ? cade : { uri: selectedImage }}
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

				{selectedImage !== cade ? (
					<PhotoModal
						ImageSource={selectedImage}
						visible={PhotoViewModal}
						onClose={() => setPhotoModal(false)}
					/>
				) : (
					<PhotoModal
						Dummy={true}
						visible={PhotoViewModal}
						onClose={() => setPhotoModal(false)}
					/>
				)}

				{/* User information */}

				{/* Bio */}
				<View style={styles.section}>
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}
						onPress={() => (
							handleEditPress(), saveProfileData(selectedImage, bio)
						)}
					>
						<Text style={styles.sectionHeader}>Bio</Text>
						{editingBio ? (
							<MaterialCommunityIcons
								disabled={true}
								name="pencil"
								size={20}
								color={DisabledColor}
								style={{ marginLeft: 5, bottom: 3 }}
							/>
						) : (
							<MaterialCommunityIcons
								name="pencil"
								size={20}
								color={ActiveColor}
								style={{ marginLeft: 5, bottom: 3 }}
							/>
						)}
					</TouchableOpacity>
					{editingBio ? (
						<TextInput
							onSubmitEditing={() => {
								handleEditPress(), saveProfileData(selectedImage, bio);
							}}
							style={styles.sectionText}
							value={bio}
							onChangeText={(text) => setBio(text)}
							onBlur={() => setEditingBio(false)}
							autoFocus
						/>
					) : (
						<Text style={styles.sectionText}>{bio}</Text>
					)}
				</View>

				{/* {AboutSection} */}

				<View style={styles.section}>
					<Text style={styles.sectionHeader}>How to use?</Text>
					<Text style={styles.sectionText}>Click ➕ to add a new note.</Text>
					<Text style={styles.sectionText}>Click an image 📸 to open it.</Text>
					<Text style={styles.sectionText}>
						Click a message📨 to switch its position.
					</Text>
					<Text style={styles.sectionText}>
						Click an switch 🔁 to switch the position!
					</Text>
					<Text style={styles.sectionText}>
						Hold🤝 any message or convo to delete it.
					</Text>
					<Text style={[styles.sectionText, { color: "#00000023" }]}>
						_______________________
					</Text>
					<Text style={[styles.sectionText, { fontWeight: "bold" }]}>
						Happy note-taking! 💖
					</Text>
				</View>
				<View style={{ margin: 20, alignItems: "center" }}>
					<Text style={{ color: "#00000075", marginBottom: 20, fontSize: 10 }}>
						Created by Mirza AbdulMoeed & Abdullah Saleem .
					</Text>
				</View>
			</ScrollView>
		</>
	);
};

const size = 250;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
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
	section: {
		marginBottom: 20,
		backgroundColor: "#eeeeee",
		padding: 20,
		borderRadius: 20,
	},
	sectionHeader: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	sectionText: {
		fontSize: 16,
		marginBottom: 5,
	},
});

export default ProfilePage;
