import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { signup } from '../services/authApi';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
 const colors = useAppTheme();
  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await signup(username, email, password);
      await AsyncStorage.setItem('token', String(response.token)); // if token exists
await AsyncStorage.setItem('username', response.user?.username || username);
await AsyncStorage.setItem('email', response.user?.email || email);
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('MainTabs'); 
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 24,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginBottom: 12,
      padding: 10,
      borderRadius: 5,
      height: 50,
      color: colors.text,
    },
    loginButton: {
      backgroundColor: colors.buttonBackground,
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 10,
      height: 50,
    },
    loginButtonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginText: {
      marginTop: 20,
      textAlign: 'center',
      color: colors.text,
    },
    loginLink: {
      color: 'blue',
      fontWeight: 'bold',
    },
  }), []);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Signup" />
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleSignup}
          disabled={loading}
          style={[
            styles.loginButton,
            { backgroundColor: loading ? 'blue' : colors.buttonBackground }
          ]}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignupScreen;
