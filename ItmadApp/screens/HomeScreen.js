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
import { fetchAllProducts, fetchBestSellers } from '../services/api';
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
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [allBestSellers, setAllBestSellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBestSellers(1, 100);
        setAllBestSellers(data.products || []);
      } catch (err) {
        console.log('❌ Error fetching best sellers:', err?.message || err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const timer = setTimeout(() => {
      const filtered = allBestSellers.filter(item => {
        const title = item.title?.toLowerCase() ?? '';
        const brand = item.brand?.name?.toLowerCase() ?? '';
        const category = item.category?.name?.toLowerCase() ?? '';

        return (
          (title && title.includes(query)) ||
          (brand && brand.includes(query)) ||
          (category && category.includes(query))
        );
      });

      setFilteredProducts(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allBestSellers]);

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
      backgroundColor: 'orange',
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
            products={allBestSellers} 
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