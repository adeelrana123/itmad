import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAllproductcategorygetAll } from '../services/api';
 const screenWidth = Dimensions.get('window').width;
// const cardWidth = (screenWidth - 30) / 2;
const cardWidth = (screenWidth - 50) / 3 ;

const CategoriesList = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchAllproductcategorygetAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        navigation.navigate('CategoryProductsScreen', {
          categoryId: item._id,
          categorySlug: item.slug,
          categoryName: item.name,
        });
      }}
    >
      <Image source={{ uri: item.Image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

 
return (
  <View style={styles.container}>
    <Text style={styles.heading}>Browse Categories</Text>
    {loading ? (
      <ActivityIndicator size="small" color="orange" />
    ) : categories.length === 0 ? (
      <Text style={styles.noDataText}>No Data Found</Text>
    ) : (
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    )}
  </View>
);

};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FF9800',
  },
  card: {
    width:cardWidth,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  noDataText: {
  textAlign: 'center',
  fontSize: 16,
  color: '#888',
  paddingVertical: 20,
},
});

export default CategoriesList;
