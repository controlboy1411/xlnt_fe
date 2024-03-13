import axios from 'axios';

const API = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/xlnt-api`,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const getChartData = async function(plantCode) {
	const result = await API.get('/home/chart-data', {
		params: { plantCode }
	})
	return result
}

export const getBoxData = async function(plantCode) {
	const result = await API.get('/home/box-data', {
		params: { plantCode }
	})
	return result
}

export const getDataTable = async function(page, size, type, value, plantCode) {
	const result = await API.get('/report/transaction-data', {
		params: { page, size, type, value, plantCode }
	})
	return result
}

export const getSummaryData = async function(plantCode, valueMonth) {
	const result = await API.get('/report/summary-data', {
		params: { plantCode, valueMonth }
	})
	return result
}