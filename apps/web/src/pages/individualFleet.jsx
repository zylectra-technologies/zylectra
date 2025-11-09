import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Clock, ArrowUpRight } from "lucide-react";

const IndividualFleet = () => {
	const [trip, setTrip] = useState(null);
	const tripNumber = window.location.pathname.split("/").pop();
	const [remainingTrips, setRemainingTrips] = useState([]);

	useEffect(() => {
		const getTrip = async () => {
			try {
				const result = await api.get(`trips/${tripNumber}`);
				setTrip(result.data);
			} catch (err) {
				console.error("Error fetching trip:", err);
			}
		};

		const getRemainingTrips = async () => {
			try {
				const response = await api.get("/trips");
				const allTrips = response.data.trips || response.data || [];
				const filtered = allTrips.filter((t) => t.id.toString() !== tripNumber);
				setRemainingTrips(filtered);
			} catch (err) {
				console.error("Error fetching remaining trips:", err);
			}
		};

		getTrip();
		getRemainingTrips();
	}, [tripNumber]);

	if (!trip) {
		return (
			<div className="flex justify-center items-center h-screen text-gray-600">
				Loading trip details...
			</div>
		);
	}

	const routeStops = JSON.parse(trip.route?.stops || "[]");
	const hours = Math.floor(trip.duration / 60);
	const mins = trip.duration % 60;

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Assignment #{trip.id.toString().padStart(2, "0")} •{" "}
						{new Date(trip.createdAt).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</h1>
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold opacity-[0.5]"
						disabled
					>
						Accept All Routes
					</button>
				</div>

				{/* Main Trip Card */}
				<div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 mb-8 relative">
					<button
						className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
						onClick={() =>
						(window.location.href =
							window.location.origin + window.location.pathname + "/detailed")
						}
					>
						<ArrowUpRight className="w-5 h-5" />
					</button>

					<div className="grid grid-cols-3 mb-4 text-sm">
						<div>
							<p className="text-gray-500">EV Fleet No.</p>
							<p className="font-semibold">#01</p>
						</div>
						<div>
							<p className="text-gray-500">Vehicle Type</p>
							<p className="font-semibold">{trip.vehicle?.vehicleType}</p>
						</div>
						<div>
							<p className="text-gray-500">Driver Name</p>
							<p className="font-semibold text-black">{trip.driver?.name}</p>
						</div>
					</div>

					<div className="flex justify-between items-start">
						{/* Route Stops */}
						<div className="mt-2 mb-4">
							<ul className="space-y-2">
								{routeStops.map((stop, idx) => (
									<li
										key={idx}
										className="flex items-start gap-2 text-gray-800"
									>
										<span className="block w-2 h-2 mt-1.5 rounded-full bg-gray-600"></span>
										{stop}
									</li>
								))}
							</ul>
						</div>

						{/* ETA */}
						<div className="flex items-center gap-3 mt-6 mb-4">
							<Clock className="w-5 h-5 text-gray-600" />
							<div>
								<p className="text-gray-500 text-sm">ETA</p>
								<p className="text-2xl font-bold text-gray-900">
									{hours} hrs {mins} mins
								</p>
								<p className="text-gray-500 text-sm">
									including charging of{" "}
									<span className="font-semibold">25 mins</span>
								</p>
							</div>
						</div>
					</div>

					<div className="flex gap-4 mt-6">
						<button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
							Accept Route
						</button>
						<button className="flex-1 bg-gray-100 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200">
							Override Route
						</button>
					</div>
				</div>

				{/* Remaining Trips */}
				<h2 className="text-xl font-semibold mb-4 text-gray-900">
					Previous Assignments
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
					{remainingTrips.map((t) => (
						<div
							key={t.id}
							className="bg-white shadow-sm rounded-xl border border-gray-200 p-5 relative"
						>
							<button
								className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
								onClick={() =>
								(window.location.href =
									window.location.origin +
									window.location.pathname +
									"/detailed")
								}
							>
								<ArrowUpRight className="w-5 h-5" />
							</button>

							<div className="grid grid-cols-3 mb-4 text-sm">
								<div>
									<p className="text-gray-500">Trip ID</p>
									<p className="font-semibold">#{t.id}</p>
								</div>
								<div>
									<p className="text-gray-500">Driver</p>
									<p className="font-semibold">{t.driver?.name}</p>
								</div>
								<div>
									<p className="text-gray-500">Status</p>
									<p
										className={`font-semibold ${t.status === "COMPLETED"
												? "text-pink-600"
												: t.status === "IN_PROGRESS"
													? "text-yellow-500"
													: "text-gray-700"
											}`}
									>
										{t.status.replace("_", " ")}
									</p>
								</div>
							</div>

							<p className="text-gray-700 mb-1 text-sm">
								From: <span className="font-medium">{t.startLocation}</span>
							</p>
							<p className="text-gray-700 mb-4 text-sm">
								To: <span className="font-medium">{t.endLocation}</span>
							</p>

							<p className="text-gray-500 text-xs">
								Created on:{" "}
								{new Date(t.createdAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default IndividualFleet;
