import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'http://172.31.33.140:3000/';

// Create axios instance
const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.request.use(
	async config => {
		const token = await AsyncStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error),
);

api.interceptors.response.use(
	response => response,
	async error => {
		if (error.response?.status === 401) {
			await AsyncStorage.removeItem('accessToken');
			// TODO: Navigate to login screen
		}
		return Promise.reject(error);
	},
);

export default api;
