import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { fetchBestSellers, fetchNewArrivals, fetchTrendingProducts } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import BannerListScreen from '../components/BannerListScreen';
import BrandsList from '../components/BrandsList';
import TrendingProductsPaginated from '../components/TrendingProducts';
import NewArrivals from '../components/NewArrivals';
import AllCategories from '../components/AllCategories';
import BestSellers from '../components/BestSellers';
import { useAppTheme } from '../theme/ThemeContext';
import Wattsup from '../components/Wattsup';

const HomeScreen = () => {
  const theme = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // State for each category
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch best sellers
        const bestSellersData = await fetchBestSellers(1, 100);
        setBestSellers(bestSellersData.products || []);

        // Similarly fetch trending and new arrivals — replace with your API calls
        const trendingData = await fetchTrendingProducts(1, 100);
        setTrending(trendingData.products || []);

        const newArrivalsData = await fetchNewArrivals(1, 100);
        setNewArrivals(newArrivalsData.products || []);

      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredProducts([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const timer = setTimeout(() => {
      // Merge all products arrays
      const allProducts = [...bestSellers, ...trending, ...newArrivals];

     const uniqueProducts = Array.from(new Map(allProducts.map(p => [p._id || p.id, p])).values());
      // Filter by search query (title, brand, category)
      const filtered = uniqueProducts.filter(item => {
        const title = item.title?.toLowerCase() ?? '';
        const brand = item.brand?.name?.toLowerCase() ?? '';
        const category = item.category?.name?.toLowerCase() ?? '';

        return (
          title.includes(query) ||
          brand.includes(query) ||
          category.includes(query)
        );
      });

      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, bestSellers, trending, newArrivals]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setSearchQuery(trimmed);
    setHasSearched(!!trimmed);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, marginTop: 10 },
    searchContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 5,
      alignItems: 'center',
      position: 'relative',
      backgroundColor: '#fff',
      zIndex: 1,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: { elevation: 2 },
      }),
    },
    searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.borderColor,
      padding: 10,
      paddingRight: 50,
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      fontSize: 16,
      ...Platform.select({ android: { paddingVertical: 8 } }),
    },
    searchIconButton: {
      position: 'absolute',
      right: 10,
      padding: 10,
      backgroundColor:'#FF9800',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      backgroundColor: '#FF6B00',
      borderBottomWidth: 1,
      borderColor: theme.borderColor,
    },
    avatarWrapper: { marginRight: 10 },
    avatarImage: { width: 50, height: 25, borderRadius: 10 },
    userName: { fontSize: 20, fontWeight: 'bold', color: theme.white },
    userEmail: { fontSize: 12, color: theme.white },
    wattsupButtonWrapper: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 10,
    },
    logo: {
      width: 60,
      height: 40,
      marginRight: 10,
    },
    noResults: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: theme.text,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setHasSearched(!!text.trim());
          }}
          style={styles.searchInput}
          onSubmitEditing={handleSearch}
          placeholderTextColor={theme.placeholderText}
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

     <ScrollView>
  {loading ? (
    <ActivityIndicator size="large" color="orange" />
  ) : (
    <>
      {searchQuery.trim() ? (
        // When searching - only show search results
        <>
          {filteredProducts.length > 0 ? (
            <BestSellers 
              products={filteredProducts} 
              loading={false} 
              title="Search Results"
            />
          ) : (
            <Text style={styles.noResults}>
              No products found matching "{searchQuery}"
            </Text>
          )}
        </>
      ) : (
        // When not searching - show all regular content
        <>
          <BannerListScreen />
          <AllCategories />
          <View style={{height:140}}>
<BrandsList />
          </View>
          
          <TrendingProductsPaginated />
          <NewArrivals />
         <BestSellers 
  products={bestSellers} 
  loading={false} 
  title="Best Sellers"
/>
        </>
      )}
    </>
  )}
</ScrollView>

      <View style={styles.wattsupButtonWrapper}>
        <Wattsup />
      </View>
    </View>
  );
};

export default HomeScreen;