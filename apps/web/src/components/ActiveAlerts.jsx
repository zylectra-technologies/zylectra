import React, { useState, useEffect } from "react";
import { AlertCircle, Battery, PackageX, Wrench, BatteryWarning, RefreshCw } from "lucide-react";

const ActiveAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAlerts = () => {
        setIsRefreshing(true);
        const dummyAlerts = [
            {
                id: 1,
                title: "EV #20 Low Battery Detected",
                level: "Critical",
                message: "EV battery below 20%, immediate action required.",
                time: "2 min ago"
            },
            {
                id: 2,
                title: "Queue Congested",
                level: "Warning",
                message: "Zeon Station - 15 min delay expected",
                time: "5 min ago"
            },
            {
                id: 3,
                title: "Manual Override Required",
                level: "Action",
                message: "EV #10 requires manual dispatcher approval",
                time: "10 min ago"
            },
            {
                id: 4,
                title: "Unexpected Battery Charging",
                level: "Warning",
                message: "Unexpected charging stop at Statiq Expressway",
                time: "7 min ago"
            }
        ];


        setTimeout(() => {
            setAlerts(dummyAlerts);
            setIsRefreshing(false);
        }, 1000);
    };
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
    };
    useEffect(() => {
        fetchAlerts();
    }, []);

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-lg p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6" />
                        <h3 className="text-2xl font-bold text-gray-900">Active Alerts</h3>
                    </div>

                </div>
                <p className="text-gray-500 text-sm">Loading alerts...</p>
            </div >
        );
    }

    return (
        <div className="bg-white rounded-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-2xl font-bold text-gray-900">Active Alerts</h3>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                    <span className="font-medium">Refresh</span>
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="space-y-6">
                {alerts.map((alert) => {
                    const getIcon = () => {
                        if (alert.id === 1) return <Battery className="w-5 h-5" />;
                        if (alert.id === 2) return <PackageX className="w-5 h-5" />;
                        if (alert.id === 3) return <Wrench className="w-5 h-5" />;
                        if (alert.id === 4) return <BatteryWarning className="w-5 h-5" />;
                        return <AlertCircle className="w-5 h-5" />;
                    };

                    return (
                        <div
                            key={alert.id}
                            className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                        >
                            {/* Icon circle */}
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${alert.level === "Critical"
                                    ? "bg-red-100 text-red-600"
                                    : alert.level === "Warning"
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                            >
                                {getIcon()}
                            </div>

                            {/* Text details */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h4
                                        className={`text-base font-semibold ${alert.level === "Critical"
                                            ? "text-red-600"
                                            : alert.level === "Warning"
                                                ? "text-orange-600"
                                                : "text-blue-600"
                                            }`}
                                    >
                                        {alert.title}
                                    </h4>
                                    <span
                                        className={`px-3 py-1 text-xs font-medium rounded-md ${alert.level === "Critical"
                                            ? "bg-red-100 text-red-600"
                                            : alert.level === "Warning"
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-blue-100 text-blue-600"
                                            }`}
                                    >
                                        {alert.level}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-900 mb-3">{alert.message}</p>
                                <span className="text-xs text-gray-500">{alert.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveAlerts;