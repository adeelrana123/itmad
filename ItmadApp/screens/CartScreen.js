import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from '../redux/cartSlice';
import CartItemCard from '../components/CartItemCard';
import Header from '../components/Header';

const CartScreen = () => {
  const navigation = useNavigation();
  const [checkingLogin, setCheckingLogin] = useState(true);
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login', { redirectTo: 'Cart' });
        return;
      }
      setCheckingLogin(false);
    };

    checkLogin();
  }, []);

 const getTotal = () => {
  let total = cartItems.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );

  // Check if at least one item requires shipping
  const hasDeliveryCharge = cartItems.some(item => !item.freeShipping);

  // Add Rs. 200 only once if needed
  if (hasDeliveryCharge) {
    total += 200;
  }

  return total;
};


 

 const renderItem = ({ item }) => (
  <CartItemCard
    item={item}
    onIncrement={() => dispatch(incrementQuantity(item.id))}
    onDecrement={() => dispatch(decrementQuantity(item.id))}
    onRemove={() => dispatch(removeFromCart(item.id))}
  />
);

 return (
  <View style={styles.container}>
    <Header title="Cart" />

    {checkingLogin ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    ) : cartItems.length === 0 ? (
      <Text style={styles.emptyText}>Your cart is empty</Text>
    ) : (
      <>
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id + index}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />

        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: Rs. {getTotal()}</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => dispatch(clearCart())}
          >
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('CartScreens')}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
);

};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  emptyText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 30 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { marginLeft: 10, flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 16, color: '#FF6B00', marginTop: 4 },
  shipping: { fontSize: 14, color: '#666', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    backgroundColor: '#fff',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: { color: 'white', fontWeight: 'bold' },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutText: { color: 'white', fontWeight: 'bold' },
});

export default CartScreen;
