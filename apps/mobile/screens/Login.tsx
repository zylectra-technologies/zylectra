import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	StyleSheet,
	ScrollView,
	Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User2, Lock } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/api';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

function LoginScreen({ navigation }: { navigation: any }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const isButtonDisabled = !username || !password || loading;

	useEffect(() => {
		const checkLoggedIn = async () => {
			const token = await AsyncStorage.getItem('accessToken');
			if (token) {
				try {
					const res = await api.get('auth/me', {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					if (res.data) {
						navigation.navigate('Home');
					}
				} catch (error) {
					console.error('Error verifying token:', error);
				}
			}
		};
		checkLoggedIn();
	});

	const handleLogin = async () => {
		try {
			setLoading(true);

			const res = await api.post('auth/driver/login', { username, password });
			const data = res.data;
			console.log('Login response:', data);

			if (res.status === 200) {
				await AsyncStorage.setItem('accessToken', data.accessToken);
				Toast.show({
					type: 'success',
					text1: 'Login Successful',
					text2: `Welcome, ${username}!`,
				});
				navigation.navigate('Home');
			} else {
				Toast.show({
					type: 'error',
					text1: 'Login Failed',
					text2: data.message || 'Invalid credentials.',
				});
			}
		} catch (error: any) {
			console.error('Error logging in:', error);

			// Handle API error responses (e.g., 401)
			if (error.response) {
				Toast.show({
					type: 'error',
					text1: 'Login Failed',
					text2: error.response.data?.message || 'Invalid credentials.',
				});
			}
			// Handle network / server unreachable
			else if (error.request) {
				Toast.show({
					type: 'error',
					text1: 'Network Error',
					text2: 'Unable to reach server. Check your connection.',
				});
			}
			// Handle unexpected issues
			else {
				Toast.show({
					type: 'error',
					text1: 'Unexpected Error',
					text2: 'Something went wrong. Please try again later.',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				<Image source={require('../assets/logo.png')} style={styles.logo} />
				<Text style={styles.brand}>ZYLECTRA</Text>
				<Text style={styles.tagline}>
					Charge your vehicles not your anxiety
				</Text>

				<View style={styles.card}>
					<Text style={styles.welcome}>Welcome</Text>
					<Text style={styles.subtitle}>
						Login with your unique ID and password
					</Text>

					<View style={styles.inputContainer}>
						<User2 size={18} color="#999" style={styles.icon} />
						<TextInput
							placeholder="Enter Unique ID"
							style={styles.input}
							placeholderTextColor="#999"
							value={username}
							onChangeText={setUsername}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Lock size={18} color="#999" style={styles.icon} />
						<TextInput
							placeholder="Enter Password"
							secureTextEntry
							style={styles.input}
							placeholderTextColor="#999"
							value={password}
							onChangeText={setPassword}
						/>
					</View>

					<TouchableOpacity
						onPress={handleLogin}
						disabled={isButtonDisabled}
						style={isButtonDisabled && styles.disabledButton}
						activeOpacity={0.6}
					>
						<LinearGradient
							colors={['#3b82f6', '#10b981']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							style={[
								styles.loginButton,
								isButtonDisabled && styles.disabledButton,
							]}
						>
							<Text style={styles.loginText}>
								{loading ? 'Verifying...' : 'Verify and Login'}
							</Text>
						</LinearGradient>
					</TouchableOpacity>

					<View style={styles.footerRow}>
						<Text style={styles.footerText}>Forgot Password? </Text>
						<TouchableOpacity>
							<Text style={styles.linkText}>Contact Admin</Text>
						</TouchableOpacity>
					</View>
				</View>

				<Text style={styles.policyText}>
					By Continuing, you agree to our{' '}
					<Text style={styles.linkText}>terms and privacy policy.</Text>
				</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f8ff',
	},
	scrollContainer: {
		flexGrow: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	logo: {
		width: 90,
		height: 90,
		resizeMode: 'contain',
		marginBottom: 10,
	},
	brand: {
		fontSize: 28,
		fontWeight: '700',
		color: '#222',
		marginBottom: 4,
	},
	tagline: {
		fontSize: 14,
		color: '#555',
		marginBottom: 30,
	},
	card: {
		backgroundColor: '#fff',
		width: '100%',
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},
	welcome: {
		fontSize: 22,
		fontWeight: '700',
		textAlign: 'center',
		color: '#111',
		marginBottom: 6,
	},
	subtitle: {
		textAlign: 'center',
		color: '#666',
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 8,
		marginBottom: 12,
		backgroundColor: '#fafafa',
	},
	icon: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#000',
	},
	loginButton: {
		marginTop: 10,
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		shadowOpacity: 0.4,
		shadowRadius: 6,
		elevation: 3,
	},
	disabledButton: {
		opacity: 0.8,
		shadowOpacity: 0,
		elevation: 0,
	},
	loginText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
	disabledButtonText: {
		color: '#e0e0e0',
	},
	footerRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 12,
	},
	footerText: {
		color: '#555',
	},
	linkText: {
		color: '#007AFF',
		fontWeight: '600',
	},
	policyText: {
		fontSize: 12,
		color: '#777',
		textAlign: 'center',
		marginTop: 20,
	},
});

export default LoginScreen;
