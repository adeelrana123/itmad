import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchBestSellers } from '../services/api';
import Pagination from './Pagination';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;
  const PAGE_SIZE = 10;
const BestSellers = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // console.log('projuct',products)
 const onPageChange = (newPage) => {
      setPage(newPage);
    };
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchBestSellers(page, PAGE_SIZE);
        setProducts(response.products);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      }
      setLoading(false);
    };

    loadProducts();
  }, [page]);

 
const StarRating = ({ rating }) => {
  const maxStars = 5;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Icon
        key={i}
        name="star"
        size={16}
        color={i <= rating ? '#FFD700' : '#CCCCCC'}  // yellow or gray
        style={{ marginRight: 2 }}
      />
    );
  }

  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

  const renderProductImage = (item) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || item.images?.[0];

    return (
      <View style={styles.imageWrapper}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        {item.freeShipping && (
          <View style={styles.freeShippingBadge}>
            <View style={styles.badgeContent}>
              <Icon name="truck" size={16} color="black" style={{ marginRight: 4 }} />
              <Text style={styles.freeShippingText}>Free Shipping</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

const renderProductCard = ({ item }) => {
 const reviewsCount = item.reviews?.length || 0;
  const minRating = reviewsCount > 0
    ? Math.min(...item.reviews.map(r => r.rating))
    : 0;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate('Detail', {
          product: {
            ...item,
            userId: item.creator || 'fallback-id',
          },
          slug: item.slug,
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>{renderProductImage(item)}</View>
      <View style={styles.productInfoContainer}>
        <View style={styles.priceContainer}>
          {item.price > item.salePrice && (
            <Text style={styles.originalPrice}>Rs. {item.price}</Text>
          )}
          <Text style={styles.productPrice}> Rs. {item.salePrice}</Text>
        </View>
        <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
       
        <Text style={styles.productCategory} numberOfLines={1}>{item.category?.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <StarRating rating={minRating} />
         <Text style={{ marginLeft: 6, fontSize: 12, color: '#666' }}>
{reviewsCount > 0 ? `(${reviewsCount})` : ''}
</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Best Sellers</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loadingIndicator} />
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={renderProductCard}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No products found</Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
            <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFB727',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  productInfoContainer: {
    paddingHorizontal: 10,
    marginTop: 15,
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
    marginTop: 20,
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  imageWrapper: {
    position: 'relative',
  },

  freeShippingBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#FFB727',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  freeShippingText: {
    color:'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BestSellers;
