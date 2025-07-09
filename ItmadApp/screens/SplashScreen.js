import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext'; 

const SplashScreen = () => {
  const navigation = useNavigation();
  const colors = useAppTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding:10,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
  });

  return (
    <View style={styles.container}>
      <Image source={require('../assets/etimad.png')} style={styles.image} />
    </View>
  );
};

export default SplashScreen;
