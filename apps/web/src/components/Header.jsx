import React, { useState, useEffect, useRef } from "react";
import { Bell, User, Menu, LogOut } from "lucide-react";
import image from "../image.png";

const Header = ({ onToggleSidebar }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		window.location.href = "/login";
	};

	return (
		<header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between shadow-sm fixed top-0 left-0 right-0 z-50">
			{/* Logo + Title */}
			<div className="flex items-center gap-3">
				<img
					src={image}
					alt="Zylectra Logo"
					className="w-14 h-14 rounded-lg object-cover"
				/>
				<div>
					<h1 className="text-4xl font-bold text-gray-900 tracking-wide">
						ZYLECTRA
					</h1>
					<p className="text-sm text-gray-600 -mt-0.5">
						Fleet Management Dashboard
					</p>
				</div>
			</div>

			{/* Icons */}
			<div className="flex items-center gap-4 relative" ref={dropdownRef}>
				<button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
					<Bell className="w-6 h-6 text-gray-600" />
					<span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
				</button>

				{/* User Dropdown */}
				<button
					className="p-2 rounded-lg hover:bg-gray-100 transition"
					onClick={() => setIsDropdownOpen((prev) => !prev)}
				>
					<User className="w-6 h-6 text-gray-600" />
				</button>

				{isDropdownOpen && (
					<div className="absolute right-0 top-12 bg-white shadow-lg rounded-xl border border-gray-200 w-40 py-2 z-50 animate-fadeIn">
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition text-left"
						>
							<LogOut className="w-4 h-4 text-gray-500" />
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
