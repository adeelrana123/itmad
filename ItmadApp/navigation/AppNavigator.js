// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import BottomTabNavigator from './BottomTabNavigator';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
     <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About Us" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
