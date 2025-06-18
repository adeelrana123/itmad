// screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useAppTheme from '../theme/useAppTheme';
import Header from '../components/Header';
import UserList from '../components/UserList';


const HomeScreen = () => {
  const colors = useAppTheme();

  return (
   <View style={{ flex: 1 }}>
  <Header title="Home" />
  <View style={[styles.container, { backgroundColor: colors.background }]}>
  <UserList />
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

export default HomeScreen;
