import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { logout } from '../services/authApi';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const name = await AsyncStorage.getItem('username');
      const email = await AsyncStorage.getItem('email');
      const avatarUri = await AsyncStorage.getItem('avatar');

      if (token && name && email) {
        setUser({ name, email });
        if (avatarUri) setAvatar(avatarUri);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    if (isFocused) {
      setLoading(true);
      checkLogin();
    }
  }, [isFocused]);




  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera({ mediaType: 'photo', quality: 0.7 }, async (response) => {
              if (!response.didCancel && !response.errorCode) {
                const uri = response.assets[0].uri;
                setAvatar(uri);
                await AsyncStorage.setItem('avatar', uri);
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, async (response) => {
              if (!response.didCancel && !response.errorCode) {
                const uri = response.assets[0].uri;
                setAvatar(uri);
                await AsyncStorage.setItem('avatar', uri);
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('email');
      Alert.alert('Logged out successfully');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Logout failed', err.message);
    }
  };

  const handlePress = async (screen) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      navigation.navigate(screen);
    } else {
      navigation.navigate('Login', { redirectTo: 'Account' });
    }
  };

  const menuItems = [
    { title: 'My Orders', icon: 'list-alt', action: 'Orders', rightText: 'View All Orders >' },
    { title: 'My Messages', icon: 'envelope', action: 'My Messages' },
    { title: 'Help Center', icon: 'question-circle', action: 'Help Center' },
    { title: 'Settings', icon: 'cog', action: 'Settings' },
    { title: 'About Us', icon: 'info-circle', action: 'About Us' },
  ];

  const features = [
    { title: 'Exclusive incentives', icon: 'gift', desc: 'One-click checkout' },
    { title: 'Speedy refunds', icon: 'undo', desc: 'Safe transaction' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatar}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              ) : (
                <Ionicons name="person" size={40} color="black" />
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={18} color="red" />
              </View>
            </TouchableOpacity>

            <View>
              <Text style={styles.username}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.authWrapper}>
            <Text style={styles.headerText}>Hello, Welcome to Etimad!</Text>
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={menuItems}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.menuItem} onPress={() => handlePress(item.action)}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name={item.icon} size={20} color="#FF6B00" style={styles.menuIcon} />
              <View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                {item.subText && <Text style={styles.menuSubText}>{item.subText}</Text>}
              </View>
            </View>
            {item.rightText && <Text style={styles.menuRightText}>{item.rightText}</Text>}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* 👇 Show logout button only if user is logged in */}
      {user && (
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <FontAwesome name="sign-out" size={20} color="#FF6B00" style={styles.menuIcon} />
            <Text style={styles.menuTitle}>Logout</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Etimad Wallet Features</Text>
        <View style={styles.featuresRow}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <FontAwesome name={feature.icon} size={24} color="#FF6B00" />
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          ))}
        </View>
       <TouchableOpacity 
  style={styles.viewAllButton} 
  onPress={() => navigation.navigate('AdminChats')}
>
  <Text style={styles.viewAllText}>View All Product Chats</Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { backgroundColor: '#FF6B00' },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  username: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 14, color: 'white', marginTop: 5 },
  authWrapper: {
    padding: 15,
    backgroundColor: '#FF6B00',
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  signupButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'white',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: { color: '#FF6B00', textAlign: 'center', fontWeight: 'bold' },
  signupButtonText: { color: '#FF6B00', textAlign: 'center', fontWeight: 'bold' },
  menuItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 15, width: 24, textAlign: 'center' },
  menuTitle: { fontSize: 16, color: '#333' },
  menuSubText: { fontSize: 12, color: '#888', marginTop: 3 },
  menuRightText: { color: '#FF6B00', fontSize: 14 },
  featuresContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between' },
  featureCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  featureTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 10, color: '#333' },
  featureDesc: { fontSize: 12, color: '#666', marginTop: 5 },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: -10,
    // backgroundColor:'green',
    borderRadius: 10,
    padding: 4,
  },
  viewAllButton: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  backgroundColor: '#007bff',
  borderRadius: 8,
  alignSelf: 'center',
  marginVertical: 15,
},

viewAllText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});

export default AccountScreen;
