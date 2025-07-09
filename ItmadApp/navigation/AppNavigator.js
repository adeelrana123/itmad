// navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';

import BottomTabNavigator from './BottomTabNavigator';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';

import CurrentUserScreen from '../screens/CurrentUserScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreens from '../components/CartScreens';
import OrderListScreen from '../screens/OrderListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ChatScreen from '../screens/ChatScreen';
import ProductReviews from '../components/ProductReviews';
import AdminChatListScreen from '../screens/AdminChatListScreen';
import BannerListScreen from '../components/BannerListScreen';
import BrandProductsScreen from '../screens/BrandProductsScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import MessageScreen from '../screens/MessageScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
     <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
     <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About Us" component={AboutUsScreen} />
      <Stack.Screen name="CurrentUser" component={CurrentUserScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="CartScreens" component={CartScreens} />
<Stack.Screen name="Orders" component={OrderListScreen} />
     <Stack.Screen name="My Messages" component={MessageScreen} />
     <Stack.Screen name="Help Center" component={HelpCenterScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
           <Stack.Screen name="ProductReviews" component={ProductReviews} />
           <Stack.Screen name="AdminChats" component={AdminChatListScreen} />
           <Stack.Screen name="BannerListScreen" component={BannerListScreen} />
           <Stack.Screen name="BrandProducts" component={BrandProductsScreen} />
           <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
           <Stack.Screen name="CategoryProductsScreen" component={CategoryProductsScreen} />
       

    </Stack.Navigator>
  );
};

export default AppNavigator;
