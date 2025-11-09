import React, { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import KPI from "../components/KPI";
import ActiveAlerts from "../components/ActiveAlerts";
import LiveFleetMap from "../components/LiveFleetMap";
import FleetVehiclesSection from "../components/FleetVehicle";

const Dashboard = () => {
	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (!token) {
			window.location.href = "/Login";
		}
	});
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Fixed Sidebar */}
			<Sidebar />

			{/* Main Content Area - with left margin for sidebar */}
			<div className="ml-1">
				{/* Header */}
				<Header />

				{/* Dashboard Content */}
				<main className="p-8">
					{/* KPI Section */}
					<KPI />

					{/* Alerts & Fleet Map */}
					<section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-start">
						<ActiveAlerts />
						<LiveFleetMap />
					</section>

					{/* Fleet Vehicles Section */}
					<section className="mt-6">
						<FleetVehiclesSection />
					</section>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;

