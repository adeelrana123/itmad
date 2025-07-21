import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';

const HelpCenterScreen = () => {
  const navigation = useNavigation();
  const theme = useAppTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@etimadmart.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+923071111832');
  };

  const handleWhatsAppPress = () => {
    Linking.openURL('https://wa.me/923071111832');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Help Center" />
      <ScrollView contentContainerStyle={styles(theme).container}>
        <Text style={styles(theme).heading}>Contact Us</Text>
        <Text style={styles(theme).paragraph}>
          Need Help? Contact Etimad Mart
        </Text>
        <Text style={styles(theme).paragraph}>
          We’re always here to support you! If you have any questions about your order, product details,
          delivery, or returns, don’t hesitate to reach out.
        </Text>

        <TouchableOpacity onPress={handleWhatsAppPress}>
          <Text style={styles(theme).linkItem}>WhatsApp us at 0307 1111832</Text>
        </TouchableOpacity>
           <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles(theme).linkItem}>📞 For  Call  0307 1111832</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles(theme).linkItem}>📧 Email: info@etimadmart.com</Text>
        </TouchableOpacity>

        <Text style={styles(theme).paragraph}>
          Our team is ready to assist you with quick and friendly support.
        </Text>
      </ScrollView>
    </View>
  );
};

export default HelpCenterScreen;

const styles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.background,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.text,
    },
    paragraph: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 12,
      lineHeight: 22,
    },
    linkItem: {
      fontSize: 16,
      color: theme.blue,
      textDecorationLine: 'underline',
      marginBottom: 10,
    },
  });
