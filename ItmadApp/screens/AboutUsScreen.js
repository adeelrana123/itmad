import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import useAppTheme from '../theme/useAppTheme';

const AboutUsScreen = () => {
  const colors = useAppTheme();

  return (
    <View style={{ flex: 1 }}>
      <Header title="About Us" />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Welcome to Etimad Mart</Text>

        <Text style={[styles.paragraph, { color: colors.text }]}>
          Etimad Mart is your trusted destination for convenient and reliable online shopping. 
          We aim to provide high-quality products at competitive prices, delivered right to your doorstep.
        </Text>

        <Text style={[styles.subheading, { color: colors.text }]}>Our Mission</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          To simplify shopping for everyone across Pakistan by offering a user-friendly platform,
          fast delivery, and excellent customer support.
        </Text>

        <Text style={[styles.subheading, { color: colors.text }]}>What We Offer</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          - A wide range of products including fashion, electronics, and home essentials.{"\n"}
          - Safe and secure payments.{"\n"}
          - Trackable orders and responsive support.{"\n"}
          - Guest checkout without account creation.
        </Text>

        <Text style={[styles.subheading, { color: colors.text }]}>Contact Us</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          📧 Email: support@etimadmart.com{"\n"}
          📞 Phone: +92 300 5782560{"\n"}
          📍 Location: Lahore, Pakistan
        </Text>

        <Text style={[styles.footerNote, { color: colors.text }]}>
          Thank you for choosing Etimad Mart – where trust meets convenience.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  footerNote: {
    marginTop: 30,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
