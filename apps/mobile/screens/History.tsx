import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, ProgressChart, PieChart } from 'react-native-chart-kit';
import { Battery } from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';
import { useEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen({ navigation }: { navigation: any }) {
	const [userData, setUserData] = React.useState(null);
	const [trips, setTrips] = React.useState([]);

	useEffect(() => {
		const loadUserData = async () => {
			try {
				const storedData = await AsyncStorage.getItem('userData');
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					console.log('User data:', parsedData);
					setUserData(parsedData);
				} else {
					console.log('No user data found');
				}
			} catch (error) {
				console.error('Error reading user data:', error);
			}
		};

		loadUserData();

		const loadTrips = async () => {
			const tripsData = await api.get('trips/driver', {
				headers: {
					Authorization: `Bearer ${await AsyncStorage.getItem('accessToken')}`,
				},
			});

			console.log('Trips data:', tripsData.data.trips);
			setTrips(tripsData.data.trips);
		};

		loadTrips();
	}, []);

	const lineData = {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				data: [6, 6.1, 6.4, 6.2, 6.5, 5.9, 6.0],
				color: () => '#22c55e',
				strokeWidth: 2,
			},
		],
	};

	const pieData = [
		{
			name: 'Driving',
			population: 80,
			color: '#22c55e',
			legendFontColor: '#333',
			legendFontSize: 12,
		},
		{
			name: 'Charging',
			population: 20,
			color: '#3b82f6',
			legendFontColor: '#333',
			legendFontSize: 12,
		},
	];

	const chartConfig = {
		backgroundGradientFrom: '#ffffff',
		backgroundGradientTo: '#ffffff',
		decimalPlaces: 1,
		color: () => '#22c55e',
		labelColor: () => '#666',
		propsForDots: {
			r: '4',
			strokeWidth: '2',
			stroke: '#22c55e',
		},
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fb' }}>
			<ScrollView contentContainerStyle={styles.scroll}>
				{/* Header */}
				<View style={styles.topbar}>
					<Text style={styles.title}>Trip History</Text>
					<Text style={styles.subtitle}>Performance Insights and Analysis</Text>
				</View>

				{/* Weekly Efficiency Card */}
				<View style={styles.card}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: 6,
						}}
					>
						<View>
							<Text style={styles.cardTitle}>Weekly Efficiency</Text>
							<Text style={styles.smallText}>Average: 5.9 km per %SoC</Text>
						</View>
						<View style={styles.badge}>
							<Text style={{ color: '#16a34a', fontWeight: 'bold' }}>+8%</Text>
						</View>
					</View>

					<LineChart
						data={lineData}
						width={screenWidth - 48}
						height={200}
						chartConfig={chartConfig}
						bezier
						style={{ borderRadius: 8 }}
					/>
				</View>

				{/* Latest Trip Details */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Latest Trip Details</Text>

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginTop: 8,
						}}
					>
						<View>
							<Text style={styles.tripTitle}>
								{trips[0]?.startLocation} → {trips[0]?.endLocation}
							</Text>
							<Text style={styles.smallText}>
								{new Date(trips[0]?.createdAt).toLocaleDateString()}
							</Text>
						</View>
						<View style={styles.statusBadge}>
							<Text
								style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}
							>
								{trips[0]?.status}
							</Text>
						</View>
					</View>

					<View style={styles.infoList}>
						<Text>Distance: {trips[0]?.distance} km</Text>
						<Text>
							Stops:{' '}
							{(() => {
								try {
									const stops = trips[0]?.route?.stops
										? JSON.parse(trips[0].route.stops)
										: [];
									return stops.length;
								} catch (e) {
									console.error('Invalid stops JSON:', e);
									return 0;
								}
							})()}
						</Text>
						<Text>Duration: {trips[0]?.duration / 60} hrs</Text>
					</View>

					{/* Energy Efficiency */}
					<View style={styles.subCard}>
						<Text style={styles.subTitle}>Energy Efficiency</Text>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<Text style={styles.smallText}>5.9 km per %SoC</Text>
							<Text style={[styles.status, { color: '#16a34a' }]}>
								Excellent
							</Text>
						</View>
						<View style={styles.progressBarBg}>
							<View style={styles.progressBarFill} />
						</View>
					</View>
				</View>

				{/* Time Distribution Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Time Distribution</Text>
					<View style={styles.chartContainer}>
						<PieChart
							data={pieData}
							width={screenWidth - 80}
							height={180}
							chartConfig={chartConfig}
							accessor="population"
							backgroundColor="transparent"
							paddingLeft="15"
							center={[10, 10]}
							absolute
						/>
					</View>
					<View style={styles.legendContainer}>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: '#22c55e' }]}
							/>
							<Text style={styles.legendText}>Driving: 180 min (80%)</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: '#3b82f6' }]}
							/>
							<Text style={styles.legendText}>Charging: 45 min (20%)</Text>
						</View>
					</View>
				</View>

				{/* Battery Usage Card - Redesigned */}
				<View style={styles.card}>
					<View style={styles.batteryHeader}>
						<View style={styles.batteryIconContainer}>
							<Battery size={24} color="#3b82f6" />
						</View>
						<Text style={styles.cardTitle}>Battery Usage</Text>
					</View>

					<View style={styles.batteryInfoContainer}>
						<View style={styles.batteryInfoRow}>
							<Text style={styles.batteryInfoLabel}>Start SoC</Text>
							<Text style={styles.batteryInfoValue}>95%</Text>
						</View>
						<View style={styles.batteryInfoRow}>
							<Text style={styles.batteryInfoLabel}>End SoC</Text>
							<Text style={styles.batteryInfoValue}>68%</Text>
						</View>
					</View>

					<View style={styles.progressBarContainer}>
						<View style={styles.progressBarBackground}>
							<View style={styles.progressBarFill} />
						</View>
						<Text style={styles.progressBarText}>27% consumed</Text>
					</View>
				</View>

				{/* Recent Trips Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Recent Trips</Text>

					{trips.slice(1).map((trip: any) => (
						<View key={trip.id} style={styles.tripContainer}>
							<View style={styles.tripHeader}>
								<Text style={styles.tripTitle}>
									{trip.startLocation} - {trip.endLocation}
								</Text>
								<Text style={styles.tripDistance}>{trip.distance} kms</Text>
							</View>
							<View style={styles.tripDetails}>
								<Text style={styles.tripDuration}>
									{(trip.duration / 60).toFixed(0)} Hrs
								</Text>
								<Text style={styles.tripDate}>
									{new Date(trip.createdAt).toLocaleDateString()}
								</Text>
							</View>
						</View>
					))}
				</View>
			</ScrollView>

			<BottomNavigation activeTab="history" navigation={navigation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	scroll: {
		padding: 16,
		paddingBottom: 80,
	},
	topbar: {
		marginBottom: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 12,
		color: '#666',
	},
	card: {
		backgroundColor: '#fff',
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	cardTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 4,
	},
	smallText: {
		fontSize: 12,
		color: '#666',
	},
	badge: {
		backgroundColor: '#dcfce7',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
	},
	statusBadge: {
		backgroundColor: '#16a34a',
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 8,
	},
	infoList: {
		marginTop: 10,
		gap: 4,
	},
	subCard: {
		backgroundColor: '#f9fafb',
		padding: 12,
		borderRadius: 10,
		marginTop: 12,
		width: '100%',
	},
	subTitle: {
		fontWeight: 'bold',
		marginBottom: 6,
	},
	progressBarBg: {
		width: '100%',
		height: 6,
		backgroundColor: '#fff',
		borderRadius: 4,
		borderWidth: 1,
		marginTop: 6,
	},
	progressBarFill: {
		width: '90%',
		height: '100%',
		backgroundColor: 'navy',
		borderRadius: 4,
	},
	status: {
		fontWeight: 'bold',
		padding: 8,
		backgroundColor: '#d1fae5',
		borderColor: '#10b981',
		borderWidth: 1,
		fontSize: 12,
	},
	tripTitle: {
		fontWeight: 'bold',
		fontSize: 14,
	},
	// New styles for Time Distribution
	chartContainer: {
		alignItems: 'center',
		marginTop: 10,
	},
	legendContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 10,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	legendColor: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 6,
	},
	legendText: {
		fontSize: 12,
		color: '#666',
	},
	// Redesigned Battery Usage styles
	batteryHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	batteryIconContainer: {
		width: 40,
		height: 40,
		borderRadius: 8,
		backgroundColor: '#e0f2fe',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	batteryInfoContainer: {
		marginBottom: 16,
	},
	batteryInfoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	batteryInfoLabel: {
		fontSize: 14,
		color: '#666',
	},
	batteryInfoValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333',
	},
	progressBarContainer: {
		marginTop: 8,
	},
	progressBarBackground: {
		width: '100%',
		height: 12,
		borderRadius: 12,
		borderColor: '#3b82f6',
		borderWidth: 1,
		overflow: 'hidden',
	},
	progressBarFill: {
		width: '27%',
		height: '100%',
		backgroundColor: '#3b82f6',
		borderRadius: 12,
	},
	progressBarText: {
		fontSize: 12,
		color: '#666',
		marginTop: 6,
		alignSelf: 'flex-end',
	},
	// New styles for Recent Trips
	tripContainer: {
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
		paddingVertical: 12,
	},
	tripHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	tripDetails: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tripDistance: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#333',
	},
	tripDuration: {
		fontSize: 12,
		color: '#666',
	},
	tripDate: {
		fontSize: 12,
		color: '#666',
	},
});
