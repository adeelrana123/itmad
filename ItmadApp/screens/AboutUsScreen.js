import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';

const AboutUsScreen = () => {
  const colors = useAppTheme();
  const navigation = useNavigation();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.background,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
      color: colors.text,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginBottom: 15,
    },
    bullet: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
      marginLeft: 10,
    },
    footerNote: {
      marginTop: 30,
      fontSize: 16,
      fontStyle: 'italic',
      textAlign: 'center',
      color: colors.text,
    },
  }), [colors]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="About Us" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Welcome to Etimad Mart</Text>

        <Text style={styles.paragraph}>
          Welcome to Etimad Mart, your trusted online shopping destination in Pakistan.
          We’re committed to delivering quality products at affordable prices, backed by excellent customer service.
        </Text>

        <Text style={styles.paragraph}>
          Whether you’re looking for grooming tools, fashion wear, kitchen essentials, or home accessories,
          we bring a wide range of products to your fingertips—all carefully selected to meet your daily needs.
          Our goal is to provide you with a smooth, secure, and satisfying shopping experience from start to finish.
        </Text>

        <Text style={styles.heading}>Why Choose Us?</Text>
        <Text style={styles.bullet}>✅ Affordable Prices – Great value without compromising quality</Text>
        <Text style={styles.bullet}>🚚 Nationwide Delivery – Fast and reliable shipping across Pakistan</Text>
        <Text style={styles.bullet}>🔒 Secure Checkout – Safe payment options for your peace of mind</Text>
        <Text style={styles.bullet}>💬 Customer Support – Reach out anytime via WhatsApp or email</Text>

        <Text style={styles.paragraph}>
          We believe in building long-term trust with our customers by offering not just products—but a promise of quality and care.
        </Text>

        <Text style={styles.footerNote}>
          Thank you for choosing Etimad Mart. We look forward to serving you!
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;
