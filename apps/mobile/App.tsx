import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import LoginScreen from './screens/Login';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import HistoryScreen from './screens/History';
import Toast, {
	BaseToast,
	ErrorToast,
	SuccessToast,
} from 'react-native-toast-message';
import ChargingScreen from './screens/Charging';
import AlertsScreen from './screens/Alerts';

const Stack = createNativeStackNavigator();

const toastConfig = {
	success: (props: any) => (
		<SuccessToast
			{...props}
			style={{
				backgroundColor: '#2ECC40',
				borderLeftColor: '#2ECC40',
				color: '#fff',
				width: '90%',
				paddingVertical: 20,
				height: 'auto',
			}}
			text1Style={{
				fontSize: 16,
				fontWeight: 'bold',
				color: '#fff',
			}}
			text2Style={{
				color: '#fff',
				fontSize: 14,
			}}
		/>
	),
	error: (props: any) => (
		<ErrorToast
			{...props}
			style={{
				backgroundColor: '#FF4136',
				borderLeftColor: '#FF4136',
				color: '#fff',
				width: '90%',
				paddingVertical: 20,
				height: 'auto',
			}}
			text1Style={{
				fontSize: 16,
				color: '#fff',
				fontWeight: 'bold',
			}}
			text2Style={{
				color: '#fff',
				fontSize: 14,
			}}
		/>
	),
};

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Profile"
					component={ProfileScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="History"
					component={HistoryScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Charging"
					component={ChargingScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Alerts"
					component={AlertsScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
			<Toast config={toastConfig} />
		</NavigationContainer>
	);
}
