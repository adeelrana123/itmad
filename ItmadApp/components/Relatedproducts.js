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
import { fetchRelatedProducts, fetchproductReview } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const RelatedProductsList = ({ categoryId, excludeProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadProductsAndReviews = async () => {
      try {
        const res = await fetchRelatedProducts(categoryId, excludeProductId);
        const products = res.products || [];

        // Fetch reviews for each product in parallel
        const productsWithReviews = await Promise.all(
          products.map(async (product) => {
            const reviewResponse = await fetchproductReview(product.slug);
            const reviews = reviewResponse?.success ? reviewResponse.reviews : [];
            return { ...product, reviews };
          })
        );

        setRelatedProducts(productsWithReviews);
      } catch (error) {
        console.log('❌ API Error:', error.message || error);
      }
    };

    if (categoryId && excludeProductId) {
      loadProductsAndReviews();
    }
  }, [categoryId, excludeProductId]);

  const StarRating = ({ rating }) => {
    const maxStars = 5;
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={14}
          color={i <= rating ? '#FFD700' : '#CCCCCC'}
          style={{ marginRight: 2 }}
        />
      );
    }

    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderItem = ({ item }) => {
    const discount = item.salePrice
      ? Math.round(((item.price - item.salePrice) / item.price) * 100)
      : 0;

    const reviews = item.reviews || [];
    const reviewsCount = reviews.length;
    const minRating =
      reviewsCount > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsCount
        : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.push('Detail', { product: item,slug: item.slug })}
      >
        <Image source={{ uri: item.images[0] }} style={styles.image} />

        {discount > 0 && (
          <View style={styles.discountBox}>
            <Text style={styles.discountText}>{discount}% Save</Text>
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

        <View style={styles.ratingContainer}>
          <StarRating rating={Math.round(minRating)} />
          <Text style={styles.reviewCount}>
            {reviewsCount > 0 ? `(${reviewsCount})` : ''}
          </Text>
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
    width: cardWidth - 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
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
    paddingHorizontal: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reviewCount: {
    marginLeft: 6,
    fontSize: 12,
    color: '#666',
  },
});

export default RelatedProductsList;
