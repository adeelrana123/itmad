// components/QuantitySelector.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const QuantitySelector = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <TouchableOpacity
        onPress={onDecrement}
        style={{
          backgroundColor: '#ddd',
          padding: 5,
          borderRadius:20,
          width:30,
          height:30,
          justifyContent:"center",
          alignItems:"center",
        }}
      >
        <Icon name="remove" size={18} color="#000" />
      </TouchableOpacity>

      <Text style={{ fontSize: 16 }}>{quantity}</Text>

      <TouchableOpacity
        onPress={onIncrement}
        style={{
          backgroundColor: '#FFB727',
           padding: 5,
           borderRadius:20,
          width:30,
          height:30,
          justifyContent:"center",
          alignItems:"center",
          
        }}
      >
        <Icon name="add" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;
