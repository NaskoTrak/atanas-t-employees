import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import CustomTable from './components/CustomTable';
import CustomFilePicker from './components/CustomFilePicker';
import { calculateLongestPeriodTogether } from './Calculations';

export default function App() {
	const [csvData, setCsvData] = useState({
		tableHead: ['EmpID', 'ProjectID', 'DateFrom', 'DateTo'],
		tableData: [],
	});

	const [answerMessage, setAnswerMessage] = useState('');

	const setTableData = (data) => {
		setCsvData({ ...csvData, tableData: data });
	};

	useEffect(() => {
		if (csvData.tableData && csvData.tableData.length > 0) {
			let answer = calculateLongestPeriodTogether(csvData.tableData);
			if (answer[2] === 0) {
				setAnswerMessage(
					`There is no employees working in the same project at the same time.`
				);
			} else {
				setAnswerMessage(
					`Employees ${answer[0]} and ${answer[1]} have worked for ${answer[2]} days.`
				);
			}
		}
	}, [csvData.tableData]);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView style={styles.table}>
				<CustomTable csvData={csvData} />
			</ScrollView>
			{answerMessage ? (
				<View style={styles.answerContainer}>
					<Text style={styles.answerMessageHeadingText}>Answer:</Text>
					<Text>{answerMessage}</Text>
				</View>
			) : (
				<></>
			)}
			<CustomFilePicker setCsvData={setCsvData} setTableData={setTableData} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 20,
	},
	table: {
		flex: 1,
		marginTop: 20,
	},
	answerContainer: {
		flex: 1,
		marginHorizontal: 20,
		alignItems: 'center',
	},
	answerMessageHeadingText: {
		fontSize: 18,
	},
});
