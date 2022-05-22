import React from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { readString } from 'react-native-csv';
import * as ExpoFileSystem from 'expo-file-system';

const CustomFilePicker = ({ setTableData }) => {
	const pickDocument = async () => {
		let result = await DocumentPicker.getDocumentAsync({});

		const fileContent = await ExpoFileSystem.readAsStringAsync(result.uri);

		readString(fileContent, {
			complete: (results) => {
				setTableData(results.data);
			},
		});
	};

	return (
		<View style={styles.selectBtn}>
			<Text style={styles.infoForBtnText}>Select CSV file</Text>
			<Button title="Select 📑" onPress={pickDocument} />
		</View>
	);
};

const styles = StyleSheet.create({
	selectBtn: {
		width: Dimensions.get('window').width * 0.6,
		alignSelf: 'center',
	},
	infoForBtnText: {
		marginVertical: 5,
		alignSelf: 'center',
	},
});

export default CustomFilePicker;
