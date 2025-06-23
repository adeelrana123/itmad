import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import Header from '../components/Header';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        navigation.replace('Login', { redirectTo: 'Orders' });
        return;
      }

      try {
        const res = await axios.get('https://etimadmart.com/api/v1/order/userId', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('✔ API success:', res.data);
        const result = Array.isArray(res.data.orders) ? res.data.orders : res.data.orders ? [res.data.orders] : [];
        setOrders(result);
      } catch (error) {
        console.log('❌ API fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
         <Text style={styles.orderId}>Order ID: {item._id}</Text>
          <View style={styles.section}>
        {item.cartSummary.map((product, index) => (
          <View key={index} style={styles.productRow}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text numberOfLines={2} style={styles.productTitle}>{product.title}</Text>
              <Text>Qty: {product.count}</Text>
              <Text>Price: Rs. {product.price}</Text>
              
    <Text style={{ color: item.freeShipping ? 'green' : 'black' }}>
      {item.freeShipping
        ? 'Free Shipping ✅'
        : `Shipping Charges: Rs. ${item.deliveryCharges || 0}`}
    </Text>
    <Text style={styles.total}>Total: Rs. {item.totalPrice}</Text>
            </View>
          </View>
        ))}
      </View>
     
     <View style={styles.statusDateRow}>
  <Text style={styles.status}>Status: {item.status || 'Pending'}</Text>
  <Text style={styles.date}>
    Date: {new Date(item.orderedAt).toLocaleDateString()}
  </Text>
</View>
      
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Customer Info:</Text>
  <Text style={styles.infoText}>Name: {item.shippingAddress.firstName} {item.shippingAddress.lastName}</Text>
  <Text style={styles.infoText}>Mobile: {item.shippingAddress.mobile}</Text>
  <Text style={styles.infoText}>Email: {item.shippingAddress.email}</Text>

  {item.shippingAddress?.apartment ? (
    <Text style={styles.infoText}>Apartment: {item.shippingAddress.apartment}</Text>
  ) : null}

  <Text style={styles.infoText}>Address: {item.shippingAddress.streetAddress}</Text>
  <Text style={styles.infoText}>City: {item.shippingAddress.city}</Text>
  <Text style={styles.infoText}>Province: {item.shippingAddress.province}</Text>

  {item.shippingAddress?.additionalInstructions ? (
    <Text style={styles.infoText}>Note: {item.shippingAddress.additionalInstructions}</Text>
  ) : null}
</View>


    
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title="My Orders" />
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF6B00" />
          </View>
        ) : orders.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No orders found.
          </Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  orderId: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  status: { color: '#FF6B00', fontWeight: '600' },
  date: { fontSize: 16 },
  total: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  section: { marginTop: 10 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 5 },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusDateRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 5,
},

infoText: {
  fontSize: 14,
  color: '#333',
  marginBottom: 4,
},
});

export default OrderListScreen;
