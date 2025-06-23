import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessageScreen = () => {
  const navigation = useNavigation();
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login', { redirectTo: 'Message' });
      } else {
        setCheckingLogin(false);
      }
    };
    checkLogin();
  }, []);

  const openWhatsApp = () => {
    const phoneNumber = '923085782560'; 
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch(err => console.error('Failed to open WhatsApp:', err));
  };

  if (checkingLogin) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title="Message Screen" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
          <Icon name="whatsapp" size={24} color="#fff" />
          <Text style={styles.whatsappText}>Chat on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});
