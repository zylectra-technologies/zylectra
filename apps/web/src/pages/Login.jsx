import { useState, useEffect } from "react";
import api from "../utils/api";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		console.log("Login attempted: ", email, password);
		const result = await api.post("/auth/login", { email, password });
		console.log("Login response:", result);
		console.log(result.data);
		localStorage.setItem("accessToken", result.data.accessToken);
		console.log("Access Token saved to local storage");
		window.location.href = "/";
	};

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			console.log("User is already logged in with token:", token);
			window.location.href = "/";
		}
	}, []);
	return (
		<div className="w-full h-full flex justify-center items-center">
			<div className="bg-white p-5">
				<h1 className="font-bold text-3xl">Login Page</h1>
				<input
					type="email"
					className="p-3 border border-gray-300 rounded-md mt-4 w-full outline-none"
					name="email"
					value={email}
					placeholder="Enter Email"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					className="p-3 border border-gray-300 rounded-md mt-4 w-full outline-none"
					value={password}
					name="password"
					placeholder="Enter Password"
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button
					type="submit"
					className="font-bold bg-blue-500 p-3 block text-white rounded-md mt-4 w-full"
					onClick={handleLogin}
				>
					Log In
				</button>
			</div>
		</div>
	);
}
