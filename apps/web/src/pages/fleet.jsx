import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Upload, X, ChevronRight } from "lucide-react";

const Fleet = () => {
	const [showUpload, setShowUpload] = useState(false);
	const [showManualForm, setShowManualForm] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [fileName, setFileName] = useState("");
	const [trips, setTrips] = useState([]);

	// Form state for manual add
	const [manualTrip, setManualTrip] = useState({
		fleetNumber: "",
		vehicleType: "",
		driverName: "",
		startLocation: "",
		endLocation: "",
	});

	useEffect(() => {
		const getTrips = async () => {
			try {
				const { data } = await api.get("/trips");
				setTrips(data.trips || []);
			} catch (err) {
				console.error("Error fetching trips:", err);
			}
		};
		getTrips();
	}, []);

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFileName(file.name);
			setUploadSuccess(true);
			setTimeout(() => {
				setUploadSuccess(false);
				setShowUpload(false);
				setFileName("");
			}, 3000);
		}
	};

	const removeFile = () => {
		setFileName("");
		setUploadSuccess(false);
	};

	const handleManualChange = (e) => {
		setManualTrip({
			...manualTrip,
			[e.target.name]: e.target.value,
		});
	};

	const handleManualSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/trips", {
				vehicleType: manualTrip.vehicleType,
				startLocation: manualTrip.startLocation,
				endLocation: manualTrip.endLocation,
				driverName: manualTrip.driverName,
				fleetNumber: manualTrip.fleetNumber,
			});
			alert("Trip added successfully!");
			setManualTrip({
				fleetNumber: "",
				vehicleType: "",
				driverName: "",
				startLocation: "",
				endLocation: "",
			});
			setShowManualForm(false);
		} catch (err) {
			console.error("Error adding trip:", err);
			alert("Failed to add trip.");
		}
	};

	const getStatusColor = (status) => {
		switch (status?.toUpperCase()) {
			case "EN_ROUTE":
				return "text-yellow-600";
			case "PLANNED":
				return "text-blue-600";
			case "REACHED":
				return "text-pink-600";
			case "STOPPED":
				return "text-red-600";
			case "IDLE":
				return "text-gray-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">
						Fleet Assignments
					</h1>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 mb-8">
					<button
						onClick={() => {
							setShowUpload(!showUpload);
							setShowManualForm(false);
						}}
						className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-base transition"
					>
						+ Upload CSV
					</button>
					<button
						onClick={() => {
							setShowManualForm(!showManualForm);
							setShowUpload(false);
						}}
						className="bg-gray-100 border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium text-base transition w-48"
					>
						Add Manually
					</button>
				</div>

				{/* Manual Add Form */}
				{showManualForm && (
					<form
						onSubmit={handleManualSubmit}
						className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8"
					>
						<h2 className="text-lg font-semibold mb-4 text-gray-800">
							Add Trip Manually
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								type="text"
								name="fleetNumber"
								value={manualTrip.fleetNumber}
								onChange={handleManualChange}
								placeholder="Fleet Number"
								className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<input
								type="text"
								name="vehicleType"
								value={manualTrip.vehicleType}
								onChange={handleManualChange}
								placeholder="Vehicle Type"
								className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<input
								type="text"
								name="driverName"
								value={manualTrip.driverName}
								onChange={handleManualChange}
								placeholder="Driver Name"
								className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<input
								type="text"
								name="startLocation"
								value={manualTrip.startLocation}
								onChange={handleManualChange}
								placeholder="Starting Point"
								className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
							<input
								type="text"
								name="endLocation"
								value={manualTrip.endLocation}
								onChange={handleManualChange}
								placeholder="Ending Point"
								className="border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>

						<div className="flex justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setShowManualForm(false)}
								className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
							>
								Add Trip
							</button>
						</div>
					</form>
				)}

				{/* Upload Section */}
				{showUpload && (
					<div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<p className="text-gray-700 mb-4">
							Upload <span className="font-bold">.csv</span> or{" "}
							<span className="font-bold">.xlsx</span> format for automatic
							assignment creation
						</p>
						{!fileName ? (
							<label className="flex items-center justify-center gap-3 cursor-pointer bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-gray-400 transition">
								<Upload className="w-5 h-5 text-gray-600" />
								<span className="text-gray-700 font-medium">Choose File</span>
								<input
									type="file"
									accept=".csv,.xlsx"
									onChange={handleFileUpload}
									className="hidden"
								/>
							</label>
						) : (
							<div className="bg-white border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Upload className="w-5 h-5 text-gray-600" />
									<span className="text-gray-700 font-medium">{fileName}</span>
								</div>
								<button
									onClick={removeFile}
									className="text-red-500 hover:text-red-700"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
						)}

						{uploadSuccess && (
							<div className="mt-4 text-green-700 px-4 py-3 rounded-lg">
								Uploaded successfully!
							</div>
						)}
					</div>
				)}

				{/* Assignments Section */}
				<div className="shadow-sm mt-10">
					<div className="flex items-center justify-start gap-x-4 mb-4">
						<h2 className="text-xl font-bold text-gray-900">
							Trip Assignments
						</h2>
						<p className="inline-flex items-center text-xs text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 font-medium">
							<span className="ml-1 text-gray-600">Latest Trips →</span>
						</p>
					</div>

					{/* Trip Cards */}
					{trips.length === 0 ? (
						<p className="text-gray-500 py-8 text-center">
							No trip assignments found.
						</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{trips.map((trip) => (
								<div
									key={trip.id}
									className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition bg-gray-50 cursor-pointer"
									onClick={() => (window.location.href = `/fleet/${trip.id}`)}
								>
									<div className="flex items-center justify-between mb-2">
										<h3 className="text-lg font-bold text-gray-800">
											Trip #{trip.id}
										</h3>
										<ChevronRight className="w-5 h-5 text-gray-400" />
									</div>

									<div className="grid grid-cols-2 gap-y-2 text-sm">
										<div>
											<p className="text-gray-500">Vehicle ID</p>
											<p className="font-semibold">{trip.vehicleId}</p>
										</div>
										<div>
											<p className="text-gray-500">Driver Name</p>
											<p className="font-semibold">
												{trip.driver?.name ?? "—"}
											</p>
										</div>
										<div>
											<p className="text-gray-500">Start</p>
											<p className="font-semibold">{trip.startLocation}</p>
										</div>
										<div>
											<p className="text-gray-500">End</p>
											<p className="font-semibold">{trip.endLocation}</p>
										</div>
										<div>
											<p className="text-gray-500">Distance (km)</p>
											<p className="font-semibold">{trip.distance}</p>
										</div>
										<div>
											<p className="text-gray-500">Duration (mins)</p>
											<p className="font-semibold">{trip.duration}</p>
										</div>
										<div>
											<p className="text-gray-500">Status</p>
											<p
												className={`font-semibold ${getStatusColor(
													trip.status,
												)}`}
											>
												{trip.status}
											</p>
										</div>
										<div>
											<p className="text-gray-500">Driver Contact</p>
											<p className="font-semibold">
												{trip.driver?.contactInfo ?? "—"}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Fleet;
