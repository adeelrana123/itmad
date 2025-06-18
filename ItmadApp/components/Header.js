import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import useAppTheme from '../theme/useAppTheme';


const Header = ({ title }) => {
  const colors = useAppTheme();

  return (
     <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Header;
