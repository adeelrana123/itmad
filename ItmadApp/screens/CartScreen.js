import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
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
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const getTotal = () => {
    let total = cartItems.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );
    const hasDeliveryCharge = cartItems.some(item => !item.freeShipping);

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
     onRemove={() => dispatch(removeFromCart({ variantKey: item.variantKey }))}
    />
  );

  if (!cartItems) {
    // Optionally handle undefined cartItems
    return (
      <View style={styles.container}>
        <Header title="Cart" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#333" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Cart" />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
           keyExtractor={(item) => item.variantKey}
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
              style={[
                styles.checkoutButton,
                cartItems.length === 0 && { backgroundColor: '#999' },
              ]}
              disabled={cartItems.length === 0}
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
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
