import React, { useEffect } from 'react';
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	StatusBar,
} from 'react-native';
import {
	Battery,
	MapPin,
	Navigation,
	AlertCircle,
	Plane,
} from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation.tsx';
import api from '../utils/api.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mapPlaceholder from '../assets/demo_map.png';

export default function HomeScreen({ navigation }: { navigation: any }) {
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = await AsyncStorage.getItem('accessToken');
				if (!token) {
					console.warn('No access token found');
					navigation.navigate('Login');
					return;
				}

				const res = await api.get('auth/me', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (res.data.length != 0) {
					console.log('User data:', res.data);
					AsyncStorage.setItem('userData', JSON.stringify(res.data));
				} else {
					navigation.navigate('Login');
				}
			} catch (error) {
				console.error('Failed to fetch user data:', error);
			}
		};

		fetchUser();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#f3f8ff" />

			{/* Main Content Area */}
			<View style={styles.contentContainer}>
				{/* Active Route Card */}
				<View style={styles.card}>
					<View style={{ backgroundColor: '#fff' }}>
						{/* Card Header */}
						<View style={styles.cardHeader}>
							<Text style={styles.cardTitle}>Active Route</Text>
							<Text style={styles.cardSubtitle}>Delhi Warehouse - Zone B</Text>
						</View>
					</View>
					{/* Map Section */}
					<View style={styles.mapContainer}>
						<Image source={mapPlaceholder} style={styles.mapImage} />
						{/* <View style={styles.liveTrackingBadge}>
						    <Text style={styles.liveTrackingText}>Live Tracking</Text>
						</View> */}
					</View>

					{/* SoC Card */}
					<View style={styles.socCard}>
						<View style={styles.socHeader}>
							<View style={styles.socIconContainer}>
								<Battery size={24} color="white" />
							</View>

							<View style={styles.socTextContainer}>
								<Text style={styles.socTitle}>Current SoC</Text>
								<Text style={styles.socPercentage}>78%</Text>
							</View>

							<View style={styles.socStatusButton}>
								<Text style={styles.socStatusText}>Good</Text>
							</View>
						</View>

						{/* Progress Bar */}
						<View style={styles.progressBarContainer}>
							<View style={styles.progressBarFill}></View>
						</View>

						<Text style={styles.predictedRangeText}>Predicted Range</Text>
						<Text style={styles.rangeValueText}>124 Km Remaining</Text>

						<TouchableOpacity style={styles.viewStationsButton}>
							<Text style={styles.viewStationsText}>View Stations →</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Next Delivery Stop Card */}
				<View style={styles.deliveryCard}>
					<Text style={styles.deliveryTitle}>Next Delivery Stop</Text>
					<View style={styles.deliveryContent}>
						<View style={styles.deliveryLocation}>
							<MapPin size={20} color="#007AFF" style={styles.deliveryIcon} />
							<Text style={styles.deliveryLocationText}>Sector 16, Noida</Text>
						</View>
						<Text style={styles.deliveryETA}>ETA 18 Mins</Text>
					</View>
					<View style={styles.deliveryDistance}>
						<Plane size={16} color="#666" />
						<Text style={styles.deliveryDistanceText}>12.4 Kms Away</Text>
					</View>
				</View>
				<View style={styles.deliveryButtonContainer}>
					<TouchableOpacity style={styles.primaryButton}>
						<Navigation size={18} color="#fff" style={styles.buttonIcon} />
						<Text style={styles.primaryButtonText}>Navigate</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.secondaryButton}>
						<AlertCircle size={18} color="#007AFF" style={styles.buttonIcon} />
						<Text style={styles.secondaryButtonText}>Report Issue</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Bottom Navigation */}
			<BottomNavigation activeTab="home" navigation={navigation} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f8ff',
	},
	contentContainer: {
		flex: 1,
		padding: 16,
	},
	// Card Styles
	card: {
		overflow: 'hidden',
		backgroundColor: '#fff',
		borderRadius: 12,
		marginBottom: 16,
	},
	cardHeader: {
		padding: 16,
		paddingBottom: 8,
	},
	cardTitle: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#1a1a1a',
	},
	cardSubtitle: {
		fontSize: 14,
		color: '#666',
		marginTop: 4,
	},
	// Map Styles
	mapContainer: {
		position: 'relative',
		width: '100%',
		height: 200,
	},
	mapImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'stretch',
	},
	liveTrackingBadge: {
		position: 'absolute',
		top: 12,
		left: 12,
		backgroundColor: 'rgba(0, 0, 0, 0.6)',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
	},
	liveTrackingText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: '600',
	},
	// SoC Card Styles
	socCard: {
		marginTop: 20,
		padding: 20,
		backgroundColor: '#fff',
	},
	socHeader: {
		display: 'flex',
		flexDirection: 'row',
		gap: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	socIconContainer: {
		padding: 8,
		height: 40,
		width: 40,
		backgroundColor: 'teal',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	socTextContainer: {
		display: 'flex',
		flexDirection: 'column',
		flex: 3,
	},
	socTitle: {
		fontWeight: 'bold',
		fontSize: 16,
	},
	socPercentage: {
		color: 'teal',
		fontSize: 18,
		fontWeight: '600',
	},
	socStatusButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		backgroundColor: 'teal',
	},
	socStatusText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 12,
	},
	progressBarContainer: {
		marginTop: 12,
		width: '100%',
		height: 12,
		borderRadius: 12,
		borderColor: 'blue',
		borderWidth: 1,
		overflow: 'hidden',
	},
	progressBarFill: {
		width: '78%',
		backgroundColor: 'blue',
		height: 12,
		borderRadius: 12,
	},
	predictedRangeText: {
		marginTop: 16,
		fontSize: 16,
		fontWeight: '600',
		color: '#333',
	},
	rangeValueText: {
		marginTop: 4,
		fontSize: 14,
		color: '#666',
	},
	viewStationsButton: {
		marginTop: 12,
		alignSelf: 'flex-end',
	},
	viewStationsText: {
		color: '#007AFF',
		fontWeight: '600',
	},
	// Delivery Card Styles
	deliveryCard: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	deliveryTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 12,
	},
	deliveryContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	deliveryLocation: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 3,
	},
	deliveryIcon: {
		marginRight: 8,
	},
	deliveryLocationText: {
		fontSize: 16,
		color: '#333',
	},
	deliveryETA: {
		fontSize: 16,
		fontWeight: '600',
		color: '#007AFF',
	},
	deliveryDistance: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	deliveryDistanceText: {
		fontSize: 14,
		color: '#666',
		marginLeft: 6,
	},
	// Action Button Styles for Delivery Card
	deliveryButtonContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	primaryButton: {
		flex: 1,
		backgroundColor: '#007AFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		borderRadius: 10,
	},
	primaryButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	secondaryButton: {
		flex: 1,
		backgroundColor: 'transparent',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: '#007AFF',
	},
	secondaryButtonText: {
		color: '#007AFF',
		fontSize: 16,
		fontWeight: '600',
	},
	buttonIcon: {
		marginRight: 8,
	},
});
