import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
const AdminChatListScreen = () => {

  const [productChats, setProductChats] = useState([]);
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const getAvatar = async () => {
      const image = await AsyncStorage.getItem('avatar');
      setAvatar(image || '');
    };
    getAvatar();
  }, []);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('lastUpdated', 'desc') // ✅ newest chat at top
      .onSnapshot(snapshot => {
        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('🟥 chat data:', data);

          return {
            id: doc.id,
            title: data.title || data.product || doc.id,
            userName: data.user || data.userName || 'User',
            userImage: data.userImage || '',
            productImage: data.productImage || data.image || '',
            price: data.price ? `Rs. ${data.price}` : 'N/A',
            shipping: data.shipping || 'N/A',
            lastUpdated: data.lastUpdated?.seconds || 0,
            userId: data.userId || data.creator || 'fallback-id',
          };
        });

        setProductChats(products);
      });

    return () => unsubscribe();
  }, []);






  return (
    <View style={{ flex: 1, }}>
      <Header title={'Admin Chats'} />
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>

        <FlatList
          data={productChats}
          keyExtractor={item => item.id}

          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                const cartPayload = {
                  userId: item.userId,
                  chatId: item.id,
                  title: item.title,
                  image: item.productImage,
                  price: item.price.replace('Rs. ', ''),
                  shipping: item.shipping,
                  username: item.userName,
                };

                navigation.navigate('ChatScreen', cartPayload);
              }}
            >

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={styles.avatar}
                    onError={() => console.log('Failed to load avatar')}
                  />
                ) : (
                  <View style={styles.letterAvatar}>
                    <Text style={styles.letterText}>
                      {item.userName?.charAt(0)?.toUpperCase()}
                    </Text>
                  </View>
                )}

                <View style={styles.textContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


                    <Text style={styles.userName}>{item.userName}</Text>


                    <View style={styles.dateTimeRow}>
                      <Text style={styles.timeText}>
                        {item.lastUpdated
                          ? new Date(item.lastUpdated * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          : ''}
                      </Text>

                      <Text style={styles.dateText}>
                        {item.lastUpdated
                          ? new Date(item.lastUpdated * 1000).toLocaleDateString([], {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                          : ''}
                      </Text>
                    </View>

                  </View>
                  <Text numberOfLines={2} style={styles.titleText}>{item.title}</Text>
                </View>

              </View>

            </TouchableOpacity>

          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, },
  item: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: '#333',
    marginRight: 10
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    marginRight: 10, // as you requested
  },

  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    flexShrink: 1,
    maxWidth: '95%',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'black',
  },
  placeholderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  subText: {
    fontSize: 13,
    color: '#555',
  },
  letterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  timeText: {
    fontSize: 12,
    color: '#666',
  },

  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5
  },

});

export default AdminChatListScreen;
