import React, { useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Switch,
	TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
	User,
	IdCard,
	Phone,
	Mail,
	Calendar,
	Car,
	Hash,
	Bell,
	Pencil,
	ArrowLeft,
	LogOut,
} from 'lucide-react-native';
import BottomNavigation from '../components/BottomNavigation';
import { MapPin } from 'lucide-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
	const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
	const [userData, setUserData] = React.useState(null);

	const handleLogout = async () => {
		AsyncStorage.clear();
		navigation.replace('Login');
	};

	// TODO: Move to other file
	const formatDateWithOrdinal = dateString => {
		if (!dateString) return '';

		const date = new Date(dateString);
		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'long' });
		const year = date.getFullYear();

		// Add the ordinal suffix (st, nd, rd, th)
		const suffix =
			day % 10 === 1 && day !== 11
				? 'st'
				: day % 10 === 2 && day !== 12
					? 'nd'
					: day % 10 === 3 && day !== 13
						? 'rd'
						: 'th';

		return `${day}${suffix} ${month}, ${year}`;
	};

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
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<LinearGradient
				colors={['#3b82f6', '#10b981']}
				style={styles.header}
				angle={90}
			>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<ArrowLeft color="#fff" size={24} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>My Profile</Text>
				<Pencil color="#fff" size={22} />
			</LinearGradient>

			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				{/* Personal Info */}
				<Text style={styles.sectionTitle}>Personal Information</Text>
				<View style={styles.card}>
					<InfoRow
						icon={<User color="#3b82f6" />}
						label="Name"
						value={userData?.user?.name ?? 'Prakash Yadav'}
						bgColor="#dbeafe"
					/>
					<InfoRow
						icon={<IdCard color="#10b981" />}
						label="Driver ID"
						value={userData?.user?.username ?? 'DRIVER12345'}
						bgColor="#d1fae5"
					/>
					<InfoRow
						icon={<Phone color="#ef4444" />}
						label="Phone Number"
						value={userData?.user?.contactInfo ?? '9876543210'}
						bgColor="#fee2e2"
					/>
					<InfoRow
						icon={<Mail color="#f59e0b" />}
						label="Email ID"
						value={userData?.user?.email ?? 'hsardana@test.com'}
						bgColor="#ffedd5"
					/>
					<InfoRow
						icon={<Calendar color="#3b82f6" />}
						label="Member Since"
						value={
							formatDateWithOrdinal(userData?.user?.createdAt) ??
							'12th January, 2022'
						}
						bgColor="#dbeafe"
					/>
				</View>

				{/* Vehicle Info */}
				<Text style={styles.sectionTitle}>Vehicle Information</Text>
				<View style={styles.card}>
					<InfoRow
						icon={<Car color="#3b82f6" />}
						label="Vehicle Name"
						value="Tata Nexon EV"
					/>
					<InfoRow
						icon={<Hash color="#3b82f6" />}
						label="License Plate"
						value="DL 01 EV 2345"
					/>
				</View>

				{/* Preferences */}
				<Text style={styles.sectionTitle}>Preference</Text>
				<View style={styles.card}>
					<View style={styles.infoRow}>
						<View style={styles.labelContainer}>
							<Bell color="#3b82f6" />
							<View style={{ marginLeft: 10 }}>
								<Text style={styles.infoLabel}>Push Notifications</Text>
								<Text style={styles.infoSubText}>
									Get alerts about trips and charging
								</Text>
							</View>
						</View>
						<Switch
							value={notificationsEnabled}
							onValueChange={setNotificationsEnabled}
							thumbColor={notificationsEnabled ? '#10b981' : '#ccc'}
							trackColor={{ true: '#a7f3d0', false: '#e5e7eb' }}
						/>
					</View>
					<View style={styles.infoRow}>
						<View style={styles.labelContainer}>
							<Bell color="#3b82f6" />
							<View style={{ marginLeft: 10 }}>
								<Text style={styles.infoLabel}>Location Tracking</Text>
								<Text style={styles.infoSubText}>
									Enable real-time location updates.
								</Text>
							</View>
						</View>
						<Switch
							value={notificationsEnabled}
							onValueChange={setNotificationsEnabled}
							thumbColor={notificationsEnabled ? '#10b981' : '#ccc'}
							trackColor={{ true: '#a7f3d0', false: '#e5e7eb' }}
						/>
					</View>
				</View>
				<TouchableOpacity
					onPress={handleLogout}
					style={{
						backgroundColor: '#fee2e2',
						width: '100%',
						padding: 16,
						borderRadius: 12,
						alignItems: 'center',
						marginTop: 20,
						borderColor: 'red',
						borderWidth: 2,
						borderStyle: 'dashed',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						gap: 10,
					}}
				>
					<LogOut color="red" size={20} />
					<Text
						style={{
							color: 'red',
							fontWeight: 'bold',
						}}
					>
						Log Out
					</Text>
				</TouchableOpacity>
			</ScrollView>

			{/* Bottom Navigation */}
			<BottomNavigation activeTab="profile" navigation={navigation} />
		</SafeAreaView>
	);
}

/* ---------------- COMPONENT ---------------- */
const InfoRow = ({ icon, label, value, bgColor }) => (
	<View style={styles.infoRow}>
		<View style={styles.labelContainer}>
			<View
				style={{
					backgroundColor: bgColor,
					padding: 10,
					borderRadius: 20,
					gap: 10,
				}}
			>
				{icon}
			</View>
			<View
				style={{ display: 'flex', flexDirection: 'column', marginRight: 30 }}
			>
				<Text style={styles.infoLabel}>{label}</Text>
				<Text style={styles.infoValue}>{value}</Text>
			</View>
		</View>
	</View>
);

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f8ff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 20,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	headerTitle: {
		fontSize: 20,
		flex: 3,
		fontWeight: 'bold',
		color: '#fff',
	},
	scrollContainer: {
		padding: 16,
		paddingBottom: 80,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#1a1a1a',
		marginBottom: 10,
		marginTop: 10,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 3,
		elevation: 2,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	labelContainer: {
		flexDirection: 'row',
		gap: 20,
		alignItems: 'center',
	},
	infoLabel: {
		fontSize: 15,
		color: '#444',
	},
	infoValue: {
		fontSize: 15,
		fontWeight: '500',
		color: '#111',
		textAlign: 'left',
	},
	infoSubText: {
		fontSize: 12,
		color: '#777',
	},
});
