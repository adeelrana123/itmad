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
    Linking.openURL('mailto:support@etimadmart.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+923001234567');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="Help Center" />
      <ScrollView contentContainerStyle={styles(theme).container}>
        <Text style={styles(theme).heading}>Welcome to Help Center</Text>
        <Text style={styles(theme).paragraph}>
          If you have any issues with your orders, payments, or account, you can contact us through the following methods:
        </Text>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles(theme).linkItem}>📧 Email: support@etimadmart.com</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles(theme).linkItem}>📞 Phone: 0308 5782560</Text>
        </TouchableOpacity>

        <Text style={styles(theme).item}>⏰ Support Hours: 9 AM – 6 PM (Mon – Sat)</Text>
        <Text style={styles(theme).paragraph}>
          For common questions, visit our FAQ section in the app or website.
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
      marginBottom: 15,
      color: theme.text,
    },
    paragraph: {
      fontSize: 16,
      color: theme.mutedText,
      marginBottom: 15,
      lineHeight: 22,
    },
    item: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 10,
    },
    linkItem: {
      fontSize: 16,
      color: theme.blue,
      textDecorationLine: 'underline',
      marginBottom: 10,
    },
  });
