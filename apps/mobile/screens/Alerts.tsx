import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, MapPin, AlertCircle } from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function AlertsScreen({ navigation }: { navigation: any }) {
	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.topbar}>
					<View>
						<Text style={styles.title}>Notification</Text>
						<Text style={styles.subtitle}>3 New Updates</Text>
					</View>

					<TouchableOpacity>
						<Text style={styles.markRead}>Mark all Read</Text>
					</TouchableOpacity>
				</View>

				{/* Filter Buttons */}
				<View style={styles.filterRow}>
					<TouchableOpacity style={[styles.filterButton, styles.filterActive]}>
						<Text style={[styles.filterText, { color: '#fff' }]}>All</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.filterButton, { borderColor: '#007bff' }]}
					>
						<Text style={[styles.filterText, { color: '#007bff' }]}>
							Routes
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.filterButton, { borderColor: '#00c851' }]}
					>
						<Text style={[styles.filterText, { color: '#00c851' }]}>
							Charging
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.filterButton, { borderColor: '#ff4444' }]}
					>
						<Text style={[styles.filterText, { color: '#ff4444' }]}>
							Alerts
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView contentContainerStyle={styles.scroll}>
					{/* New Section */}
					<Text style={styles.sectionTitle}>New</Text>

					<View
						style={[
							styles.card,
							{ borderWidth: 0, borderTopColor: '#007bff', borderTopWidth: 5 },
						]}
					>
						<View style={styles.cardHeader}>
							<MapPin color="#007bff" size={20} />
							<Text style={[styles.cardTitle]}>Route Update</Text>
							<Text style={styles.badge}>New</Text>
						</View>
						<Text style={styles.cardText}>
							Dispatcher has modified your route; added 2 stops in Sector 40.
						</Text>
						<Text style={styles.cardTime}>4 mins ago</Text>
					</View>

					{/* Earlier Section */}
					<Text style={[styles.sectionTitle, { marginTop: 16 }]}>Earlier</Text>

					<View
						style={[
							styles.card,
							{ borderWidth: 0, borderTopColor: '#00c851', borderTopWidth: 5 },
						]}
					>
						<View style={styles.cardHeader}>
							<Zap color="#00c851" size={20} />
							<Text style={[styles.cardTitle]}>Charge Slot Available</Text>
						</View>
						<Text style={styles.cardText}>
							Your preferred slot is now available with 5 slots at Eco Green
							Station.
						</Text>
						<Text style={styles.cardTime}>37 mins ago</Text>
					</View>

					<View
						style={[
							styles.card,
							{ borderWidth: 0, borderTopColor: '#ff4444', borderTopWidth: 5 },
						]}
					>
						<View style={styles.cardHeader}>
							<AlertCircle color="#ff4444" size={20} />
							<Text style={[styles.cardTitle, { color: '#ff4444' }]}>
								Low SoC Alert
							</Text>
						</View>
						<Text style={styles.cardText}>
							Current battery at 56%. Recommended charging stop within 15 kms.
						</Text>
						<Text style={styles.cardTime}>40 mins ago</Text>
					</View>
				</ScrollView>

				{/* Bottom Navigation */}
				<BottomNavigation activeTab="alerts" navigation={navigation} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#f8faff',
	},
	container: {
		flex: 1,
		backgroundColor: '#f8faff',
	},
	topbar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#000',
	},
	subtitle: {
		fontSize: 12,
		color: '#666',
		marginTop: 2,
	},
	markRead: {
		color: '#003baa',
		fontWeight: '500',
	},
	filterRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	filterButton: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 20,
		borderWidth: 1,
	},
	filterActive: {
		backgroundColor: '#003baa',
		borderColor: '#003baa',
	},
	filterText: {
		fontSize: 13,
		fontWeight: '500',
	},
	scroll: {
		padding: 16,
		paddingBottom: 80,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: '#666',
		marginBottom: 8,
	},
	card: {
		backgroundColor: '#fff',
		padding: 14,
		borderRadius: 12,
		borderWidth: 1.5,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	cardTitle: {
		fontSize: 15,
		fontWeight: '600',
	},
	badge: {
		marginLeft: 'auto',
		fontSize: 10,
		fontWeight: '600',
		color: '#007bff',
		backgroundColor: '#e6efff',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	cardText: {
		fontSize: 13,
		color: '#555',
	},
	cardTime: {
		fontSize: 11,
		color: '#999',
		marginTop: 6,
	},
});
