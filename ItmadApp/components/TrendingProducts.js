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
import { fetchTrendingProducts } from '../services/api';
import Pagination from './Pagination';
import Icon from 'react-native-vector-icons/FontAwesome';
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 50) / 2;
const PAGE_SIZE = 10;
const TrendingProducts = () => {
  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const onPageChange = (newPage) => {
      setPage(newPage);
    };

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
  const loadTrending = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetchTrendingProducts(pageNumber, PAGE_SIZE);
      setTrending(res.products || []);
      setTotalPages(res.totalPages || 1);
      setTotalProducts(res.totalProducts || 0);
    } catch (err) {
      console.log('Failed to load trending products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending(page);
  }, [page]);

  const renderItem = ({ item }) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || item.images?.[0];
const reviewsCount = item.reviews?.length || 0;
  const minRating = reviewsCount > 0
    ? Math.min(...item.reviews.map(r => r.rating))
    : 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Detail', {
            product: { ...item, userId: item.creator || 'fallback-id' },
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
            <Text style={styles.productPrice}>    Rs. {item.salePrice}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.productCategory} numberOfLines={1}>{item.category?.name}</Text>
           <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
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
    <View style={styles.container}>
      
        <Text style={styles.heading}>Trending Products ({totalProducts})</Text>
       
     
      {loading ? (
        <ActivityIndicator size="small" color="orange" />
      ) : trending.length === 0 ? (
        <Text style={styles.noDataText}>No Data Found</Text>
      ) : (
        <>
          <FlatList
            data={trending}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
           <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1},
  card: {
   marginRight: 10,
    overflow: 'hidden',
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
  image: {
   width: '100%',
    height: 120,
    resizeMode: 'cover',
   borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
  },
  productInfoContainer: { paddingHorizontal: 10, },
  productName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  productCategory: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
     color: '#FF9800',
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
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    paddingVertical: 20,
  },
 header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#FFB727',
      paddingHorizontal: 15,
      marginBottom:10,
    color: '#FF9800',
  },
  productCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default TrendingProducts;
