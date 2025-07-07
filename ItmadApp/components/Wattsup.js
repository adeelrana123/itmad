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
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
const Wattsup = () => {
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
      <View style={styles.container}>
        <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
          <Icon name="whatsapp" size={30} color="#fff" />
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wattsup;

const styles = StyleSheet.create({
 wattsupButtonWrapper: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  zIndex: 10,
},
 whatsappButton: {
  width: 50,
  height: 50,
  borderRadius: 25, 
  backgroundColor: '#25D366',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},
});
