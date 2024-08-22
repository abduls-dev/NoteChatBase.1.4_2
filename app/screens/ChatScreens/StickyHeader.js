import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const StickyHeaderExample = () => {
	const renderStickyHeader = () => {
		return (
			<View style={styles.stickyHeader}>
				<Text style={styles.headerText}>Sticky Header</Text>
			</View>
		);
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			stickyHeaderIndices={[1]} // The index of the sticky header
		>
			<View>
				<Text>{Array(50).fill("Scroll me! ").join("\n")}</Text>
			</View>
			<View style={styles.stickyHeader}>
				<Text style={styles.headerText}>Sticky Header</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.contentText}>
					{Array(50).fill("Scroll me! ").join("\n")}
				</Text>
			</View>
		</ScrollView>
	);
};

export default StickyHeaderExample;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 20,
	},
	stickyHeader: {
		width: "100%",
		height: 60,
		backgroundColor: "#4CAF50",
		justifyContent: "center",
		alignItems: "center",
	},
	headerText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
	content: {
		padding: 20,
	},
	contentText: {
		fontSize: 16,
		textAlign: "center",
	},
});
