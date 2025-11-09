import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface IconInputProps {
	value?: string;
	onChangeText?: (text: string) => void;
	placeholder?: string;
	icon?: React.ReactNode;
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
	secureTextEntry?: boolean;
}

export default function IconInput({
	value,
	onChangeText,
	placeholder = '',
	icon,
	keyboardType = 'default',
	secureTextEntry = false,
}: IconInputProps) {
	// Internal state for uncontrolled input
	const [internalValue, setInternalValue] = useState(value || '');

	const handleChange = (text: string) => {
		setInternalValue(text); // update internal state
		if (onChangeText) {
			onChangeText(text); // call parent callback if provided
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>{icon}</View>
			<TextInput
				style={styles.input}
				value={value !== undefined ? value : internalValue} // controlled or internal
				onChangeText={handleChange}
				placeholder={placeholder}
				placeholderTextColor="#aaa"
				keyboardType={keyboardType}
				secureTextEntry={secureTextEntry}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1.0,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 6,
		marginVertical: 8,
		fontFamily: 'Poppins-Regular',
		backgroundColor: '#fff',
	},
	iconContainer: {
		marginRight: 8,
	},
	input: {
		flex: 1,
		fontSize: 12,
		fontFamily: 'Poppins-Regular',
		color: '#111',
		outlineStyle: 'none',
	},
});
