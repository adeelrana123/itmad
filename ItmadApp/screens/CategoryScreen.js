

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import { fetchProductsByCategory } from '../services/api';
import Pagination from '../components/Pagination';
// import Icon from 'react-native-vector-icons/FontAwesome';
const   CategoryScreen = () => {
  const PAGE_SIZE = 10;
  const route = useRoute();
  const navigation = useNavigation();
  const {categoryId, categorySlug, categoryName} = route.params;
;
const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // console.log("object",  products)
  const onPageChange = (newPage) => {
      setPage(newPage);
    };
  const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);

 
  // console.log('Fetching products by category:', { categoryName, categoryId });
  
const data = await fetchProductsByCategory(categoryName,page, PAGE_SIZE);
// const data = await fetchProductsByCategory(categorySlug);
// console.log('fetchProductsByCategory response:', data);
if (data.success) {
  setAllProducts(data.products); 
  setProducts(data.products);  
  setTotalPages(data.totalPages || 1);  
} else {
  setAllProducts([]);
  setProducts([]);
}
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products. Please try again.');
  } finally {
    setLoading(false);
  }
};
// useEffect(() => {
//   fetchProducts();
// }, [categoryId]);

  useEffect(() => {
    fetchProducts();
  }, [categoryName,page]);
  
const handleSearch = (query) => {
  const searchText = query ? query.trim().toLowerCase() : '';

  if (!searchText) {
    setProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchText);
    const categoryMatch = item.category?.name?.toLowerCase().includes(searchText);
    return titleMatch || categoryMatch;
  });

  setProducts(filtered);
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


  const renderProductImage = (item) => {
    
    const imageUri =
      item.variants?.[0]?.values?.[0]?.image || item.images?.[0];

    if (!imageUri) {
      return (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.productImage}
        resizeMode="cover"
      />
    );
  };

 const renderItem = ({ item }) => {
  const reviewsCount = item.reviews ? item.reviews.length : 0;

  // Calculate average rating (or max rating if you want)
  const avgRating = reviewsCount > 0
    ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
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
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>{renderProductImage(item)}</View>
      <View style={styles.productInfoContainer}>
        {/* <View style={styles.priceContainer}>
          {item.price > item.salePrice && (
            <Text style={styles.originalPrice}>Rs. {item.price}</Text>
          )}
          <Text style={styles.productPrice}>Rs. {item.salePrice}</Text>
        </View> */}
        <Text style={styles.productName} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.category?.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <StarRating rating={Math.round(avgRating)} />
          <Text style={{ marginLeft: 6, fontSize: 12, color: '#666' }}>
            {reviewsCount > 0 ? `(${reviewsCount})` : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


return (
  <View style={{ flex: 1 }}>
    <Header title={'Category'} />

    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearch(text);
          }}
          style={styles.searchInput}
          placeholderTextColor="#999"
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={() => handleSearch(searchQuery)}
        >
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.noDataContainer}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="orange"
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No products found</Text>
              </View>
            }
            contentContainerStyle={styles.gridContainer}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </View>
  </View>
);

};

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop:10,
    alignItems: 'center',
    backgroundColor: '#fff',
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
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    paddingRight: 50,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  searchIconButton: {
    position: 'absolute',
    right: 10,
    bottom:1,
    padding: 10,
  
    paddingHorizontal:15,
    backgroundColor: 'orange',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    overflow: 'hidden',
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
    height: 150,
    backgroundColor: '#f9f9f9',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#eee',
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
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#e53935',
    fontSize: 16,
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
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
    marginTop: 20,
  },
  brandTitleContainer: {
    flex:1,
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: 10,
    
},

brandTitleText: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#FFB727', 
  textTransform: 'uppercase',
 

},
});

export default CategoryScreen;
