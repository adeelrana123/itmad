import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
// import useAppTheme from '../theme/useAppTheme';
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
          Etimad Mart is your trusted destination for convenient and reliable online shopping. 
          We aim to provide high-quality products at competitive prices, delivered right to your doorstep.
        </Text>

        <Text style={styles.subheading}>Our Mission</Text>
        <Text style={styles.paragraph}>
          To simplify shopping for everyone across Pakistan by offering a user-friendly platform,
          fast delivery, and excellent customer support.
        </Text>

        <Text style={styles.subheading}>What We Offer</Text>
        <Text style={styles.paragraph}>
          - A wide range of products including fashion, electronics, and home essentials.{"\n"}
          - Safe and secure payments.{"\n"}
          - Trackable orders and responsive support.{"\n"}
          - Guest checkout without account creation.
        </Text>

        <Text style={styles.subheading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          📧 Email: support@etimadmart.com{"\n"}
          📞 Phone: +92 300 5782560{"\n"}
          📍 Location: Lahore, Pakistan
        </Text>

        <Text style={styles.footerNote}>
          Thank you for choosing Etimad Mart – where trust meets convenience.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;
