// components/NewArrivals.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAllproductnewarrival } from '../services/api';
 const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const NewArrivals = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const data = await fetchAllproductnewarrival();
        setProducts(data);
      } catch (err) {
        console.log('Failed to load new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  const renderItem = ({ item }) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || item.images?.[0];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Detail', {
            product: {
              ...item,
              userId: item.creator || 'fallback-id',
            },
          })
        }
      >
        <Image source={{ uri: imageUri }} style={styles.image} />
       <View style={styles.productInfoContainer}>
               <View style={styles.priceContainer}>
                 {item.price > item.salePrice && (
                   <Text style={styles.originalPrice}>Rs. {item.price}</Text>
                 )}
                 <Text style={styles.productPrice}>Rs. {item.salePrice}</Text>
               </View>
               <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
               <Text style={styles.productCategory} numberOfLines={1}>{item.category?.name}</Text>
             </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>New Arrivals</Text>
      {loading ? (
        <ActivityIndicator size="small" color="orange" />
      ) : (
        <FlatList
          data={products}
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
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 8,
    color: '#FF9800',
  },
  card: {
     width:cardWidth,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
 
  
   productInfoContainer: {
    paddingHorizontal: 10,
    
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
    color: '#666',
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#e53935',
    fontSize: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
});

export default NewArrivals;
