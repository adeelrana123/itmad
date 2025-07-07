import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchProductsByCategory } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const CategoryProductsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { categorySlug, categoryName } = route.params;

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductsByCategory(categorySlug);
      if (data.success) {
        setAllProducts(data.products);
        setProducts(data.products);
      } else {
        setAllProducts([]);
        setProducts([]);
        setError(data.message || 'No products found');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const query = text.trim().toLowerCase();
    if (!query) return setProducts(allProducts);

    const filtered = allProducts.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(query);
      const categoryMatch = item.category?.name?.toLowerCase().includes(query);
      return titleMatch || categoryMatch;
    });

    setProducts(filtered);
  };

  const renderProductImage = (item) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || item.images?.[0];
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('Detail', { product: item })}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>{renderProductImage(item)}</View>
      <View style={styles.productInfoContainer}>
        <View style={styles.priceContainer}>
          {item.price > item.salePrice && (
            <Text style={styles.originalPrice}>Rs. {item.price}</Text>
          )}
          <Text style={styles.productPrice}>Rs. {item.salePrice}</Text>
        </View>
        <Text style={styles.productName} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.productCategory} numberOfLines={1}>
          {item.category?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()} />

      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search for products..."
            value={searchQuery}
            onChangeText={handleSearch}
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

        <ScrollView>
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
          )}
        </ScrollView>
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
    paddingTop: 10,
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
    bottom: 1,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: 'orange',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  gridContainer: {
  paddingHorizontal: 10,
  paddingBottom: 20,
  marginTop:5
},

columnWrapper: {
  justifyContent: 'space-between',
  marginBottom: 10,
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
});

export default CategoryProductsScreen;
