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

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const categoryId = product.category?._id || product.category?.id;
  const excludeProductId = product._id || product.id;
  const { width } = useWindowDimensions();
  const selectedUserId = product.userId || product.creator || 'fallback-id';

  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState('review');

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [product]);

  const renderImage = () => {
    const imageUrl =
      product.variants?.[0]?.values?.[0]?.image ||
      (product.images && product.images[0]);

    if (!imageUrl) {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="image" size={50} color="#ccc" />
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    );
  };

  const renderVariant = ({ item }) => (
    <View style={styles.variantContainer}>
      <Text style={styles.variantName}>{item.name}:</Text>
      <View style={styles.variantValues}>
        {item.values.map(value => (
          <View key={value._id} style={styles.variantItem}>
            {value.image && (
              <Image
                source={{ uri: value.image }}
                style={styles.variantImage}
              />
            )}
            <Text style={styles.variantText}>{value.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const cartPayload = {
    id: product._id,
    title: product.title,
    salePrice: product.salePrice,
    image:
      product.variants?.[0]?.values?.[0]?.image || product.images?.[0] || '',
    deliveryCharges: product.deliveryCharges ?? 200,
    freeShipping: product.freeShipping ?? false,
  };

  const chatPayload = {
    userId: selectedUserId,
    chatId: `${selectedUserId}_${product._id}`,
    title: product.title,
    image:
      product.variants?.[0]?.values?.[0]?.image || product.images?.[0] || '',
    price: product.salePrice,
    shipping: product.freeShipping
      ? 'Free Shipping'
      : `Shipping: Rs. ${product.deliveryCharges}`,
  };

  return (
    <View style={styles.container}>
      <Header title="Product Details" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        {renderImage()}

        <View style={styles.detailContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.salePrice}>Rs. {product.salePrice}</Text>
            {product.price > product.salePrice && (
              <Text style={styles.originalPrice}>Rs. {product.price}</Text>
            )}
          </View>

          <View style={styles.shippingContainer}>
            <Icon name="truck" size={16} color="#FF6B00" />
            <Text style={styles.shippingText}>
              {product.freeShipping
                ? 'Free Shipping'
                : `Shipping: Rs. ${product.deliveryCharges}`}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.infoRow}>
              <Icon name="tag" size={16} color="#FF6B00" style={styles.icon} />
              <Text style={styles.label}>Title:</Text>
              <Text style={styles.value}>{product.title || 'No Brand'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="folder" size={16} color="#FF6B00" style={styles.icon} />
              <Text style={styles.label}>Category:</Text>
              <Text style={styles.value}>{product.category?.name || 'N/A'}</Text>
            </View>

            {product.weight && (
              <View style={styles.infoRow}>
                <Icon name="weight" size={16} color="#FF6B00" style={styles.icon} />
                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{product.weight}</Text>
              </View>
            )}
          </View>

          {product.variants?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Options</Text>
              <FlatList
                data={product.variants}
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
      activeTab === 'description' ? styles.activeTabButton : styles.inactiveTabButton,
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
    onPress={() => setActiveTab('review')}
    style={[
      styles.tabButton,
      activeTab === 'review' ? styles.activeTabButton : styles.inactiveTabButton,
    ]}
  >
    <Text
      style={[
        styles.tabText,
        activeTab === 'review' && styles.activeTabText,
      ]}
    >
      Review
    </Text>
  </TouchableOpacity>
</View>


         {activeTab === 'description' && (
  <>
    {product.description && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: product.description }}
          tagsStyles={{
            ul: { marginVertical: 10, paddingLeft: 25 },
            ol: { marginVertical: 10, paddingLeft: 25 },
            li: {
              marginBottom: 8,
              color: '#333',
              fontSize: 15,
              lineHeight: 22,
              fontFamily: 'System',
            },
            p: {
              color: '#444',
              fontSize: 15,
              lineHeight: 24,
              marginBottom: 10,
              fontFamily: 'System',
            },
            strong: {
              fontWeight: 'bold',
              color: '#000',
            },
            h3: {
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 20,
              marginBottom: 10,
              color: '#222',
            },
            h4: {
              fontSize: 17,
              fontWeight: '600',
              marginTop: 16,
              marginBottom: 8,
              color: '#333',
            },
          }}
        />
      </View>
    )}

    {product.longDescription && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More Details</Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: product.longDescription }}
          tagsStyles={{
            h3: {
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 16,
              color: '#111',
            },
            h4: {
              fontSize: 17,
              fontWeight: '600',
              marginTop: 12,
              color: '#222',
            },
            ul: { marginVertical: 10, paddingLeft: 20 },
            li: { marginBottom: 8, color: '#444', fontSize: 16 },
            p: { color: '#444', fontSize: 16, lineHeight: 22 },
            strong: { fontWeight: 'bold', color: '#000' },
          }}
        />
      </View>
    )}
  </>
)}
          {activeTab === 'review' && (
            
            <View style={styles.section}>
              
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              <Text style={{ color: '#555' }}>No reviews available.</Text>
            </View>
          )}

          <View style={styles.related}>
            <Text style={styles.textrelated}>Related Products</Text>
          </View>
          <RelatedButton categoryId={categoryId} excludeProductId={excludeProductId} />
        </View>
      </ScrollView>

      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductReviews', {
            productId: product._id || product.id,
          })}
          style={styles.reviewButtonBottom}
        >
          <Icon name="star" size={16} color="#fff" />
          <Text style={styles.reviewButtonTextBottom}>Reviews</Text>
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
  image: { width: '95%', height: 400, alignSelf: 'center', borderRadius: 8, marginTop: 3 },
  noImageContainer: { width: '95%', height: 400, backgroundColor: '#f4f4f4', justifyContent: 'center', alignItems: 'center', borderRadius: 8, alignSelf: 'center' },
  noImageText: { fontSize: 18, color: '#888', fontWeight: '500' },
  detailContainer: { paddingHorizontal: 20, backgroundColor: '#fff' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  salePrice: { fontSize: 22, fontWeight: 'bold', color: '#FF6B00', marginRight: 10 },
  originalPrice: { fontSize: 18, color: '#888', textDecorationLine: 'line-through' },
  shippingContainer: { flexDirection: 'row', alignItems: 'center' },
  shippingText: { color: '#666', fontSize: 16, marginLeft: 5 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { width: 20, marginRight: 5 },
  label: { color: '#555', width: 80, fontWeight: '600', marginLeft: 5 },
  value: { color: '#333', flex: 1, fontWeight: '500' },
  variantContainer: { marginBottom: 15 },
  variantName: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  variantValues: { flexDirection: 'row', flexWrap: 'wrap' },
  variantItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 10 },
  variantImage: { width: 30, height: 30, borderRadius: 15, marginRight: 5 },
  variantText: { color: '#555' },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, borderRadius:8, backgroundColor:'#f9f9f9',width:'100%', alignSelf:'center' },
  tabButton: { paddingVertical: 6, paddingHorizontal: 10,justifyContent: 'center', alignItems: 'center',width: '50%',marginLeft:5,marginRight:5, borderRadius: 8,backgroundColor:'black' },
  tabText: { fontSize: 16, color: 'white',paddingHorizontal: 12, },
  activeTab: { color: '#FF6B00', fontWeight: 'bold', textDecorationLine: 'underline',padding:10, borderRadius: 5,backgroundColor:'green' },
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

});

export default DetailScreen;
