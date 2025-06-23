import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { getCurrentUser } from '../services/authApi';

const CurrentUserScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        Alert.alert('Error', err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="white"
        style={{ flex: 1, backgroundColor: '#2e7d32' }}
      />
    );

  if (!user)
    return (
      <Text style={{ padding: 20, color: 'white' }}>No user data found</Text>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{user.username}</Text>
      <Text style={styles.values}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e7d32',
    height: 80,
    paddingTop: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    color: '#f1f8e9',
    textAlign:"center",
    padding:5
  },
   values: {
    fontSize: 16,
    color: '#f1f8e9',
     textAlign:"center"
  },
});

export default CurrentUserScreen;
