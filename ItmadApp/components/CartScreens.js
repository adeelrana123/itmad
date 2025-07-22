import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from './Header';
import { createOrder } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const CartScreens = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    province: '',
    city: '',
    street: '',
    apartment: '',
    mobile: '',
    email: '',
    note: '',
  });

  const handleChange = (key, value) => {
    setCustomerInfo(prev => ({ ...prev, [key]: value }));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0
  );

  const hasShipping = cartItems.some(
    item => !item.freeShipping && item.deliveryCharges > 0
  );

  const grandTotal = hasShipping ? subtotal + 200 : subtotal;

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before placing an order.');
      return;
    }

    if (
      !customerInfo.fullName ||
      !customerInfo.city ||
      !customerInfo.street ||
      !customerInfo.mobile
    ) {
      Alert.alert('Missing Info', 'Please fill all required fields.');
      return;
    }

    setLoading(true);

    const orderPayload = {
      shippingAddress: {
        fullName: customerInfo.fullName,
        city: customerInfo.city,
        streetAddress: customerInfo.street,
        apartment: customerInfo.apartment,
        mobile: customerInfo.mobile,
        email: customerInfo.email,
        additionalInstructions: customerInfo.note,
      },
      cartSummary: cartItems.map(item => ({
        productId: item.id,
        title: item.title,
        image: item.image,
        count: item.quantity,
        price: item.salePrice,
        selectedVariants: item.selectedVariants || [],
      })),
      deliveryCharges: cartItems.some(item => !item.freeShipping && item.deliveryCharges > 0) ? 200 : 0,
      // deliveryCharges: cartItems.reduce((acc, item) => acc + (item.deliveryCharges || 0), 0),
      freeShipping: cartItems.every(item => item.freeShipping || item.deliveryCharges === 0),
      totalPrice: grandTotal,
      orderedAt: new Date().toISOString(),
    };

    try {
      // console.log("🟢 Sending order...", orderPayload);
      const response = await createOrder(orderPayload);
      // console.log("✅ Order response:", response.data);

      Alert.alert('Success', 'Order submitted successfully!');
      dispatch(clearCart());
      navigation.goBack();
    } catch (err) {
      console.log('❌ Order Error:', err);
      Alert.alert('Error', 'Failed to submit order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="Checkout" />
      </View>

      <ScrollView style={styles.scrollArea}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
              <View style={styles.itemRow}>
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.price}> Rs:{item.salePrice}</Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        ))}
        <View style={{ padding: 15 }}>
          <Text style={styles.sectionTitle}>Your Address</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            onChangeText={text => handleChange('fullName', text)}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="City"
            style={styles.input}
            onChangeText={text => handleChange('city', text)}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Street Address"
            style={styles.input}
            onChangeText={text => handleChange('street', text)}
             placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Apartment, Suite, etc. (optional)"
            style={styles.input}
            onChangeText={text => handleChange('apartment', text)}
            placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={text => handleChange('mobile', text)}
             placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Email Address (optional)"
            style={styles.input}
            keyboardType="email-address"
            onChangeText={text => handleChange('email', text)}
             placeholderTextColor="#000"
          />
          <TextInput
            placeholder="Additional Instructions (optional)"
            style={[styles.input, { height: 100 }]}
            multiline
            numberOfLines={4}
            onChangeText={text => handleChange('note', text)}
             placeholderTextColor="#000"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {hasShipping ? (
          <View style={styles.shippingRow}>
            <Icon name="truck" size={16} color="#FF6B00" style={styles.icon} />
            <Text style={styles.shipping}>Delivery Charges: Rs. 200</Text>
          </View>
        ) : (
          <View style={styles.shippingRow}>
            <Icon name="truck" size={16} color="green" style={styles.icon} />
            <Text style={styles.freeShipping}>Free Delivery</Text>
          </View>
        )}

        <Text style={styles.grandTotal}>Grand Total: Rs. {grandTotal}</Text>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmitOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreens;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: { width: '100%' },
  scrollArea: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  thumbnail: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444',
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#e53935',
  },
  submitBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeShipping: {
    color: 'green',
    fontSize: 13,
  },
  shipping: {
    color: '#333',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0,
    marginBottom: 10,
    fontSize: 16,
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
