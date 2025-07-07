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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAllTrendingProducts } from '../services/api';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const TrendingProducts = () => {
  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchAllTrendingProducts();
        setTrending(data);
      } catch (err) {
        console.log('Failed to load trending products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
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
            slug: item.slug,
          })
        }
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

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
      <Text style={styles.heading}>Trending Products</Text>
      {loading ? (
        <ActivityIndicator size="small" color="orange" />
      ) : (
        <FlatList
          data={trending}
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
    color: '#FFB727',
  },
  card: {
    width: cardWidth,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
  },
  productInfoContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
});

export default TrendingProducts;
