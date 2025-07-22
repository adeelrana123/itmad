import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome';
const Wattsup = () => {
  const navigation = useNavigation();

 const openWhatsApp = () => {
  const phoneNumber = '923071111832'; 
  const message = 'Hello, I have a question regarding a product on Etimad Mart. Can you please assist me?';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  Linking.openURL(url).catch(err => console.error('Failed to open WhatsApp:', err));
};


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
