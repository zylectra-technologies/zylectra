import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { payload } from "../utils/payload";
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Clock, ArrowUpRight, MapPin, Battery, Zap } from "lucide-react";

const DetailedFleet = () => {
	const [trip, setTrip] = useState(null);
	const tripNumber = 1;
	const [range, setRange] = useState(null);
	const [selectedRoute, setSelectedRoute] = useState("zylectra");
	const center = [28.6139, 77.209];
	const zoom = 13;

	useEffect(() => {
		const getTrip = async () => {
			try {
				const result = await api.get(`trips/${tripNumber}`);
				setTrip(result.data);
			} catch (err) {
				console.error("Error fetching trip:", err);
			}
		};
		getTrip();

		const getUsableRange = async () => {
			try {
				const response = await fetch("http://localhost:8000/predict_range", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				});

				if (!response.ok) throw new Error(`Server error: ${response.status}`);

				const data = await response.json();
				setRange(data.predicted_remaining_range_km);
			} catch (err) {
				console.error("Error fetching usable range:", err);
			}
		};
		getUsableRange();
	}, [tripNumber]);

	if (!trip) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-600">
				Loading trip details...
			</div>
		);
	}

	// Mock charging stations data
	const chargingStations = [
		{
			name: "Pune Central",
			type: "Charging Station",
			available: true,
			distance: "45 km",
		},
		{
			name: "StatIQ Pune",
			type: "Charging Station",
			available: true,
			distance: "60 km",
		},
		{
			name: "Mumbai Electronic City",
			type: "Charging Station",
			available: false,
			distance: "120 km",
		},
		{
			name: "Mumbra Sector 21",
			type: "Charging Station",
			available: true,
			distance: "150 km",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex flex-wrap bg-white p-6 gap-12 rounded-xl shadow-sm">
					<div>
						<h3 className="text-gray-500 text-sm">Trip ID</h3>
						<p className="font-semibold text-xl">#{trip.id}</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">Vehicle Type</h3>
						<p className="font-semibold text-xl">{trip.vehicle?.vehicleType}</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">License Plate</h3>
						<p className="font-semibold text-xl">
							{trip.vehicle?.licensePlate}
						</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">Driver Name</h3>
						<p className="font-semibold text-xl">{trip.driver?.name}</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">Status</h3>
						<p className="font-semibold text-xl">{trip.status}</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">Battery Level</h3>
						<p className="font-semibold text-xl">
							{trip.vehicle?.batteryLevel}%
						</p>
					</div>
					<div>
						<h3 className="text-gray-500 text-sm">Odometer</h3>
						<p className="font-semibold text-xl">
							{trip.vehicle?.odometerReading} km
						</p>
					</div>
				</div>

				{/* Battery Status Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
						<p className="text-gray-500 text-sm">Battery Charging</p>
						<p className="font-bold text-2xl">87%</p>
						<p className="text-blue-500 text-sm">Not Charging</p>
					</div>
					<div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
						<p className="text-gray-500 text-sm">Battery Temperature</p>
						<p className="font-bold text-2xl">30°C</p>
						<p className="text-green-500 text-sm">Optimal</p>
					</div>
					<div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
						<p className="text-gray-500 text-sm">Usable Range</p>
						<p className="font-bold text-2xl">
							{range ? `${Number(range).toFixed(2)} kms` : "..."}
						</p>
						<p className="text-green-500 text-sm">+10% vs. Last Charge</p>
					</div>
					<div className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
						<p className="text-gray-500 text-sm">Battery Health</p>
						<p className="font-bold text-2xl">82%</p>
						<p className="text-green-500 text-sm">Optimal</p>
					</div>
				</div>

				{/* Map and Route Recommendation */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Map Section */}
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="p-4 border-b border-gray-200 flex justify-between items-center">
							<h2 className="text-lg font-semibold">Live EV Fleet #01 Map</h2>
							<div className="flex items-center text-sm text-gray-600">
								<Clock className="w-4 h-4 mr-1" />
								<span>2 hr 7 min</span>
								<span className="ml-2 font-semibold text-blue-600">
									Fastest
								</span>
							</div>
						</div>
						<div className="h-96 bg-gray-100 relative">
							{/* Placeholder for map */}
							<div className="absolute inset-0 flex items-center justify-center bg-gray-200">
								<div className="text-center">
									<MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
									<img
										src="/assets/map_demo.png"
										alt="Map Placeholder"
										className="mx-auto mb-2"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Zylectra Recommendation Section */}
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="p-4 border-b border-gray-200 flex justify-between items-center">
							<h2 className="text-lg font-semibold">Zylectra Recommendation</h2>
							<button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-gray-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
									/>
								</svg>
							</button>
						</div>

						<div className="p-4">
							{/* ETA Information */}
							<div className="flex items-center justify-between mb-4">
								<div className="text-sm text-gray-600">
									<span className="font-medium">ETA: </span>
									<span>2 hrs 20 mins</span>
									<span className="text-blue-600 ml-2">
										(including 25 mins charging)
									</span>
								</div>
							</div>

							{/* Charging Stations List */}
							<div className="space-y-3 mb-6">
								{chargingStations.map((station, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center">
											<div className="flex flex-col items-center mr-3">
												<div
													className={`w-3 h-3 rounded-full ${station.available ? "bg-green-500" : "bg-red-500"}`}
												></div>
												{index < chargingStations.length - 1 && (
													<div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
												)}
											</div>
											<div>
												<p className="font-medium">{station.name}</p>
												<p className="text-sm text-gray-500">{station.type}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-sm text-gray-500">
												{station.distance}
											</p>
											{index === 0 && (
												<div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1">
													Recommended
												</div>
											)}
										</div>
									</div>
								))}
							</div>

							{/* Zylectra Optimization Info */}
							<div className="bg-blue-50 p-4 rounded-lg mb-6">
								<div className="flex items-start">
									<Zap className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
									<div>
										<p className="font-medium text-blue-900">
											Zylectra Optimization
										</p>
										<p className="text-sm text-blue-700 mt-1">
											This route is optimized based on your EV's current charge
											state, low queue risk at this charging station, and
											optimal delivery window.
										</p>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3">
								<button
									onClick={() => setSelectedRoute("zylectra")}
									className={`flex-1 py-4 px-4 rounded-lg font-medium transition-colors ${selectedRoute === "zylectra"
											? "bg-blue-600 text-white"
											: "bg-blue-100 text-blue-700 hover:bg-blue-200"
										}`}
								>
									Accept Route
								</button>
								<button
									onClick={() => setSelectedRoute("override")}
									className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${selectedRoute === "override"
											? "bg-gray-800 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
								>
									Override Route
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailedFleet;
