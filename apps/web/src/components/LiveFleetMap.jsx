import React, { useState, useEffect } from "react";
import { Radio, RefreshCw } from "lucide-react";

const FleetMap = () => {
	const [vehicles, setVehicles] = useState([
		{
			id: 1,
			fleetNo: "#01",
			status: "Charging",
			x: 30,
			y: 15,
			vx: 0.01,
			vy: 0,
		},
		{
			id: 2,
			fleetNo: "#02",
			status: "Charging",
			x: 65,
			y: 75,
			vx: 0,
			vy: 0,
		},
		{ id: 3, fleetNo: "#03", status: "Ideal", x: 20, y: 35, vx: 0, vy: 0 },
		{
			id: 4,
			fleetNo: "#04",
			status: "Ideal",
			x: 32,
			y: 68,
			vx: 0,
			vy: 0,
		},
		{
			id: 5,
			fleetNo: "#05",
			status: "Enroute",
			x: 50,
			y: 58,
			vx: 0,
			vy: 0,
		},
		{
			id: 6,
			fleetNo: "#06",
			status: "Stopped",
			x: 60,
			y: 35,
			vx: 0,
			vy: 0,
		},
		{
			id: 7,
			fleetNo: "#07",
			status: "Reached",
			x: 90,
			y: 58,
			vx: 0,
			vy: 0,
		},
	]);

	const [hoveredVehicle, setHoveredVehicle] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	const statusColors = {
		Charging: "#22c55e",
		Ideal: "#3b82f6",
		Enroute: "#f59e0b",
		Stopped: "#ef4444",
		Reached: "#ec4899",
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setVehicles((prev) =>
				prev.map((vehicle) => {
					let newX = vehicle.x + vehicle.vx;
					let newY = vehicle.y + vehicle.vy;
					let newVx = vehicle.vx;
					let newVy = vehicle.vy;

					if (newX <= 5 || newX >= 95) {
						newVx = -vehicle.vx;
						newX = newX <= 5 ? 5 : 95;
					}
					if (newY <= 5 || newY >= 95) {
						newVy = -vehicle.vy;
						newY = newY <= 5 ? 5 : 95;
					}

					return { ...vehicle, x: newX, y: newY, vx: newVx, vy: newVy };
				}),
			);
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const handleRefresh = () => {
		setIsRefreshing(true);
		setTimeout(() => setIsRefreshing(false), 500);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<Radio className="w-6 h-6" />
					<h1 className="text-xl font-bold">Live Fleet Map</h1>
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

			{/* Map Container */}
			<div
				className="relative bg-blue-50 rounded-lg overflow-hidden"
				style={{ height: "350px" }}
			>
				{vehicles.map((vehicle) => (
					<div
						key={vehicle.id}
						className="absolute transition-all duration-100 cursor-pointer"
						style={{
							left: `${vehicle.x}%`,
							top: `${vehicle.y}%`,
							transform: "translate(-50%, -50%)",
						}}
						onMouseEnter={() => setHoveredVehicle(vehicle.id)}
						onMouseLeave={() => setHoveredVehicle(null)}
					>
						{/* Vehicle Dot */}
						<div
							className="w-3 h-3 rounded-full hover:scale-150"
							style={{ backgroundColor: statusColors[vehicle.status] }}
						/>

						{/* Tooltip */}
						{hoveredVehicle === vehicle.id && (
							<div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 whitespace-nowrap z-10">
								<div className="text-xs text-gray-500 mb-1">EV Fleet No.</div>
								<div className="font-bold text-lg mb-1">{vehicle.fleetNo}</div>
								<div className="text-xs text-gray-500 mb-1">Status</div>
								<div
									className="font-semibold"
									style={{ color: statusColors[vehicle.status] }}
								>
									{vehicle.status}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap items-center gap-6 mt-6">
				{Object.entries(statusColors).map(([status, color]) => (
					<div key={status} className="flex items-center gap-2">
						<div
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: color }}
						/>
						<span className="text-sm text-gray-700">{status}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default FleetMap;
