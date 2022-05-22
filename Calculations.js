import moment from 'moment';
import {
	areIntervalsOverlapping,
	max,
	min,
	differenceInCalendarDays,
} from 'date-fns';

const validDateFormats = [
	'DD-MM-YYYY',
	'DD/MM/YYYY',
	'YYYY:MM:DD',
	'YYYY-MM-DD',
];

const parseDate = (dateString) => {
	if (dateString === 'NULL') {
		return new Date(new Date().setUTCHours(0, 0, 0, 0));
	}

	return moment.utc(dateString, validDateFormats, true).toDate();
};

const parseDocumentData = (rawData) => {
	const modifiedArr = [];

	for (let row = 0; row < rawData.length; row++) {
		const csvRow = rawData[row];
		modifiedArr[row] = [];
		for (let index = 0; index < csvRow.length; index++) {
			const element = csvRow[index];
			if (index > 1) {
				modifiedArr[row].push(parseDate(element.trim()));
			} else {
				modifiedArr[row].push(element.trim());
			}
		}
	}
	return modifiedArr;
};

export const calculateLongestPeriodTogether = (rawTableData) => {
	let parseWithCorrectDates = parseDocumentData(rawTableData);
	const workTeamData = generateWorkTeamData(parseWithCorrectDates);
	const longestWorkTeam = getLongestWorkTeam(workTeamData);
	return longestWorkTeam;
};

const getOverlappingDaysInterval = (r1, r2) => {
	if (areIntervalsOverlapping(r1, r2)) {
		const start = max([r1.start, r2.start]);
		const end = min([r1.end, r2.end]);
		return differenceInCalendarDays(end, start);
	} else return 0;
};

const generateWorkTeamData = (csvData) => {
	const workTeamData = new Map();

	for (let i = 0; i < csvData.length - 1; i++) {
		const current = csvData[i];
		for (let j = i + 1; j < csvData.length; j++) {
			const inner = csvData[j];

			// 2 different rows with the same project id
			if (current[1] === inner[1]) {
				const rangeA = { start: current[2], end: current[3] };
				const rangeB = { start: inner[2], end: inner[3] };

				const overlapDays = getOverlappingDaysInterval(rangeA, rangeB);

				if (overlapDays > 0) {
					const workTeamName = generateWorkTeamName(current[0], inner[0]);

					if (workTeamData.has(workTeamName)) {
						workTeamData.set(
							workTeamName,
							workTeamName.get(workTeamName) + overlapDays
						);
					} else {
						workTeamData.set(workTeamName, overlapDays);
					}
				}
			}
		}
	}

	return workTeamData;
};

const generateWorkTeamName = (empId1, empId2) => {
	if (empId1 > empId2) {
		return empId1 + '-' + empId2;
	}

	return empId2 + '-' + empId1;
};

const getLongestWorkTeam = (workTeamData) => {
	let maxWorkDays = 0;
	let teamName = '';

	workTeamData.forEach((el, val) => {
		if (maxWorkDays < el) {
			maxWorkDays = el;
			teamName = val;
		}
	});

	const members = teamName.split('-');
	return [members[0], members[1], maxWorkDays];
};
