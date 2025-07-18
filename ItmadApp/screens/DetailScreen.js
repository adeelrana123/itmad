import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector,  } from 'react-redux';
import { addToCart, } from '../redux/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';
import ProductReviews from '../components/ProductReviews';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductDescription from '../components/ProductDescription';
import { fetchproductReview, fetchProductsByslug } from '../services/api';
import RelatedProductsList from '../components/Relatedproducts';
import styles from '../styles/detailScreenStyles';
import OpenWhatsAppButton from '../components/OpenWhatsAppButton';
import ProductImageCarousel from '../components/ProductImageCarousel';
import QuantitySelector from '../components/QuantitySelector';
import slugify from 'slugify';
import ReviewForm from '../components/ReviewForm';
const DetailScreen = ({ route }) => {
  // const { product, slug } = route.params;
 const { product, slug: routeSlug } = route.params;
const slug = routeSlug || product?.slug;
// console.log('slug,,,,', slug);
  // console.log('Received route params:', product);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const scrollViewRef = useRef(null);
  const [selectedVariantValues, setSelectedVariantValues] = useState({});
  const [loadedProduct, setLoadedProduct] = useState(product);
  const [reviews, setReviews] = useState([]);
  // console.log('Category object:', loadedProduct.category);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageArray, setImageArray] = useState(product?.images || []);
  const [activeTab, setActiveTab] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
const [quantity, setQuantity] = useState(1);
  const categoryId = loadedProduct?.category?._id || loadedProduct?.category?.id;
  const excludeProductId = loadedProduct?._id || loadedProduct?.id;
  // const selectedUserId = loadedProduct?.userId || loadedProduct?.creator || 'fallback-id';

 // const variantKey = `${loadedProduct._id}_${imageArray[currentImageIndex]}`;
const user = useSelector(state => state.auth.user);
//  console.log('🧑 Logged-in user:', user);

    const simpleSlugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         
    .replace(/[^\w\-]+/g, '')     
    .replace(/\-\-+/g, '-');      


  loadedProduct.category?.slug ||
  simpleSlugify(loadedProduct.category?.name || '');

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
          // console.log('➡️ category:', result.category);
          setLoadedProduct(result);
          setImageArray(result?.images || []);
        } catch (error) {
          console.error('❌ Error fetching product by slug:', error);
        }
      }
    };

    fetchProduct();
  }, [slug]);

useEffect(() => {
  const fetchReview = async () => {
    if (slug) {
      try {
        const data = await fetchproductReview(slug);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('❌ Error fetching product reviews:', error);
      }
    }
  };
  fetchReview();
}, [slug]);



  const handleAddToCart = () => {
    if (loadedProduct.variants?.length && Object.keys(selectedVariantValues).length === 0) {
      alert('Please select product options before adding to cart.');
      return;
    }

    dispatch(addToCart(cartPayload));
  };

  if (!loadedProduct) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading product...</Text>
      </View>
    );
  }
  const selectedOptionText = Object.entries(selectedVariantValues)
    .map(([variantId, valueId]) => {
      const variant = loadedProduct.variants.find(v => v._id === variantId);
      const valueObj = variant?.values.find(v => v._id === valueId);
      return valueObj?.value;
    })
    .filter(Boolean)
    .join(', ');
   
  const variantKey = `${loadedProduct._id}_${imageArray[currentImageIndex]}`;
  const cartPayload = {
    id: loadedProduct._id,
    title: loadedProduct.title,
    salePrice: loadedProduct.salePrice,
    image: imageArray[currentImageIndex] || '',
    deliveryCharges: loadedProduct.deliveryCharges ?? 200,
    variantKey:variantKey,
    freeShipping: loadedProduct.freeShipping ?? false,
    selectedOptionText,
    count:quantity
  };
  // console.log('cartPayload',cartPayload)
  
  const renderVariant = ({ item }) => (
    <View style={styles.variantContainer}>
      <Text style={styles.variantName}>{item.name}:</Text>
      <View style={styles.variantValues}>
        {item.values.map(value => {
          const isSelected = selectedVariantValues[item._id] === value._id;

          const index = imageArray.findIndex(img => {
            if (typeof img !== 'string' || typeof value.image !== 'string') return false;
            return img.includes(value.image) || value.image.includes(img);
          });

          return (
            <TouchableOpacity
              key={value._id}
              style={[
                styles.variantItem,
                isSelected && styles.selectedVariantItem
              ]}
              onPress={() => {
                setSelectedVariantValues(prev => ({
                  ...prev,
                  [item._id]: value._id,
                }));

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
              <Text style={[styles.variantText, isSelected && { fontWeight: 'bold', color: 'green' }]}>
                {value.value} {isSelected ? '✔️' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Product Details" showCart />

      <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingBottom: 180 }}>
        <ProductImageCarousel
          imageArray={imageArray}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          styles={styles}
           price={loadedProduct.price}
  salePrice={loadedProduct.salePrice}
        />
        <View style={styles.detailContainer}>
          <Text style={styles.value}>{loadedProduct.title}</Text>
          
           
<TouchableOpacity
  onPress={() => {
    const categoryName = loadedProduct.category?.slug || slugify(loadedProduct.category?.name || '');



    navigation.navigate('CategoryScreen', {
      categoryId: loadedProduct.category?._id,
      categoryName,
    });
  }}
>
  <Text
    style={[
      styles.value,
      styles.linkText,
      !loadedProduct.category?.slug && { color: '#007bff' },
    ]}
  >
    {loadedProduct.category?.name || 'Loading category...'}
  </Text>
</TouchableOpacity>

          <View style={styles.priceContainer}>
            {loadedProduct.price > loadedProduct.salePrice && (
              <Text style={styles.originalPrice}>Rs. {loadedProduct.price}</Text>
            )}
            <Text style={styles.salePrice}>Rs. {loadedProduct.salePrice}</Text>

     <QuantitySelector
  quantity={quantity}
  onIncrement={() => setQuantity(prev => prev + 1)}
  onDecrement={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
/>

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

{activeTab === 'reviews' && (
  <>
    <FlatList
      data={reviews}
      keyExtractor={(item) => item._id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          marginVertical: 8,
          marginHorizontal: 4,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 35,
                height: 35,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#ccc',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
                <Icon name="user" size={30} color="#555" />
              </View>
              <Text style={{ fontWeight: '700', fontSize: 15 }}>
                {item.reviewerId?.username || item.email}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#999' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {/* Rating */}
          <View style={{ flexDirection: 'row', marginTop: 3, marginBottom: 5, marginLeft: 43 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= item.rating ? 'star' : 'star-o'}
                size={14}
                color="#f1c40f"
                style={{ marginRight: 2 }}
              />
            ))}
          </View>

          {/* Comment */}
          <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
            {item.reviewText}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No reviews yet.</Text>}
    />

    <ReviewForm
      userEmail={user?.email}
      productSlug={loadedProduct.slug || slug}
      reviewerId={user?._id}
    />
  </>
)}







          <View style={styles.related}>
            <Text style={styles.textrelated}>Related Products</Text>
          </View>
          <RelatedProductsList
            categoryId={categoryId}
            excludeProductId={excludeProductId}
          />
      </View>
    
      </ScrollView>

      <View style={styles.fixedBottomContainer}>
        <TouchableOpacity

          onPress={handleAddToCart}

          style={styles.reviewButtonBottom}
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.reviewButtonTextBottom}>Add to Cart</Text>
        </TouchableOpacity>

        <OpenWhatsAppButton
          product={loadedProduct}
          selectedVariantValues={selectedVariantValues}
          quantity={quantity}
        />

        <TouchableOpacity
          onPress={() => {
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
export default DetailScreen;
