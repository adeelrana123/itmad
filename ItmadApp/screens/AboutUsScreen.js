import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import useAppTheme from '../theme/useAppTheme';

const AboutUsScreen = () => {
  const colors = useAppTheme();

  return (
    <View style={{ flex: 1 }}>
      <Header title="About Us" />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.blue }]}>
          Settings screen .
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default AboutUsScreen;
