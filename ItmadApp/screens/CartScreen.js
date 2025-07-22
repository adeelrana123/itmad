import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
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
import Icon from 'react-native-vector-icons/FontAwesome';
const CartScreen = () => {
  
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
 
  const getSubtotal = () => {
  return cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
};
const hasDeliveryCharge = cartItems.some(item => !item.freeShipping);
const deliveryCharge = hasDeliveryCharge ? 200 : 0;
const totalBill = getSubtotal() + deliveryCharge;  
const openWhatsApp = () => {
  const phoneNumber = '+923071111832';

  if (cartItems.length === 0) {
    Alert.alert('Cart is empty', 'Please add products to cart before ordering.');
    return;
  }

  let message = `🛒 *New Order Request*\n\n`;

  cartItems.forEach((item, index) => {
    const selectedValue = item.selectedOptionText || 'N/A';
    const displayTitle = selectedValue !== 'N/A' 
      ? `${item.title} – ${selectedValue}`
      : item.title;

    message += `
${index + 1}) *${displayTitle}*
- Price: Rs. ${item.salePrice}
- Quantity: ${item.quantity}
`;
  });

  const subtotal = getSubtotal();
  const deliveryCharge = cartItems.some(item => !item.freeShipping) ? 200 : 0;
  const total = subtotal + deliveryCharge;

  message += `
━━━━━━━━━━━━━━━
*Subtotal:* Rs. ${subtotal}
🚚 *Delivery Charges:* Rs. ${deliveryCharge}
*Total Amount:* Rs. ${total}
━━━━━━━━━━━━━━━
Thank you for shopping with us!
`;

  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert('Error', 'Make sure WhatsApp is installed on your device.');
  });
};


 const renderItem = ({ item }) => (
  <CartItemCard
    item={item}
    onIncrement={() => dispatch(incrementQuantity(item.variantKey))}
    onDecrement={() => dispatch(decrementQuantity(item.variantKey))}
    onRemove={() => dispatch(removeFromCart({ variantKey: item.variantKey }))}
  />
);


  if (!cartItems) {
  
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
            <Text style={styles.totalTexts}>Summary </Text>

     <View style={{flexDirection:"row",justifyContent:"space-between"}}>
              <Text style={styles.totalText}>SubTotal</Text>
             <Text style={styles.totalText}>Rs. {getSubtotal()}</Text>
     </View>
 <View style={{flexDirection:"row",justifyContent:"space-between"}}>
<Text style={styles.totalText}>Delivery Charges</Text>
<Text style={styles.totalText}>Rs. {deliveryCharge}</Text>
 </View>
 <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:5}}>
<Text style={styles.totalTextbill}>Total Bill</Text>
<Text style={styles.totalTextbill}>Rs. {totalBill}</Text>
      </View>      

            <TouchableOpacity
              style={[
                styles.checkoutButton,{backgroundColor:'gray'},
                // cartItems.length === 0 && { backgroundColor: '#999' },
              ]}
              disabled={cartItems.length === 0}
              onPress={() => navigation.navigate('CartScreens')} 
            >
              <Text style={styles.checkoutText}>Proceed to Order</Text>
            </TouchableOpacity>

             <TouchableOpacity
             onPress={() =>openWhatsApp()}
              style={styles.checkoutButton}
            >
              <Icon name="whatsapp" size={20} color="#fff" />
              <Text style={styles.clearText}>Order by Wattsup</Text>
            </TouchableOpacity>
             <TouchableOpacity
              style={styles.clearButton}
              onPress={() => dispatch(clearCart())}
            >
              <Text style={styles.clearText}>Clear Cart</Text>
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
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
   totalTexts: { fontSize: 18,
     fontWeight: 'bold', 
     color: '#FF9800',
     textAlign:"center"
     },
  totalText: { fontSize: 14,
     fontWeight: 'bold', 
     },
      totalTextbill: { fontSize: 18,
     fontWeight: 'bold', 
     color: '#FF9800',
     },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    
  },
  clearText: { color: 'white', fontWeight: 'bold',marginLeft:5 },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom:5,
    flexDirection:"row",
    justifyContent:"center"
  },
  checkoutText: { color: 'white', fontWeight: 'bold' },
});

export default CartScreen;
