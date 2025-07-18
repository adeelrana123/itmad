// components/CartItemCard.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CartItemCard = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={styles.price}>Rs. {item.salePrice}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onDecrement}  style={{
          backgroundColor: '#ddd',
           padding: 2,
           borderRadius:15,
          width:25,
          height:25,
          justifyContent:"center",
          alignItems:"center",
          
        }}>
           <Icon name="remove" size={18} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={onIncrement}  style={{
          backgroundColor: '#FFB727',
           padding: 2,
           borderRadius:15,
          width:25,
          height:25,
          justifyContent:"center",
          alignItems:"center",
          
        }}>
           <Icon name="add" size={18} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Icon name="trash-outline" size={24} color="red" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
         </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 18,
    color: '#FF6B00',
    marginTop: 4,
    fontWeight:"700"
  },
  shipping: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default CartItemCard;
