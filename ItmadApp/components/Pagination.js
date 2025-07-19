import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <View style={styles.container}>
     <TouchableOpacity
  disabled={page === 1}
  onPress={() => onPageChange(page - 1)}
  style={[styles.button, page === 1 && styles.disabledButton]}
>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons
      name="chevron-back"
      size={18}
      color={page === 1 ? '#ccc' :'white'} // Change according to your theme
      style={{ marginRight: 2 }}
    />
    <Text style={[styles.text, page === 1 && styles.disabledText]}>Prev</Text>
  </View>
</TouchableOpacity>
      <TouchableOpacity
        disabled={page === totalPages}
        onPress={() => onPageChange(page + 1)}
        style={[styles.button, page === totalPages && styles.disabledButton]}
      >
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.texts, page === totalPages && styles.disabledText]}>Next</Text>
         <Ionicons
  name="chevron-forward"
  size={18}
  color={page === totalPages ? '#ccc' : 'white'} 
  style={{ marginLeft: 2 }}
/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent:"center"
  },
  button: {
    backgroundColor: '#FF9800',
    // paddingVertical: 4,
    // paddingHorizontal: 5,
    borderRadius: 5,
    marginLeft:5,
    width:60,
    height:25,
    justifyContent:"center"
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:"center",
   
  },
   texts: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:"center",
    paddingHorizontal:5
  },
  disabledText: {
    color: '#888',
  },
  pageInfo: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Pagination;
