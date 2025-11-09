import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
} from "recharts";
import React, { useState } from "react";
import { TrendingUp, Clock, Car, CheckCircle } from "lucide-react";

// Data for different charts
const utilizationData = [
	{ name: "Jan", value: 75 },
	{ name: "Feb", value: 82 },
	{ name: "Mar", value: 78 },
	{ name: "Apr", value: 85 },
	{ name: "May", value: 90 },
	{ name: "Jun", value: 87 },
	{ name: "Jul", value: 92 },
];

const downtimeData = [
	{ name: "Jan", value: 3.5 },
	{ name: "Feb", value: 3.2 },
	{ name: "Mar", value: 2.9 },
	{ name: "Apr", value: 2.7 },
	{ name: "May", value: 2.5 },
	{ name: "Jun", value: 2.4 },
	{ name: "Jul", value: 2.3 },
];

const vehiclesData = [
	{ name: "Jan", value: 30 },
	{ name: "Feb", value: 32 },
	{ name: "Mar", value: 35 },
	{ name: "Apr", value: 38 },
	{ name: "May", value: 40 },
	{ name: "Jun", value: 42 },
	{ name: "Jul", value: 42 },
];

const deliveryData = [
	{ name: "On-Time", value: 82.3, color: "#10b981" },
	{ name: "Delayed", value: 17.7, color: "#ef4444" },
];

// Chart Components
const AreaChartComponent = ({ data, color }) => (
	<ResponsiveContainer width="100%" height={150}>
		<AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
			<XAxis dataKey="name" tick={{ fontSize: 12 }} />
			<YAxis tick={{ fontSize: 12 }} />
			<Tooltip />
			<Area
				type="monotone"
				dataKey="value"
				stroke={color}
				fill={color}
				fillOpacity={0.3}
			/>
		</AreaChart>
	</ResponsiveContainer>
);

const BarChartComponent = ({ data, color }) => (
	<ResponsiveContainer width="100%" height={150}>
		<BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
			<XAxis dataKey="name" tick={{ fontSize: 12 }} />
			<YAxis tick={{ fontSize: 12 }} />
			<Tooltip />
			<Bar dataKey="value" fill={color} />
		</BarChart>
	</ResponsiveContainer>
);

const LineChartComponent = ({ data, color }) => (
	<ResponsiveContainer width="100%" height={150}>
		<LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
			<XAxis dataKey="name" tick={{ fontSize: 12 }} />
			<YAxis tick={{ fontSize: 12 }} />
			<Tooltip />
			<Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
		</LineChart>
	</ResponsiveContainer>
);

const PieChartComponent = ({ data }) => (
	<ResponsiveContainer width="100%" height={150}>
		<PieChart>
			<Pie
				data={data}
				cx="50%"
				cy="50%"
				innerRadius={40}
				outerRadius={60}
				paddingAngle={5}
				dataKey="value"
			>
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={entry.color} />
				))}
			</Pie>
			<Tooltip />
		</PieChart>
	</ResponsiveContainer>
);

const KeyIndicators = () => {
	const indicators = [
		{
			title: "Average Utilization",
			value: "87.3%",
			change: "+12.3% vs. Last Week",
			trend: "up",
			icon: TrendingUp,
			link: "Past 1 week",
			chart: <AreaChartComponent data={utilizationData} color="#4f9d69" />,
		},
		{
			title: "Charging Downtime",
			value: "2.4 hrs",
			change: "-15.2% vs. Last Week",
			trend: "down",
			icon: Clock,
			link: "Past 1 week",
			chart: <BarChartComponent data={downtimeData} color="#8b5cf6" />,
		},
		{
			title: "Idle Vehicles",
			value: "42 of 48",
			change: "+80% vs. Last Week",
			trend: "up",
			icon: Car,
			link: "Past 1 week",
			chart: <LineChartComponent data={vehiclesData} color="#f59e0b" />,
		},
		{
			title: "On-Time Deliveries",
			value: "82.3%",
			change: "-10.7% vs. Last Week",
			trend: "down",
			icon: CheckCircle,
			link: "Past 1 week",
			chart: <PieChartComponent data={deliveryData} />,
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Page Content */}
			<main className="flex-1 p-8 mt-1">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					Key Performance Indicators (KPI's)
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{indicators.map((indicator, index) => {
						const Icon = indicator.icon;
						const isPositive = indicator.change.startsWith("+");
						const changeColor = isPositive ? "text-green-600" : "text-red-600";

						return (
							<div
								key={index}
								className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-200 cursor-pointer"
							>
								<div className="flex items-start justify-between mb-4">
									<div>
										<div className="flex items-center gap-2 mb-2">
											<Icon className="w-5 h-5 text-gray-500" />
											<h3 className="text-sm font-medium text-gray-900">
												{indicator.title}
											</h3>
										</div>
										<p className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 font-medium">
											{indicator.link}{" "}
											<span className="ml-1 text-gray-400">→</span>
										</p>
									</div>
								</div>

								{/* Value */}
								<div className="mb-4 flex items-center justify-between">
									<div className="text-4xl font-bold text-gray-900">
										{indicator.value}
									</div>
									<div className={`text-xs font-medium ${changeColor}`}>
										{indicator.change}
									</div>
								</div>

								{/* Chart */}
								<div className="rounded-lg">{indicator.chart}</div>
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
};

export default KeyIndicators;
