import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { fetchRelatedProducts } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const RelatedProductsList = ({ categoryId, excludeProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchRelatedProducts(categoryId, excludeProductId);
        setRelatedProducts(res.products);
      } catch (error) {
        console.log('❌ API Error:', error.message || error);
      }
    };

    loadProducts();
  }, [categoryId, excludeProductId]);

  const renderItem = ({ item }) => {
    const discount = item.salePrice
      ? Math.round(((item.price - item.salePrice) / item.price) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { product: item })}
      >
        <Image source={{ uri: item.images[0] }} style={styles.image} />

        {discount > 0 && (
          <View style={styles.discountBox}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>

        <View style={styles.priceContainer}>
          {item.salePrice ? (
            <>
              <Text style={styles.originalPrice}>Rs.{item.price}</Text>
              <Text style={styles.salePrice}> Rs.{item.salePrice}</Text>
            </>
          ) : (
            <Text style={styles.salePrice}>Rs.{item.price}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={relatedProducts}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 10,
    width: '100%',
   
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
   
    
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 10,
    
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
 width: cardWidth - 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
   
    paddingHorizontal:5
  },
  priceContainer: {
   
    flexDirection: 'row',
     paddingHorizontal:5,
    alignItems: 'center',
  },
  salePrice: {
    color: '#FF6B00',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  originalPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 14,
  },
  discountBox: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 5,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default RelatedProductsList;
