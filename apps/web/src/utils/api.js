import axios from "axios";

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || "http://172.31.33.140:3000/",
	timeout: 10000, // optional
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.warn("Unauthorized");
		}
		return Promise.reject(error);
	},
);

export default api;
