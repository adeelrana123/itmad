import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { signup } from '../services/authApi';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import useAppTheme from '../theme/useAppTheme';

const SignupScreen = () => {
  const navigation = useNavigation();
 const colors = useAppTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userdata = { username, email, password };
console.log("userdata is",userdata)
const handleSignup = async () => {
  try {
    await signup(username, email, password);

    // ✅ Save username locally
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('avatar', '');

    Alert.alert('Signup Success');
    navigation.navigate('MainTabs');
  } catch (err) {
    Alert.alert(
      'Signup Failed',
      err.response?.data?.message || err.message
    );
  }
};


  return (
    <View style={{ flex: 1 }}>
      <Header title={'Signup Screen'}/>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
   

    
    <View >
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
       <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              <Text style={styles.loginButtonText}>Signup</Text>
            </TouchableOpacity>
     

      <View style={styles.loginContainer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
    height:50
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: 'blue',
    fontWeight: 'bold',
  },
    loginButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    height:50
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
