import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';

const PrivacyPolicy = () => {
  const colors = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles(colors).container}>
        <Text style={styles(colors).heading}>Privacy Policy</Text>

        <Text style={styles(colors).paragraph}>
          At Etimad Mart, your privacy is very important to us. This Privacy Policy outlines how we collect,
          use, protect, and handle your personal information when you visit or make a purchase from etimadmart.com.
        </Text>

        <Text style={styles(colors).subheading}>1. Information We Collect</Text>
        <Text style={styles(colors).paragraph}>
          We may collect the following types of personal information:{"\n"}
          • Your name, phone number, email address, and shipping address{"\n"}
          • Order details and payment information{"\n"}
          • Information automatically collected through cookies and analytics tools
        </Text>

        <Text style={styles(colors).subheading}>2. How We Use Your Information</Text>
        <Text style={styles(colors).paragraph}>
          We use your information to:{"\n"}
          • Process and deliver your orders{"\n"}
          • Provide customer support{"\n"}
          • Improve our website and services{"\n"}
          • Send order updates, promotional offers, or newsletters (if opted-in)
        </Text>

        <Text style={styles(colors).subheading}>3. Sharing Your Information</Text>
        <Text style={styles(colors).paragraph}>
          We do not sell, trade, or rent your personal data to third parties. Your information may be shared with:{"\n"}
          • Payment gateways for order processing{"\n"}
          • Delivery partners to ship your orders{"\n"}
          • Legal authorities if required by law
        </Text>

        <Text style={styles(colors).subheading}>4. Data Security</Text>
        <Text style={styles(colors).paragraph}>
          We take appropriate steps to protect your personal data using secure servers, SSL encryption,
          and restricted access protocols.
        </Text>

        <Text style={styles(colors).subheading}>5. Cookies</Text>
        <Text style={styles(colors).paragraph}>
          Our website uses cookies to enhance your browsing experience, remember login details,
          and track user behavior anonymously for performance improvements.
        </Text>

        <Text style={styles(colors).subheading}>6. Your Rights</Text>
        <Text style={styles(colors).paragraph}>
          You have the right to:{"\n"}
          • Access or update your personal data{"\n"}
          • Request deletion of your information{"\n"}
          • Opt-out of marketing communications at any time
        </Text>

        <Text style={styles(colors).subheading}>7. Third-Party Links</Text>
        <Text style={styles(colors).paragraph}>
          Our website may contain links to third-party websites. We are not responsible for their privacy practices
          and encourage you to review their policies.
        </Text>

        <Text style={styles(colors).subheading}>8. Policy Updates</Text>
        <Text style={styles(colors).paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page
          with the updated effective date.
        </Text>

        <Text style={styles(colors).subheading}>Contact Us</Text>
        <Text style={styles(colors).paragraph}>
          If you have any questions about this Privacy Policy, please contact us:{"\n"}
          📧 Email: info@etimadmart.com{"\n"}
          📞 Phone/WhatsApp: 0307 1111832
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
  });
