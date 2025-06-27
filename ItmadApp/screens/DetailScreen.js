import React from 'react';
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

const DetailScreen = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selectedUserId = product.userId || product.creator || 'fallback-id';

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

  const cleanDescription = html => html.replace(/<[^>]*>/g, ' ');

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

      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {renderImage()}

        <View style={styles.detailContainer}>
          <Text style={styles.productTitle}>{product.name}</Text>

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
              <Icon name="tag" size={16} color="#FF6B00" style={styles.icon} />
              <Text style={styles.label}>Slug:</Text>
              <Text style={styles.value}>{product.slug || 'No Brand'}</Text>
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

            <View style={styles.infoRow}>
              <Icon name="database" size={16} color="#FF6B00" style={styles.icon} />
              <Text style={styles.label}>Stock:</Text>
              <Text style={styles.value}>{product.stock} units</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="shopping-cart" size={16} color="#FF6B00" style={styles.icon} />
              <Text style={styles.label}>Sold:</Text>
              <Text style={styles.value}>{product.sold} units</Text>
            </View>
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

          {product.tags?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map(tag => (
                  <View key={tag._id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              <Text style={styles.description}>
                {cleanDescription(product.description)}
              </Text>
            </View>
          )}

          {product.longDescription && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>
                {cleanDescription(product.longDescription)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ✅ Fixed Bottom Buttons */}
      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductReviews', {
              productId: product?._id || product?.id,
            })
          }
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
  image: { width: '95%', height: 400, alignSelf: 'center', borderRadius: 8 },
  noImageContainer: {
    width: '95%',
    height: 400,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
  },
  noImageText: { fontSize: 18, color: '#888', fontWeight: '500' },
  detailContainer: { paddingHorizontal: 20, backgroundColor: '#fff' },
  productTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  salePrice: { fontSize: 22, fontWeight: 'bold', color: '#FF6B00', marginRight: 10 },
  originalPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  shippingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  shippingText: { color: '#666', fontSize: 16, marginLeft: 5 },
  section: { marginTop: 15 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { width: 20, marginRight: 5 },
  label: { color: '#555', width: 80, fontWeight: '600', marginLeft: 5 },
  value: { color: '#333', flex: 1, fontWeight: '500' },
  variantContainer: { marginBottom: 15 },
  variantName: { fontWeight: 'bold', marginBottom: 8, color: '#555' },
  variantValues: { flexDirection: 'row', flexWrap: 'wrap' },
  variantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  variantImage: { width: 30, height: 30, borderRadius: 15, marginRight: 5 },
  variantText: { color: '#555' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 12, color: '#666' },
  description: { color: '#555', lineHeight: 22, fontSize: 14 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  fixedBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  reviewButtonBottom: {
    flex: 1,
    backgroundColor: '#FFA000',
    marginRight: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  reviewButtonTextBottom: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  chatButtonBottom: {
    flex: 1,
    backgroundColor: '#4CAF50',
    marginRight: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyNowButtonBottom: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default DetailScreen;
