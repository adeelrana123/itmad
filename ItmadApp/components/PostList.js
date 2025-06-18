import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import useAppTheme from '../theme/useAppTheme';
import { getPosts } from '../services/api';
const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = useAppTheme();

  useEffect(() => {
    getPosts()
      .then(res => setPosts(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.text} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={[styles.item, { color: colors.text }]}>{item.title}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PostList;
