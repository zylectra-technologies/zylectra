import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap } from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function ChargingScreen({ navigation }: { navigation: any }) {
	return (
		<SafeAreaView style={styles.container}>
			{/* TOP BAR */}
			<View style={styles.topbar}>
				<Text style={styles.title}>Charging Stations</Text>
				<Text style={styles.subtitle}>Recommended for your Route</Text>
			</View>

			{/* FILTER BUTTONS */}
			<View style={styles.filterContainer}>
				{['All Stations', 'Available Now', 'Lowest Wait'].map((text, i) => (
					<TouchableOpacity
						key={text}
						style={[styles.filterButton, i === 0 && styles.filterButtonActive]}
					>
						<Text
							style={[styles.filterText, i === 0 && styles.filterTextActive]}
						>
							{text}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* SCROLL CONTENT */}
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				{/* CARD 1 */}
				<View style={[styles.card, styles.shadow]}>
					<View style={styles.cardHeader}>
						<View style={styles.iconRow}>
							<Zap size={20} color="#00b894" />
							<View style={{ marginLeft: 8 }}>
								<Text style={styles.stationName}>Next Charging Stop</Text>
								<Text style={styles.stationLocation}>
									ChargeHub Zone - Sector 16
								</Text>
							</View>
						</View>
						<View style={styles.badgeGreen}>
							<Text style={styles.badgeText}>Recommended</Text>
						</View>
					</View>

					{/* DETAILS */}
					<View style={styles.row}>
						<Text style={styles.detailLabel}>Distance</Text>
						<Text style={styles.detailLabel}>Queue ETA</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.detailValue}>8.6 Kms</Text>
						<Text style={[styles.detailValue, { color: '#27ae60' }]}>
							5 Mins Wait
						</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.availability}>Availability</Text>
						<Text style={styles.availabilityRight}>4/6 Available</Text>
					</View>
					<View style={styles.progressBackground}>
						<View style={[styles.progressBar, { width: '66%' }]} />
					</View>

					<TouchableOpacity style={styles.bookButton}>
						<Text style={styles.bookButtonText}>Book</Text>
					</TouchableOpacity>
				</View>

				{/* CARD 2 */}
				<View
					style={[
						styles.card,
						styles.shadow,
						{ borderColor: '#007bff', borderWidth: 1 },
					]}
				>
					<View style={styles.cardHeader}>
						<View style={styles.iconRow}>
							<Zap size={20} color="#007bff" />
							<View style={{ marginLeft: 8 }}>
								<Text style={styles.stationName}>ECO Green Station</Text>
								<Text style={styles.stationLocation}>
									ChargeHub Zone - Sector 16
								</Text>
							</View>
						</View>
						<View style={styles.badgeBlue}>
							<Text style={styles.badgeText}>Lowest Wait</Text>
						</View>
					</View>

					<View style={styles.row}>
						<Text style={styles.detailLabel}>Distance</Text>
						<Text style={styles.detailLabel}>Queue ETA</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.detailValue}>11.6 Kms</Text>
						<Text style={[styles.detailValue, { color: '#e74c3c' }]}>
							9 Mins Wait
						</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.availability}>Availability</Text>
						<Text style={styles.availabilityRight}>3/8 Available</Text>
					</View>
					<View style={styles.progressBackground}>
						<View
							style={[
								styles.progressBar,
								{ width: '37%', backgroundColor: '#007bff' },
							]}
						/>
					</View>

					<TouchableOpacity style={styles.bookButton}>
						<Text style={styles.bookButtonText}>Book</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			<BottomNavigation navigation={navigation} activeTab="charging" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f8ff',
	},
	topbar: {
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 12,
		color: '#666',
		marginTop: 2,
	},
	filterContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginVertical: 10,
	},
	filterButton: {
		backgroundColor: '#e8f0ff',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	filterButtonActive: {
		backgroundColor: '#007bff',
	},
	filterText: {
		fontSize: 12,
		color: '#007bff',
		fontWeight: '500',
	},
	filterTextActive: {
		color: '#fff',
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	iconRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	stationName: {
		fontSize: 15,
		fontWeight: '600',
	},
	stationLocation: {
		fontSize: 12,
		color: '#777',
	},
	badgeGreen: {
		backgroundColor: '#00b894',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	badgeBlue: {
		backgroundColor: '#347fff',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#fff',
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 4,
	},
	detailLabel: {
		fontSize: 12,
		color: '#777',
	},
	detailValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#000',
	},
	availability: {
		fontSize: 12,
		color: '#777',
		marginTop: 8,
	},
	availabilityRight: {
		fontSize: 12,
		color: '#27ae60',
		marginTop: 8,
	},
	progressBackground: {
		height: 6,
		backgroundColor: '#eaeaea',
		borderRadius: 3,
		marginVertical: 4,
	},
	progressBar: {
		height: 6,
		backgroundColor: '#27ae60',
		borderRadius: 3,
	},
	bookButton: {
		backgroundColor: '#007bff',
		paddingVertical: 10,
		borderRadius: 8,
		marginTop: 8,
	},
	bookButtonText: {
		color: '#fff',
		fontWeight: '600',
		textAlign: 'center',
	},
	shadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
});
