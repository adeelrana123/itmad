import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import { useAppTheme } from '../theme/ThemeContext';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useAppTheme();
// console.log('object ------',orders)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        // No token sent here
        const res = await axios.get('https://etimadmart.com/api/v1/order/userId');

        const result = Array.isArray(res.data.orders)
          ? res.data.orders
          : res.data.orders
          ? [res.data.orders]
          : [];

        setOrders(result);
      } catch (error) {
        console.log('❌ API fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
  <View style={[styles(theme).orderCard]}>
    <View style={styles(theme).section}>
      {item.cartSummary.map((product, index) => (
        <View key={index} style={styles(theme).productRow}>
          <Image
            source={{ uri: product.image }}
            style={styles(theme).productImage}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text numberOfLines={2} style={styles(theme).productTitle}>
              {product.title}
            </Text>
            <Text style={{ color: theme.text }}>Qty: {product.count}</Text>
            <Text style={{ color: theme.text }}>Price: Rs. {product.price}</Text>
          </View>
        </View>
      ))}

     {item.deliveryCharges > 0 && (
  <Text style={{ color: theme.text, marginTop: 5 }}>
    Shipping Charges: Rs. {item.deliveryCharges}
  </Text>
)}

{item.freeShipping && (
  <Text style={{ color: theme.green, marginTop: 5 }}>
    Free Shipping ✅
  </Text>
)}


      {/* ✅ Show total only once */}
      <Text style={styles(theme).total}>Total: Rs. {item.totalPrice}</Text>
    </View>

    <View style={styles(theme).statusDateRow}>
      <Text style={styles(theme).status}>Status: {item.status || 'Pending'}</Text>
      <Text style={styles(theme).date}>
        Date: {new Date(item.orderedAt).toLocaleDateString()}
      </Text>
    </View>

    <View style={styles(theme).section}>
      <Text style={styles(theme).sectionTitle}>Customer Info:</Text>
      <Text style={styles(theme).infoText}>
        Name: {item.shippingAddress.fullName || `${item.shippingAddress.firstName || ''} ${item.shippingAddress.lastName || ''}`}
      </Text>
      <Text style={styles(theme).infoText}>Mobile: {item.shippingAddress.mobile}</Text>
      <Text style={styles(theme).infoText}>Email: {item.shippingAddress.email}</Text>
      {item.shippingAddress?.apartment ? (
        <Text style={styles(theme).infoText}>Apartment: {item.shippingAddress.apartment}</Text>
      ) : null}
      <Text style={styles(theme).infoText}>Address: {item.shippingAddress.streetAddress}</Text>
      <Text style={styles(theme).infoText}>City: {item.shippingAddress.city}</Text>
      <Text style={styles(theme).infoText}>Province: {item.shippingAddress.province}</Text>
      {item.shippingAddress?.additionalInstructions ? (
        <Text style={styles(theme).infoText}>Note: {item.shippingAddress.additionalInstructions}</Text>
      ) : null}
      <Text style={styles(theme).infoText}>Order ID: {item._id}</Text>
    </View>
  </View>
);


  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Header title="My Orders" />
      <View style={styles(theme).container}>
        {loading ? (
          <View style={styles(theme).loaderContainer}>
            <ActivityIndicator size="large" color={theme.buttonBackground} />
          </View>
        ) : orders.length === 0 ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text style={{ color: theme.text, textAlign: 'center' }}>
    No orders found.
  </Text>
</View>

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

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.background,
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    orderCard: {
      backgroundColor: theme.cardBackground,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      elevation: 3,
    },
    productRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    productImage: {
      width: 100,
      height: 120,
      borderRadius: 8,
      backgroundColor: '#eee',
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    section: {
      marginTop: 1,
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: theme.text,
    },
    statusDateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    status: {
      color: theme.buttonBackground,
      fontWeight: '600',
    },
    date: {
      fontSize: 16,
      color: theme.mutedText,
    },
    total: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 10,
      color: theme.red,
    },
    infoText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 4,
    },
  });

export default OrderListScreen;
