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
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';


const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const colors = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch(); // ✅ Correctly get dispatch function here

const handleLogin = async () => {
  try {
    const data = await login(email, password);
    const userData = data.user;

    if (!userData) {
      Alert.alert('Login Failed', 'User data not found.');
      return;
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('username', userData.username);
    await AsyncStorage.setItem('email', userData.email);
    await AsyncStorage.setItem('profileImage', userData.image || '');
    await AsyncStorage.setItem('userId', userData._id);

    dispatch(loginSuccess(userData));
    Alert.alert('Login Success', `Welcome ${userData.username}`);

   if (route.params?.returnTo === 'Detail') {
  navigation.replace('Detail', route.params.returnParams);
} else {
  navigation.replace('MainTabs');
}
  } catch (err) {
    console.error('❌ Login Error:', err?.response?.data || err.message);
    setTimeout(() => {
      Alert.alert('Login Failed', err?.response?.data?.message || err.message);
    }, 100);
  }
};

  const styles = React.useMemo(() => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: colors.background },
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
    signupContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    signupText: {
      color: colors.blue,
      fontWeight: 'bold',
    },
  }), [colors]);
return (
  <View style={{ flex: 1 }}>
    <Header title={'Login Screen'} />
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={colors.placeholderText}
        keyboardType="email-address"
        autoCapitalize="none"
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
        <Text style={{ color: colors.text }}>If you don't have an account, </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

};

export default LoginScreen;
