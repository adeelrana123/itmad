// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../components/Header';
// import Icon from 'react-native-vector-icons/FontAwesome';

// const MessageScreen = () => {
//   const navigation = useNavigation();
//   const [checkingLogin, setCheckingLogin] = useState(true);

//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         navigation.navigate('Login', { redirectTo: 'Message' });
//       } else {
//         setCheckingLogin(false);
//       }
//     };
//     checkLogin();
//   }, []);

//   const openWhatsApp = () => {
//     const phoneNumber = '923085782560'; 
//     const url = `https://wa.me/${phoneNumber}`;
//     Linking.openURL(url).catch(err => console.error('Failed to open WhatsApp:', err));
//   };

//   if (checkingLogin) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#FF6B00" />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Header title="Message Screen" />
//       <View style={styles.container}>
//         <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
//           <Icon name="whatsapp" size={24} color="#fff" />
//           <Text style={styles.whatsappText}>Chat on WhatsApp</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default MessageScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2e7d32',
//     marginBottom: 20,
//   },
//   whatsappButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#25D366',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   whatsappText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 10,
//     fontWeight: '600',
//   },
// });


import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AdminChatListScreen = () => {
  const [chatList, setChatList] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [username, setUsername] = useState('');

  const navigation = useNavigation();
  useEffect(() => {
  const fetchUsername = async () => {
    const storedName = await AsyncStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
    }
  };
  fetchUsername();
}, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(snapshot => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatList(chats);
      });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
  const getUserInfo = async () => {
    const name = await AsyncStorage.getItem('username');
    const image = await AsyncStorage.getItem('avatar');
    if (name) setUsername(name);
    if (image) setUserImage(image); 
  };

  getUserInfo();
}, []);

const renderItem = ({ item }) => {
  const firstLetter = username?.charAt(0)?.toUpperCase() || '?';

  return (
    <TouchableOpacity
      style={styles.chatItem}
    onPress={() =>
  navigation.navigate('ChatScreen', {
    title: item.id,
    image: item.image || null,
    price: item.price || '',
    shipping: item.shipping || '',
  })
}
    >
      {userImage ? (
        <Image
          source={{ uri: userImage }}
          style={styles.userImage}
        />
      ) : (
        <View style={styles.placeholderCircle}>
          <Text style={styles.placeholderText}>{firstLetter}</Text>
        </View>
      )}
      <View>
        <Text style={styles.userName}>{username}</Text>
      </View>
    </TouchableOpacity>
  );
};



  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No chats yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
  },
  placeholderCircle: {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
placeholderText: {
  fontSize: 20,
  color: '#fff',
  fontWeight: 'bold',
},
});

export default AdminChatListScreen;



