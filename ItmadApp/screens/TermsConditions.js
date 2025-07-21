import { StyleSheet, Text, View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';

const TermsConditions = () => {
  const colors = useAppTheme();

  const handleLinkPress = () => {
    Linking.openURL('https://etimadmart.com');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Terms & Conditions" />
      <ScrollView contentContainerStyle={styles(colors).container}>
        <Text style={styles(colors).heading}>Terms & Conditions</Text>

        <Text style={styles(colors).paragraph}>
          By accessing or using Etimad Mart, you agree to be bound by the following terms and conditions.
          Please read them carefully before proceeding.
        </Text>

        <Text style={styles(colors).subheading}>1. Use of the Website</Text>
        <Text style={styles(colors).paragraph}>
          You agree to use the platform for lawful purposes only. Any misuse of content, listings, or services
          will result in account suspension or legal action.
        </Text>

        <Text style={styles(colors).subheading}>2. Product Information</Text>
        <Text style={styles(colors).paragraph}>
          We strive to display product descriptions and prices accurately. However, Etimad Mart is not responsible
          for typographical errors or outdated details.
        </Text>

        <Text style={styles(colors).subheading}>3. Order Acceptance</Text>
        <Text style={styles(colors).paragraph}>
          We reserve the right to accept or cancel any order for reasons including product availability, errors in
          pricing, or payment issues.
        </Text>

        <Text style={styles(colors).subheading}>4. Payment</Text>
        <Text style={styles(colors).paragraph}>
          All payments must be made through secure and authorized methods. We do not store your card or bank details.
        </Text>

        <Text style={styles(colors).subheading}>5. Shipping</Text>
        <Text style={styles(colors).paragraph}>
          Shipping times are estimates and may vary due to external conditions. Etimad Mart is not liable for
          courier delays.
        </Text>

        <Text style={styles(colors).subheading}>6. Returns & Refunds</Text>
        <Text style={styles(colors).paragraph}>
          Please refer to our Return Policy. Items must be returned unused and within the specified time.
        </Text>

        <Text style={styles(colors).subheading}>7. Intellectual Property</Text>
        <Text style={styles(colors).paragraph}>
          All content including images, logos, and text on Etimad Mart is protected and may not be copied or
          reused without permission.
        </Text>

        <Text style={styles(colors).subheading}>8. Changes to Terms</Text>
        <Text style={styles(colors).paragraph}>
          We reserve the right to change these terms at any time. Updated versions will be posted on the website.
        </Text>

        <Text style={styles(colors).subheading}>9. Contact</Text>
        <Text style={styles(colors).paragraph}>
          If you have questions or concerns regarding these terms, contact us via:
          {"\n"}📧 Email: info@etimadmart.com
          {"\n"}📞 Phone/WhatsApp: 0307 1111832
        </Text>

        <Text style={styles(colors).footerNote}>
          To learn more, please visit:
        </Text>
        <TouchableOpacity onPress={handleLinkPress}>
          <Text style={styles(colors).link}>https://etimadmart.com</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TermsConditions;

const styles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.text,
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 8,
      color: colors.text,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    footerNote: {
      fontSize: 16,
      marginTop: 25,
      color: colors.text,
    },
    link: {
      fontSize: 16,
      color: '#007BFF',
      textDecorationLine: 'underline',
      marginTop: 5,
    },
  });
