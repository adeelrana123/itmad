import React, { useEffect, useState, useMemo } from 'react';
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
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  fetchBestSellers,
  fetchNewArrivals,
  fetchTrendingProducts,
  fetchProductsByCategory,
} from '../services/api';  
import Header from '../components/Header';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;
const PAGE_SIZE = 10;

const ShopScreen = ({ categoryName = '' }) => {
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(1); 

  const [searchText, setSearchText] = useState('');

  const calculateMaxPages = (pagesArray) => {
    return Math.max(...pagesArray);
  };

  const loadProducts = async () => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const [
        bestSellersRes,
        newArrivalsRes,
        trendingRes,
        categoryRes,
      ] = await Promise.all([
        fetchBestSellers(page, PAGE_SIZE),
        fetchNewArrivals(page, PAGE_SIZE),
        fetchTrendingProducts(page, PAGE_SIZE),
        categoryName ? fetchProductsByCategory(categoryName, page, PAGE_SIZE) : Promise.resolve({ products: [], totalPages: 0 }),
      ]);

      const allProducts = [
        ...bestSellersRes.products,
        ...newArrivalsRes.products,
        ...trendingRes.products,
        ...categoryRes.products,
      ];

      const uniqueProductsMap = {};
      allProducts.forEach(p => {
        uniqueProductsMap[p._id] = p;
      });
      const uniqueProducts = Object.values(uniqueProductsMap);

      const maxPages = calculateMaxPages([
        bestSellersRes.totalPages,
        newArrivalsRes.totalPages,
        trendingRes.totalPages,
        categoryRes.totalPages || 0,
      ]);
      setTotalPages(maxPages);

      if (page === 1) {
        setProducts(uniqueProducts);
      } else {
        setProducts(prev => [...prev, ...uniqueProducts]);
      }
    } catch (error) {
      console.error('Error loading combined products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  // Filter products based on searchText
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;

    const lowerSearch = searchText.toLowerCase();

    return products.filter(product => {
      const titleMatch = product.title?.toLowerCase().includes(lowerSearch);
      const categoryMatch = product.category?.name?.toLowerCase().includes(lowerSearch);
      return titleMatch || categoryMatch;
    });
  }, [searchText, products]);

  const StarRating = ({ rating }) => {
    const maxStars = 5;
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <Icon
          key={i}
          name="star"
          size={16}
          color={i <= rating ? '#FFD700' : '#CCCCCC'}
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
          <Image source={{ uri: imageUri }} style={styles.productImage} resizeMode="cover" />
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
    const avgRating = reviewsCount > 0 ? Math.round(item.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount) : 0;

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate('Detail', {
            product: { ...item, userId: item.creator || 'fallback-id' },
            slug: item.slug,
          })
        }
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>{renderProductImage(item)}</View>
        <View style={styles.productInfoContainer}>
          <View style={styles.priceContainer}>
            {item.price > item.salePrice && <Text style={styles.originalPrice}>Rs. {item.price}</Text>}
            <Text style={styles.productPrice}>   Rs.{item.salePrice}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.productCategory} numberOfLines={1}>{item.category?.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <StarRating rating={avgRating} />
            <Text style={{ marginLeft: 6, fontSize: 12, color: '#666' }}>
              {reviewsCount > 0 ? `(${reviewsCount})` : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={categoryName || 'Shop'} />
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={{ marginHorizontal: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product title or category"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
          placeholderTextColor="#000"
        />
      </View>

      <Text style={styles.heading}>All Products</Text>
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="orange" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderProductCard}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="orange" style={styles.loadingIndicator} /> : null}
          ListEmptyComponent={
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    // marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  heading: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 15, paddingBottom: 10, color: '#FF9800' },
  gridContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  productCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  imageContainer: { width: '100%', aspectRatio: 1 },
  productImage: { width: '100%', height: 180, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  noImageContainer: { width: '100%', height: 180, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  noImageText: { color: '#999', fontSize: 14, fontWeight: '500' },
  productInfoContainer: { paddingHorizontal: 10, marginTop: 15 },
  productName: { fontSize: 14, fontWeight: '700', color: '#333' },
  productCategory: { fontSize: 12, marginBottom: 4, color: '#666' },
  productPrice: { fontWeight: 'bold', color: '#FF9800', fontSize: 18 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through', marginRight: 5 },
  noDataContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  noDataText: { fontSize: 16, color: '#666' },
  loadingIndicator: { marginVertical: 20 },
  imageWrapper: { position: 'relative' },
  freeShippingBadge: { position: 'absolute', top: 3, right: 3, backgroundColor: '#FFB727', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, zIndex: 10, flexDirection: 'row', alignItems: 'center' },
  badgeContent: { flexDirection: 'row', alignItems: 'center' },
  freeShippingText: { color: 'black', fontSize: 12, fontWeight: 'bold' },
});

export default ShopScreen;
