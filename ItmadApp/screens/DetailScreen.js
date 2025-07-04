import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { addToCart, clearCart } from '../redux/cartSlice';
import { useNavigation } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import RelatedButton from '../components/Relatedproducts';
import ProductReviews from '../components/ProductReviews';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductDescription from '../components/ProductDescription';
import { fetchProductsByslug } from '../services/api';// at top
const DetailScreen = ({ route }) => {
  const { product, slug } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef(null);

  const [loadedProduct, setLoadedProduct] = useState(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageArray, setImageArray] = useState(product?.images || []);
  const [activeTab, setActiveTab] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const categoryId = loadedProduct?.category?._id || loadedProduct?.category?.id;
  const excludeProductId = loadedProduct?._id || loadedProduct?.id;
  const selectedUserId = loadedProduct?.userId || loadedProduct?.creator || 'fallback-id';

  const discount = loadedProduct?.salePrice
    ? Math.round(((loadedProduct.price - loadedProduct.salePrice) / loadedProduct.price) * 100)
    : 0;

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [loadedProduct]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (slug) {
        try {
          const result = await fetchProductsByslug(slug);
          // console.log('✅ Product loaded by slug:', result);
          setLoadedProduct(result);
          setImageArray(result?.images || []);
        } catch (error) {
          console.error('❌ Error fetching product by slug:', error);
        }
      }
    };
    fetchProduct();
  }, [slug]);

  if (!loadedProduct) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  const cartPayload = {
    id: loadedProduct._id,
    title: loadedProduct.title,
    salePrice: loadedProduct.salePrice,
    image: imageArray[currentImageIndex] || '',
    deliveryCharges: loadedProduct.deliveryCharges ?? 200,
    freeShipping: loadedProduct.freeShipping ?? false,
  };

  const chatPayload = {
    userId: selectedUserId,
    chatId: `${selectedUserId}_${loadedProduct._id}`,
    title: loadedProduct.title,
    image: imageArray[currentImageIndex] || '',
    price: loadedProduct.salePrice,
    shipping: loadedProduct.freeShipping
      ? 'Free Shipping'
      : `Shipping: Rs. ${loadedProduct.deliveryCharges}`,
  };

  const renderImage = () => {
    if (!imageArray.length) {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="image" size={50} color="#ccc" />
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      );
    }

    const handleNext = () => {
      setCurrentImageIndex(prev =>
        prev < imageArray.length - 1 ? prev + 1 : 0
      );
    };

    const handlePrev = () => {
      setCurrentImageIndex(prev =>
        prev > 0 ? prev - 1 : imageArray.length - 1
      );
    };

    return (
      <View style={styles.imageWrapper}>
        <TouchableOpacity style={styles.leftZone} onPress={handlePrev}>
          <Icon name="chevron-left" size={30} color="gray" />
        </TouchableOpacity>

        <Image
          source={{ uri: imageArray[currentImageIndex] }}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.rightZone} onPress={handleNext}>
          <Icon name="chevron-right" size={30} color="gray" />
        </TouchableOpacity>

        <View style={styles.imageCounter}>
          <Text style={styles.counterText}>
            {currentImageIndex + 1} / {imageArray.length}
          </Text>
        </View>
      </View>
    );
  };

  const renderVariant = ({ item }) => (
    <View style={styles.variantContainer}>
      <Text style={styles.variantName}>{item.name}:</Text>
      <View style={styles.variantValues}>
        {item.values.map(value => {
         const index = imageArray.findIndex(img => {
  // Make sure both img and value.image are strings before calling includes
  if (typeof img !== 'string' || typeof value.image !== 'string') return false;
  return img.includes(value.image) || value.image.includes(img);
});

          return (
            <TouchableOpacity
              key={value._id}
              style={styles.variantItem}
              onPress={() => {
                if (index !== -1) {
                  setCurrentImageIndex(index);
                } else if (value.image) {
                  const updatedArray = [...imageArray, value.image];
                  setImageArray(updatedArray);
                  setCurrentImageIndex(updatedArray.length - 1);
                }
              }}
            >
              {value.image && (
                <Image source={{ uri: value.image }} style={styles.variantImage} />
              )}
              <Text style={styles.variantText}> {value.value}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Product Details" />

      <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 180 }}>
        {renderImage()}

        <View style={styles.detailContainer}>
          <Text style={styles.value}>{loadedProduct.title}</Text>

         <TouchableOpacity
  onPress={() => {
    console.log('Navigating to CategoryScreen with slug:', loadedProduct.category?.slug);
    navigation.navigate('CategoryScreen', {
      categoryId: loadedProduct.category?._id,
      categoryName: loadedProduct.category?.slug,
    });
  }}
>
            <Text style={[styles.value, styles.linkText]}>
              {loadedProduct.category?.name}
            </Text>
          </TouchableOpacity>

          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>Rs. {loadedProduct.salePrice}</Text>
            {loadedProduct.price > loadedProduct.salePrice && (
              <Text style={styles.originalPrice}>Rs. {loadedProduct.price}</Text>
            )}
            {discount > 0 && (
              <View style={styles.discountBox}>
                <Text style={styles.discountText}>{discount}% OFF</Text>
              </View>
            )}
          </View>

          {loadedProduct.variants?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Options</Text>
              <FlatList
                data={loadedProduct.variants}
                renderItem={renderVariant}
                keyExtractor={item => item._id}
                scrollEnabled={false}
              />
            </View>
          )}

          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setActiveTab('description')}
              style={[
                styles.tabButton,
                activeTab === 'description'
                  ? styles.activeTabButton
                  : styles.inactiveTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'description' && styles.activeTabText,
                ]}
              >
                Description
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveTab('reviews');
                setSelectedProductId(loadedProduct._id || loadedProduct.id);
              }}
              style={[
                styles.tabButton,
                activeTab === 'reviews'
                  ? styles.activeTabButton
                  : styles.inactiveTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'reviews' && styles.activeTabText,
                ]}
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'description' && (
            <ProductDescription
              width={width}
              description={loadedProduct.description}
              longDescription={loadedProduct.longDescription}
              styles={styles}
            />
          )}

          {activeTab === 'reviews' && selectedProductId && (
            <ProductReviews productId={selectedProductId} />
          )}

          <View style={styles.related}>
            <Text style={styles.textrelated}>Related Products</Text>
          </View>
          <RelatedButton
            categoryId={categoryId}
            excludeProductId={excludeProductId}
          />
        </View>
      </ScrollView>

      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
          style={styles.reviewButtonBottom}
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.reviewButtonTextBottom}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ChatScreen', chatPayload)}
          style={styles.chatButtonBottom}
        >
          <Icon name="wechat" size={16} color="#fff" />
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            dispatch(clearCart());
            dispatch(addToCart(cartPayload));
            navigation.navigate('CartScreens');
          }}
          style={styles.buyNowButtonBottom}
        >
          <Icon name="shopping-cart" size={16} color="#fff" />
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width: 350, height: 350, alignSelf: 'center', borderRadius: 8, marginTop: 3,justifyContent:"center" },
  noImageContainer: { width: '95%', height: 400, backgroundColor: '#f4f4f4', justifyContent: 'center', alignItems: 'center', borderRadius: 8, alignSelf: 'center' },
  noImageText: { fontSize: 18, color: '#888', fontWeight: '500' },
  detailContainer: { paddingHorizontal: 20, backgroundColor: '#fff' },
  priceContainer: { flexDirection: 'row', alignItems: 'center',backgroundColor:'#f5f5f5',
    padding: 5, borderRadius: 8, marginTop: 10, justifyContent: 'space-between'
    },
  salePrice: { fontSize: 22, fontWeight: 'bold', color: '#FF6B00', marginRight: 10 },
  originalPrice: { fontSize: 18, 
    color: '#888',
    // color:'white',
     textDecorationLine: 'line-through' },
  shippingContainer: { flexDirection: 'row', alignItems: 'center' },
  shippingText: { color: '#666', fontSize: 16, marginLeft: 5 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  icon: { width: 20, marginRight: 5 },
  label: { color: '#555', width: 80, fontWeight: '600', marginLeft: 5 },
  value: { color: '#FFB727', flex: 1, fontWeight: '700', fontSize: 16,  marginTop:8 },
  variantContainer: { marginBottom: 15 },
  variantName: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  variantValues: { flexDirection: 'row', flexWrap: 'wrap' },
  variantItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 10 },
  variantImage: { width: 30, height: 30, borderRadius: 15, marginRight: 5 },
  variantText: { color: '#555' },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, borderRadius: 8, backgroundColor: '#f9f9f9', width: '100%', alignSelf: 'center' },
  tabButton: { paddingVertical: 6, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', width: '50%', marginLeft: 5, marginRight: 5, borderRadius: 8, backgroundColor: 'black' },
  tabText: { fontSize: 16, color: 'white', paddingHorizontal: 12, },
  activeTab: { color: '#FF6B00', fontWeight: 'bold', textDecorationLine: 'underline', padding: 10, borderRadius: 5, backgroundColor: 'green' },
  related: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  textrelated: { color: '#FFB727', fontSize: 18, fontWeight: 'bold' },
  fixedBottomContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', position: 'absolute', bottom: 0, left: 0, right: 0 },
  reviewButtonBottom: { flex: 1, backgroundColor: '#FFA000', marginRight: 5, padding: 12, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  reviewButtonTextBottom: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  chatButtonBottom: { flex: 1, backgroundColor: '#4CAF50', marginRight: 5, padding: 12, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buyNowButtonBottom: { flex: 1, backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  activeTabText: {
    color: '#FF6B00',
  },

  activeTabButton: {
    backgroundColor: 'green',
  },

  inactiveTabButton: {
    backgroundColor: 'black',
  },
linkText: {
  color: '#007bff',
  textDecorationLine: 'underline',

},
discountBox: {
  backgroundColor: '#FF6B00',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 4,
  marginLeft: 20,
},
discountText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 12,
},imageWrapper: {
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
},

leftZone: {
  position: 'absolute',
  left: 10,
  top: '50%',
  transform: [{ translateY: -15 }],
  zIndex: 2,
  padding: 10,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 30,
},

rightZone: {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: [{ translateY: -15 }],
  zIndex: 2,
  padding: 10,
  backgroundColor: 'rgba(255,255,255,0.7)',
  borderRadius: 30,
},

imageCounter: {
  position: 'absolute',
  bottom: 10,
  alignSelf: 'center',
  backgroundColor: 'rgba(0,0,0,0.6)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
},

counterText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},


});

export default DetailScreen;
