import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ route }) => {
  const { image, title, price, shipping } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('User');
  const [adminMessage, setAdminMessage] = useState('');
  const scrollViewRef = useRef();

  const chatCollection = firestore()
    .collection('chats')
    .doc(title)
    .collection('messages');

  useEffect(() => {
    const initializeChat = async () => {
      const name = await AsyncStorage.getItem('username');
      if (name) setUsername(name);

      const unsubscribe = chatCollection
        .orderBy('createdAt', 'asc')
        .onSnapshot(snapshot => {
          const fetched = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(fetched);
        });

      return unsubscribe;
    };

    initializeChat();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('username');
      const userImage = await AsyncStorage.getItem('userImage');
      const userPhone = await AsyncStorage.getItem('phoneNumber');

      await firestore().collection('chats').doc(title).set({
        title: title,
        user: userName || 'User',
        userName: userName || 'User',
        userImage: userImage || '',
        userPhone: userPhone || '',
        image: image || '',
        price: price || 0,
        shipping: shipping || 'N/A',
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      await chatCollection.add({
        text: message.trim(),
        sender: userName || 'User',
        senderId: userId || '',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleAdminReply = async () => {
    if (!adminMessage.trim()) return;

    await chatCollection.add({
      text: adminMessage.trim(),
      sender: 'Admin',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    setAdminMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Header title={'Chat'} />

        <View style={styles.productInfo}>
          <View style={styles.row}>
            <Image source={{ uri: image }} style={styles.productImage} />
            <View style={styles.priceInfo}>
              <Text style={styles.productPrice}>Sale Price: {price}</Text>
              <Text style={styles.productShipping}>{shipping}</Text>
            </View>
          </View>
          <Text style={styles.productTitle}>{title}</Text>
        </View>

        <ScrollView
          style={styles.chatBox}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'Admin' && {
                    alignSelf: 'flex-end',
                    backgroundColor: '#e0f7fa',
                  },
                ]}
              >
                <Text style={[styles.sender, msg.sender === 'Admin' && { color: 'green' }]}>
                  {msg.sender}
                </Text>
                <Text>{msg.text}</Text>
                <Text style={styles.timeText}>
                  {msg.createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.systemMessage}>Start chatting about this product</Text>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={{ color: 'white' }}>Send</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.adminReplyContainer}>
          <TextInput
            style={styles.adminInput}
            placeholder="Type admin reply..."
            value={adminMessage}
            onChangeText={setAdminMessage}
            multiline
          />
          <TouchableOpacity style={styles.adminSendButton} onPress={handleAdminReply}>
            <Text style={{ color: 'white' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  productInfo: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 8,
    marginRight: 15,
  },
  priceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 4,
  },
  productShipping: {
    fontSize: 12,
    color: '#2ecc71',
  },
  productTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  chatBox: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 12,
    color: '#FF6B00',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  systemMessage: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminReplyContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  adminInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  adminSendButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
