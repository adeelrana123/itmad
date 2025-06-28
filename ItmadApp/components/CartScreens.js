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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  clearCart,
} from '../redux/cartSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from './Header';
import { createOrder } from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const CartScreens = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
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

  const grandTotal = cartItems.reduce((acc, item) => {
    const price = item.salePrice * item.quantity;
    const shipping = item.deliveryCharges || 0;
    return acc + price + shipping;
  }, 0);

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Please add items before placing an order.');
      return;
    }

    if (
      !customerInfo.firstName ||
      !customerInfo.lastName ||
      !customerInfo.province ||
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
    firstName: customerInfo.firstName,
    lastName: customerInfo.lastName,
    province: customerInfo.province,
    city: customerInfo.city,
    streetAddress: customerInfo.street,
    apartment: customerInfo.apartment,
    mobile: customerInfo.mobile,
    email: customerInfo.email,
    additionalInstructions: customerInfo.note,
  },

  cartSummary: cartItems.map(item => ({
    productId:item.id,
    title: item.title,
    image: item.image,
    count: item.quantity,
    price: item.salePrice,
    selectedVariants: item.selectedVariants || [], 
  })),

  deliveryCharges: cartItems.reduce((acc, item) => acc + (item.deliveryCharges || 0), 0),
  freeShipping: cartItems.every(item => item.freeShipping || item.deliveryCharges === 0),
  totalPrice: grandTotal,
  orderedAt: new Date().toISOString(),
};




    try {
      console.log("🟢 Sending order...",orderPayload);
const response = await createOrder(orderPayload);
console.log("✅ Order response:", response.data);

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
        <Header title="Checkout " />
      </View>

      <ScrollView style={styles.scrollArea}>
        {cartItems.map(item => {
          const itemPrice = item.salePrice;
          const shipping = item.deliveryCharges || 0;
          const totalPrice = itemPrice * item.quantity + shipping;

          return (
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
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.priceQtyRow}>
                      <Text style={styles.price}>Rs. {item.salePrice}</Text>
                      <View style={styles.quantityRow}>
                        <TouchableOpacity onPress={() => dispatch(decrementQuantity(item.id))}>
                          <Text style={styles.qtyBtn}>➖</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => dispatch(incrementQuantity(item.id))}>
                          <Text style={styles.qtyBtn}>➕</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.shippingDeleteRow}>
                      {item.freeShipping || item.deliveryCharges === 0 ? (
                        <View style={styles.shippingRow}>
                          <Icon name="truck" size={16} color="green" style={styles.icon} />
                          <Text style={styles.freeShipping}>Free Shipping</Text>
                        </View>
                      ) : (
                        <View style={styles.shippingRow}>
                          <Icon name="truck" size={16} color="#FF6B00" style={styles.icon} />
                          <Text style={styles.shipping}>
                            Shipping: Rs. {item.deliveryCharges}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.shippingDeleteRow}>
                      <Text style={styles.total}>Total: Rs. {totalPrice}</Text>
                      {/* <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                        <Icon name="trash" size={18} color="red" />
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          );
        })}

        {/* Shipping Address */}
        <View style={{ padding: 15 }}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <TextInput
            placeholder="First Name "
            style={styles.input}
            onChangeText={text => handleChange('firstName', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Last Name "
            style={styles.input}
            onChangeText={text => handleChange('lastName', text)}
            placeholderTextColor="#333"
          />

          <View style={styles.input}>  
  <Picker
    selectedValue={customerInfo.province}
    onValueChange={value => handleChange('province', value)}
    style={styles.picker} 
    dropdownIconColor="#333" 
  >
    <Picker.Item label="Select Province" value="" enabled={false} />
    <Picker.Item label="Punjab" value="Punjab" />
    <Picker.Item label="Sindh" value="Sindh" />
    <Picker.Item label="Khyber Pakhtunkhwa" value="Khyber Pakhtunkhwa" />
    <Picker.Item label="Balochistan" value="Balochistan" />
    <Picker.Item label="Gilgit-Baltistan" value="Gilgit-Baltistan" />
    <Picker.Item label="Islamabad Capital Territory" value="Islamabad" />
    <Picker.Item label="Azad Jammu and Kashmir" value="AJK" />
  </Picker>
</View>


          <TextInput
            placeholder="City "
            style={styles.input}
            onChangeText={text => handleChange('city', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Street Address "
            style={styles.input}
            onChangeText={text => handleChange('street', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Apartment, Suite, etc. (optional)"
            style={styles.input}
            onChangeText={text => handleChange('apartment', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Mobile Number "
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={text => handleChange('mobile', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Email Address "
            style={styles.input}
            keyboardType="email-address"
            onChangeText={text => handleChange('email', text)}
            placeholderTextColor="#333"
          />
          <TextInput
            placeholder="Additional Instructions  (optional)"
            style={[styles.input, { height: 100 }]}
            multiline
            numberOfLines={4}
            onChangeText={text => handleChange('note', text)}
           placeholderTextColor="#333"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
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
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  thumbnail: {
    width: 80,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    fontSize: 26,
    paddingHorizontal: 8,
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  shippingDeleteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
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
  total: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#e53935',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
  color: '#333',
  fontSize: 16,
  height: 50,
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
