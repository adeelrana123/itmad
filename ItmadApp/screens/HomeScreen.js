import { useNavigation } from '@react-navigation/native';
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
import { fetchAllProducts } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [user, setUser] = useState(null);
const [avatar, setAvatar] = useState(null);

useEffect(() => {
  const fetchUserInfo = async () => {
    const name = await AsyncStorage.getItem('username');
    const email = await AsyncStorage.getItem('email');
    const avatarUri = await AsyncStorage.getItem('avatar');

    if (name && email) {
      setUser({ name, email });
      setAvatar(avatarUri);
    } else {
      setUser(null);
    }
  };

  fetchUserInfo();
}, []);
  useEffect(() => {
    fetchAllProducts(1, 50)
      .then(res => {
        let all = res.data.products;
        if (searchQuery) {
          all = all.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || // Added name search
            item.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        // console.log('Fetched product sample:', res.data.products[0]);
       
        setFilteredProducts(all);
        setLoading(false);
      })
      .catch(err => {
        console.log('❌ API Error:', err);
        setLoading(false);
      });
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchQuery.trim());
  };

  const renderProductImage = (item) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || 
                    (item.images && item.images[0]);
    
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
        onError={() => console.log('Image failed to load')}
      />
    );
  };

  const renderProductCard = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}

      onPress={() => navigation.navigate('Detail', {
  product: {
    ...item,
  userId: item.creator || 'fallback-id',
  },
})}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {renderProductImage(item)}
      </View>
      <View style={styles.productInfoContainer}>
         <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>Rs. {item.salePrice}</Text>
          {item.price > item.salePrice && (
            <Text style={styles.originalPrice}>Rs. {item.price}</Text>
          )}
        </View>
        <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
          {item.title} 
        </Text>
        <Text style={styles.productCategory} numberOfLines={1} ellipsizeMode="tail">
          {item.category?.name}
        </Text>
       
        {item.tags?.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map(tag => (
              <View key={tag._id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      {user && (
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
)}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          style={styles.searchInput}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#999"
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

      {/* Flash Sale Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Flash Sale</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="orange" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item._id}
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
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'ios' ? 50 : 10, // Adjust for iOS status bar
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
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
    ...Platform.select({
      android: {
        paddingVertical: 8, 
      },
    }),
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
    color: '#333',
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
    width: '90%',
    height: '90%',
    marginTop:10,
    margin:'auto',
     justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  noImageContainer: {
    width: '90%',
    height: '90%',
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
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
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
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  userInfoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
backgroundColor: '#FF6B00',
  borderBottomWidth: 1,
  borderColor: '#ddd',
},
avatarWrapper: {
  marginRight: 10,
},
avatarImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
},
userName: {
  fontSize: 24,
  fontWeight: 'bold',
  color:'white',
},
userEmail: {
  fontSize: 12,
 color:'white',
},
});

export default HomeScreen;