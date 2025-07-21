import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { logout } from '../services/authApi';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { logoutredux } from '../redux/authSlice';

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  const CLOUDINARY_UPLOAD_PRESET = 'etimad_avatar_upload';
  const CLOUDINARY_CLOUD_NAME = 'dzp0kj3rw';

  const uploadToCloudinary = async (fileUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const name = await AsyncStorage.getItem('username');
      const email = await AsyncStorage.getItem('email');

      if (token && name && email) {
        setUser({ name, email });
        const avatarUri = await AsyncStorage.getItem(`avatar-${email}`);
        if (avatarUri) setAvatar(avatarUri);
        else setAvatar(null);
      } else {
        setUser(null);
        setAvatar(null);
      }

      setLoading(false);
    };

    if (isFocused) {
      checkLogin();
    }
  }, [isFocused]);

  const pickImage = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => {
          launchCamera({ mediaType: 'photo', quality: 0.7 }, async (response) => {
            if (!response.didCancel && !response.errorCode) {
              const uri = response.assets[0].uri;
              const imageUrl = await uploadToCloudinary(uri);
              if (imageUrl) {
                setAvatar(imageUrl);
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                  await AsyncStorage.setItem(`avatar-${storedEmail}`, imageUrl);
                }
                Alert.alert('Success', 'Profile image updated!');
              } else {
                Alert.alert('Upload failed', 'Unable to upload image.');
              }
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
              const imageUrl = await uploadToCloudinary(uri);
              if (imageUrl) {
                setAvatar(imageUrl);
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                  await AsyncStorage.setItem(`avatar-${storedEmail}`, imageUrl);
                }
                Alert.alert('Success', 'Profile image updated!');
              } else {
                Alert.alert('Upload failed', 'Unable to upload image.');
              }
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutredux());
      await AsyncStorage.multiRemove(['token', 'username', 'email']);
      Alert.alert('Logged out successfully');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Logout failed', err.message);
    }
  };

  // ✅ Navigation handler for menu actions
  const handlePress = (action) => {
    switch (action) {
      case 'My Orders':
        navigation.navigate('My Orders'); 
        break;
      case 'Help Center':
        navigation.navigate('Help Center');
        break;
      case 'Settings':
        navigation.navigate('Settings');
        break;
      case 'About Us':
        navigation.navigate('About Us');
        break;
      case 'TermsConditions':
        navigation.navigate('TermsConditions');
        break;
      case 'PrivacyPolicy':
        navigation.navigate('PrivacyPolicy');
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const menuItems = [
    { title: 'My Orders', icon: 'list-alt', action: 'My Orders', rightText: 'View All Orders >' },
    { title: 'Help Center', icon: 'question-circle', action: 'Help Center' },
    { title: 'Settings', icon: 'cog', action: 'Settings' },
    { title: 'About Us', icon: 'info-circle', action: 'About Us' },
    { title: 'Terms & Conditions', icon: 'file-text', action: 'TermsConditions' },
    { title: 'Privacy Policy', icon: 'shield', action: 'PrivacyPolicy' },
    // { title: 'Contact Us', icon: 'envelope', action: 'ContactUs' },
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
                <Image source={{ uri: avatar }} style={{ width: 60, height: 60, borderRadius: 30 }} />
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
            <Text style={styles.headerText}>Welcome to Etimad Mart!</Text>
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
              </View>
            </View>
            {item.rightText && <Text style={styles.menuRightText}>{item.rightText}</Text>}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

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
