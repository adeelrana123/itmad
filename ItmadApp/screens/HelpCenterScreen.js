import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login', { redirectTo: 'Help' });
      } else {
        setCheckingLogin(false);
      }
    };
    checkLogin();
  }, []);

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@etimadmart.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+923001234567');
  };

  if (checkingLogin) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Help Center" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Welcome to Help Center</Text>
        <Text style={styles.paragraph}>
          If you have any issues with your orders, payments, or account, you can contact us through the following methods:
        </Text>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.linkItem}>📧 Email: support@etimadmart.com</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.linkItem}>📞 Phone: 0308 5782560</Text>
        </TouchableOpacity>

        <Text style={styles.item}>⏰ Support Hours: 9 AM – 6 PM (Mon – Sat)</Text>
        <Text style={styles.paragraph}>
          For common questions, visit our FAQ section in the app or website.
        </Text>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 15,
    lineHeight: 22,
  },
  item: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  linkItem: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});
