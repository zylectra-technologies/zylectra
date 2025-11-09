import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Bell, Zap, Clock, User } from 'lucide-react-native';

const BottomNavigation = ({
	activeTab = 'home',
	navigation,
}: {
	activeTab: string;
	navigation: any;
}) => {
	return (
		<View style={styles.bottomNav}>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('Home')}
			>
				<Home size={24} color={activeTab === 'home' ? '#007AFF' : '#888'} />
				<Text
					style={[
						styles.navLabel,
						{ color: activeTab === 'home' ? '#007AFF' : '#888' },
					]}
				>
					Home
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('Alerts')}
			>
				<Bell size={24} color={activeTab === 'alerts' ? '#007AFF' : '#888'} />
				<Text
					style={[
						styles.navLabel,
						{ color: activeTab === 'alerts' ? '#007AFF' : '#888' },
					]}
				>
					Alerts
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('History')}
			>
				<Clock size={24} color={activeTab === 'history' ? '#007AFF' : '#888'} />
				<Text
					style={[
						styles.navLabel,
						{ color: activeTab === 'history' ? '#007AFF' : '#888' },
					]}
				>
					History
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('Charging')}
			>
				<Zap size={24} color={activeTab === 'charging' ? '#007AFF' : '#888'} />
				<Text
					style={[
						styles.navLabel,
						{ color: activeTab === 'charging' ? '#007AFF' : '#888' },
					]}
				>
					Charging
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.navItem}
				onPress={() => navigation.navigate('Profile')}
			>
				<User size={24} color={activeTab === 'profile' ? '#007AFF' : '#888'} />
				<Text
					style={[
						styles.navLabel,
						{ color: activeTab === 'profile' ? '#007AFF' : '#888' },
					]}
				>
					Profile
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	bottomNav: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingVertical: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#eee',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 2,
	},
	navItem: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	navLabel: {
		fontSize: 11,
		marginTop: 4,
	},
});

export default BottomNavigation;
