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

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     const name = await AsyncStorage.getItem('username');
  //     const email = await AsyncStorage.getItem('email');
  //     const avatarUri = await AsyncStorage.getItem('avatar');

  //     if (name && email) {
  //       setUser({ name, email });
  //       setAvatar(avatarUri);
  //     } else {
  //       setUser(null);
  //     }
  //   };
  //   fetchUserInfo();
  // }, []);

useEffect(() => {
  setLoading(true);
  fetchBestSellers(1, 50)
    .then(products => {
      if (searchQuery) {
        const filtered = products.filter(item =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products); 
      }
      setLoading(false);
    })
    .catch(err => {
      console.log('❌ API Error:', err?.response?.data || err.message || err);
      setLoading(false);
    });
}, [searchQuery]);



  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    setSearchQuery(trimmed);
    setHasSearched(!!trimmed);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    searchContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical:5,
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
    avatarImage: { width: 50, height: 25, borderRadius:10 },
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
  }), [theme]);

  return (
    <View style={styles.container}>
      {/* {user && (
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarWrapper}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Icon name="person-circle-outline" size={50} color="#999" />
            )}
          </View>
          <View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      )} */}

       <View style={styles.userInfoContainer}>
         <View style={styles.avatarWrapper}>
  <Image source={require('../assets/etimad.png')} style={styles.avatarImage} />
</View>

          <View>
            <Text style={styles.userName}>Welcome to Etimad Mart</Text>
          </View>
        </View>

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
        <View style={{ height: 110 }}>
          <BannerListScreen />
        </View>
        <View style={{ height: 180 }}>
          <AllCategories />
        </View>
        <View style={{ height: 120 }}>
          <BrandsList />
        </View>

       {searchQuery ? (
  loading ? (
    <ActivityIndicator size="large" color="orange" style={{ marginVertical: 20 }} />
  ) : filteredProducts.length > 0 ? (
    <BestSellers products={filteredProducts} loading={loading} />
  ) : (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text style={{ fontSize: 16, color: '#888' }}>No products found.</Text>
    </View>
  )
) : (
  <>
    <View style={{ height: 220 }}>
      <TrendingProductsPaginated />
    </View>
    <View style={{ height: 240 }}>
      <NewArrivals />
    </View>
    <BestSellers products={filteredProducts} loading={loading} />
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
