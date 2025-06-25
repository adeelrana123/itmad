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



  const renderImage = () => {
    const imageUrl = product.variants?.[0]?.values?.[0]?.image ||
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

  const cleanDescription = (html) => {
    return html.replace(/<[^>]*>/g, ' ');
  };

  const cartPayload = {
    id: product._id,
    title: product.title,
    salePrice: product.salePrice,
    image: product.variants?.[0]?.values?.[0]?.image || product.images?.[0] || '',
    deliveryCharges: product.deliveryCharges ?? 200,
    freeShipping: product.freeShipping ?? false,
  };





  return (
    <View style={styles.container}>
      <Header title="Product Details" />

      <ScrollView>
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
              {product.freeShipping ? 'Free Shipping' : `Shipping: Rs. ${product.deliveryCharges}`}
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
              <Text style={styles.label}>slug:</Text>
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
          {/* <ProductReviews productId={product._id} /> */}
       <TouchableOpacity 
  onPress={() => navigation.navigate('ProductReviews', {
  productId: product?._id || product?.id
})}
  style={styles.reviewButton}
>
  <Text style={styles.reviewButtonText}>View All Reviews</Text>
  <Icon name="chevron-right" size={16} color="#FF6B00" />
</TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatScreen', {
                  chatId:chatId,
                  image: product.variants?.[0]?.values?.[0]?.image || product.images?.[0] || '',
                  title: product.title,
                  price: product.salePrice,
                  shipping: product.freeShipping ? 'Free Shipping' : `Shipping: Rs. ${product.deliveryCharges}`,
                });
              }}
              style={styles.chatButton}
            >
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                dispatch(clearCart());
                dispatch(addToCart(cartPayload));
                navigation.navigate('CartScreens');
              }}
              style={styles.buyNowButton}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 360,
    backgroundColor: '#f4f4f4',
  },
  noImageContainer: {
    width: '100%',
    height: 360,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  detailContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'left',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  salePrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  shippingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  shippingText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 20,
    marginRight: 5,
  },
  label: {
    color: '#555',
    width: 80,
    fontWeight: '600',
    marginLeft: 5,
  },
  value: {
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    fontWeight: '500',
  },
  variantContainer: {
    marginBottom: 15,
  },
  variantName: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  variantValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  variantImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  variantText: {
    color: '#555',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  description: {
    color: '#555',
    lineHeight: 22,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  chatButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buyNowButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
reviewButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 15,
  backgroundColor: '#f9f9f9',
  borderRadius: 8,
  marginVertical: 10,
},
reviewButtonText: {
  color: '#FF6B00',
  fontWeight: 'bold',
}

});

export default DetailScreen;