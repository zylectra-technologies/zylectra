import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import React, { useEffect } from "react";
import { TrendingUp, Clock, Car, CheckCircle } from "lucide-react";
import api from "../utils/api";

const KPISection = () => {
	const kpis = [
		{
			title1: "Average",
			title2: "Utilization",
			value: "87.3%",
			change: "+12.5% vs. Last Week",
			changeColor: "text-green-600",
			Icon: TrendingUp,
		},
		{
			title1: "Charging",
			title2: "Downtime",
			value: "2.4 hrs",
			change: "-15.2% vs. Last Week",
			changeColor: "text-red-600",
			Icon: Clock,
		},
		{
			title1: "Idle",
			title2: "Vehicles",
			value: "42 of 48",
			change: "+80% vs. Last Week",
			changeColor: "text-green-600",
			Icon: Car,
		},
		{
			title1: "On-Time",
			title2: "Deliveries",
			value: "82.3%",
			change: "-10.7% vs. Last Week",
			changeColor: "text-red-600",
			Icon: CheckCircle,
		},
	];

	return (
		<section className="mb-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">
				Key Performance Indicators (KPI's)
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{kpis.map((kpi, i) => (
					<div
						key={i}
						className="bg-white rounded-xl p-6 border border-gray-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
					>
						<div className="flex items-center justify-between mb-4">
							<div>
								<p className="text-sm text-gray-600 mb-1">{kpi.title1}</p>
								<p className="text-sm text-gray-600">{kpi.title2}</p>
							</div>
							<kpi.Icon className="w-5 h-5 text-gray-400" />
						</div>
						<div className="text-4xl font-bold text-gray-900 mb-1">
							{kpi.value}
						</div>
						<div className={`text-sm font-medium ${kpi.changeColor}`}>
							{kpi.change}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default KPISection;
