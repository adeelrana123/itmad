import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getUsers } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" color="blue" style={{ marginTop: 50 }} />;

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default UserList;
