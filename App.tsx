import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './ItmadApp/redux/store';
import AppNavigator from './ItmadApp/navigation/AppNavigator';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate, navigationRef } from './ItmadApp/navigation/RootNavigation';
import { LogLevel, OneSignal } from 'react-native-onesignal';
const App = () => {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  // Initialize with your OneSignal App ID
  OneSignal.initialize('4f64215b-617b-4fec-a511-2f6b2a25c120');
  // console.log('OneSignal:', OneSignal);

  OneSignal.Notifications.requestPermission(false);

useEffect(() => {
  OneSignal.User.pushSubscription.getIdAsync().then(async (pushId) => {
    const userId = await AsyncStorage.getItem('userId');
    if (userId && pushId) {
      await firestore().collection('Users').doc(userId).set({
        oneSignalId: pushId,
      }, { merge: true });
      // console.log('✅ OneSignal player ID saved:', pushId);
    }
  });
OneSignal.Notifications.addEventListener('click', event => {
  const data = event?.notification?.additionalData;

  if (data?.chatId) {
    const chatPayload = {
      userId: data.userId || '',
      chatId: data.chatId,
      title: data.title ?? 'No Title',
      image: data.image ?? '',
      price: data.price ? parseFloat(data.price) : 0,
      shipping: data.shipping ?? 'N/A',
      username: data.username ?? 'User',
    };

    console.log('📥 Notification Click Payload:', chatPayload); // 🔍 Debugging

    navigate('ChatScreen', chatPayload);
  }
});



}, []);

useEffect(() => {
  const checkStatus = async () => {
    const pushId = await OneSignal.User.pushSubscription.getIdAsync();
   const isSubscribed = await OneSignal.User.pushSubscription.getOptedInAsync();

    // console.log('📲 OneSignal ID:', pushId);
    console.log('✅ Is Subscribed:', isSubscribed);
  };

  checkStatus();
}, []);
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
