import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { login } from '../services/authApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const colors = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const handleLogin = () => {
  login(email, password)
    .then(async (res) => {
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('username', res.data.user.username);
      await AsyncStorage.setItem('email', res.data.user.email);
await AsyncStorage.setItem('profileImage', res.data.user.image || '');
      await AsyncStorage.setItem('userId', res.data.user._id);
     

      Alert.alert('Login Success', `Welcome ${res.data.user.username}`);

      const redirectTo = route.params?.redirectTo;
      if (redirectTo) {
        navigation.replace(redirectTo);
      } else {
        navigation.replace('MainTabs');
      }
    })
    .catch(err =>
      Alert.alert('Login Failed', err?.response?.data?.message || err.message)
    );
};

  return (
    <View style={{ flex: 1 }}>
      <Header title={'Login Screen'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor={colors.placeholderText}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={colors.placeholderText}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>If you don't have an account, </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    height: 50,
  },
  loginButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    height: 50,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
