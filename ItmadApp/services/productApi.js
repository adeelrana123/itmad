import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { fetchAllProducts } from './api';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductApi = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts(1, 50)
      .then(res => {
        let all = res.data.products;
        if (searchQuery) {
          all = all.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setProducts(all);
        setLoading(false);
      })
      .catch(err => {
        console.log('❌ Fetch error:', err);
        setLoading(false);
      });
  }, [searchQuery]);

  const renderProductImage = (item) => {
    const imageUri = item.variants?.[0]?.values?.[0]?.image || 
                    (item.images && item.images[0]);
    
    if (!imageUri) {
      return (
        <View style={styles.noImageContainer}>
          <Icon name="image" size={50} color="#ccc" />
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    );
  };

  const renderVariant = (variant) => {
    return (
      <View key={variant._id} style={styles.variantContainer}>
        <Text style={styles.variantName}>{variant.name}:</Text>
        <View style={styles.variantValues}>
          {variant.values.map(value => (
            <View key={value._id} style={styles.variantValue}>
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
  };

  // Function to strip HTML tags
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>?/gm, ' ');
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FF6B00"
        style={{ marginTop: 20 }}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={products}
        keyExtractor={item => item._id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Product Image */}
            {renderProductImage(item)}
            
            {/* Product Name */}
            <Text style={styles.name}>{item.name}</Text>
            
            {/* Price Information */}
            <View style={styles.priceContainer}>
              <Text style={styles.salePrice}>Rs {item.salePrice}</Text>
              {item.price > item.salePrice && (
                <Text style={styles.originalPrice}>Rs {item.price}</Text>
              )}
              {item.freeShipping ? (
                <Text style={styles.freeShipping}>Free Shipping</Text>
              ) : (
                <Text style={styles.shipping}>+ Rs {item.deliveryCharges} Shipping</Text>
              )}
            </View>
            
            {/* Basic Info */}
            <View style={styles.infoRow}>
              <Icon name="tag" size={16} color="#FF6B00" />
              <Text style={styles.infoText}>Brand: {item.brand?.name || 'No Brand'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="folder" size={16} color="#FF6B00" />
              <Text style={styles.infoText}>Category: {item.category?.name || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="database" size={16} color="#FF6B00" />
              <Text style={styles.infoText}>Stock: {item.stock} units</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="shopping-cart" size={16} color="#FF6B00" />
              <Text style={styles.infoText}>Sold: {item.sold} units</Text>
            </View>
            
            {/* Variants */}
            {item.variants?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Available Options</Text>
                {item.variants.map(renderVariant)}
              </View>
            )}
            
            {/* Tags */}
            {item.tags?.length > 0 && (
              <View style={styles.tagsContainer}>
                {item.tags.map(tag => (
                  <View key={tag._id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.name}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Description */}
            {item.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Product Details</Text>
                <Text style={styles.plainText}>
                  {stripHtmlTags(item.description)}
                </Text>
              </View>
            )}
            
            {/* Long Description */}
            {item.longDescription && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.plainText}>
                  {stripHtmlTags(item.longDescription)}
                </Text>
              </View>
            )}
            
            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyNowButton}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 10,
    marginTop: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  noImageText: {
    color: '#888',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  salePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  freeShipping: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  shipping: {
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#555',
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  plainText: {
    color: '#555',
    lineHeight: 20,
  },
  variantContainer: {
    marginBottom: 10,
  },
  variantName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  variantValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  variantValue: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
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
    marginTop: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToCartButton: {
    backgroundColor: '#FF6B00',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buyNowButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductApi;