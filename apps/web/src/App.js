import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import KeyIndicators from "./pages/KeyIndicators";
import FleetManagement from "./pages/fleet"; // or your placeholder component
import LoginPage from "./pages/Login";
import IndividualFleet from "./pages/individualFleet";
import DetailedFleet from "./pages/detailedFleet";

function App() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<Router>
			<div className="min-h-screen bg-gray-50 flex">
				{/* Sidebar */}
				<aside
					className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 z-50
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                        md:translate-x-0`} // always visible on medium+ screens
				>
					<Sidebar isOpen={sidebarOpen} />
				</aside>

				{/* Main Content */}
				<div
					className={`flex-1 flex flex-col transition-all duration-300 ml-0 md:ml-56`}
				>
					<Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

					<main className="flex-1 p-8 mt-24">
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/fleet" element={<FleetManagement />} />
							<Route path="/indicators" element={<KeyIndicators />} />
							<Route path="/login" element={<LoginPage />} />
							<Route path="/fleet/:id" element={<IndividualFleet />} />
							<Route path="/fleet/:id/detailed" element={<DetailedFleet />} />
						</Routes>
					</main>
				</div>
			</div>
		</Router>
	);
}

export default App;
