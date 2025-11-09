import React from "react";
import { LayoutDashboard, Truck, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
	return (
		<aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 bottom-0 pt-24 z-40">
			{/* Navigation */}
			<nav className="flex-1 p-4">
				<div className="space-y-1">
					<NavLink
						to="/"
						end
						className={({ isActive }) =>
							`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors ${isActive
								? "bg-green-50 text-green-700"
								: "text-gray-700 hover:bg-gray-50"
							}`
						}
					>
						<LayoutDashboard className="w-4 h-4" />
						Overview
					</NavLink>

					<NavLink
						to="/fleet"
						className={({ isActive }) =>
							`w-fit flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors ${isActive
								? "bg-green-50 text-green-700"
								: "text-gray-700 hover:bg-gray-50"
							}`
						}
					>
						<Truck className="w-4 h-4" />
						Fleet Management
					</NavLink>

					<NavLink
						to="/indicators"
						className={({ isActive }) =>
							`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors ${isActive
								? "bg-green-50 text-green-700"
								: "text-gray-700 hover:bg-gray-50"
							}`
						}
					>
						<BarChart3 className="w-4 h-4" />
						Key Indicators
					</NavLink>
				</div>
			</nav>
		</aside>
	);
};

export default Sidebar;

