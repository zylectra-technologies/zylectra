import React, { useState, useEffect } from "react";
import { Truck, Search, RefreshCw, ArrowUpRight } from "lucide-react";
import api from "../utils/api";

const FleetVehicles = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [vehicles, setVehicles] = useState([]);

	const getVehicles = async () => {
		try {
			const res = await api.get("/vehicles");
			console.log("Vehicles data:", res.data);
			setVehicles(res.data.vehicles || []);
		} catch (err) {
			console.error("Error fetching vehicles:", err);
		}
	};

	useEffect(() => {
		getVehicles();
	}, []);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		await getVehicles();
		setTimeout(() => setIsRefreshing(false), 500);
	};

	const filteredVehicles = vehicles.filter(
		(vehicle) =>
			vehicle.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			vehicle.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			vehicle.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			vehicle.nextStop?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className=" mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<Truck className="w-6 h-6" />
						<h1 className="text-2xl font-bold">Fleet Vehicles</h1>
					</div>
					<button
						onClick={handleRefresh}
						className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
					>
						<span className="font-medium">Refresh</span>
						<RefreshCw
							className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</div>

				{/* Search Bar */}
				<div className="relative mb-8">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search Vehicles"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full max-w-md pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
					/>
				</div>

				{/* Vehicle Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{filteredVehicles.map((vehicle) => {
						let statusColor = "text-gray-500";
						switch (vehicle.status?.toUpperCase()) {
							case "EN_ROUTE":
								statusColor = "text-orange-500";
								break;
							case "IDLE":
								statusColor = "text-blue-500";
								break;
							case "CHARGING":
								statusColor = "text-green-500";
								break;
							case "STOPPED":
								statusColor = "text-red-500";
								break;
							case "REACHED":
								statusColor = "text-pink-500";
								break;
							default:
								break;
						}

						return (
							<div
								key={vehicle.id}
								className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative group"
							>
								{/* Arrow Icon */}
								<button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
									<ArrowUpRight className="w-5 h-5" />
								</button>

								{/* Vehicle Info Grid */}
								<div className="grid grid-cols-3 gap-6 mb-4">
									<div>
										<div className="text-xs text-gray-500 mb-1">
											Vehicle Type
										</div>
										<div className="font-bold text-base">
											{vehicle.vehicleType}
										</div>
									</div>
									<div>
										<div className="text-xs text-gray-500 mb-1">
											License Plate
										</div>
										<div className="font-medium text-base">
											{vehicle.licensePlate}
										</div>
									</div>
									<div>
										<div className="text-xs text-gray-500 mb-1">Driver ID</div>
										<div className="font-medium text-base">
											{vehicle.driverId}
										</div>
									</div>
								</div>

								{/* Status Row */}
								<div className="grid grid-cols-3 gap-6">
									<div>
										<div className="text-xs text-gray-500 mb-1">
											Battery Level
										</div>
										<div className="font-bold text-base">
											{vehicle.batteryLevel ?? "N/A"}%
										</div>
									</div>
									<div>
										<div className="text-xs text-gray-500 mb-1">Status</div>
										<div className={`font-bold text-base ${statusColor}`}>
											{vehicle.status ?? "Unknown"}
										</div>
									</div>
									<div>
										<div className="text-xs text-gray-500 mb-1">Next Stop</div>
										<div className="font-bold text-base">
											{vehicle.nextStop ?? "—"}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Empty State */}
				{filteredVehicles.length === 0 && (
					<div className="text-center py-12 text-gray-500">
						No vehicles found matching your search.
					</div>
				)}
			</div>
		</div>
	);
};

export default FleetVehicles;

