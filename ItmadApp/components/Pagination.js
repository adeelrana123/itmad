import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <View style={styles.container}>
      {/* Prev Button */}
      <TouchableOpacity
        disabled={page === 1}
        onPress={() => onPageChange(page - 1)}
        style={[styles.button, page === 1 && styles.disabledButton]}
      >
        <View style={styles.row}>
          <Ionicons
            name="chevron-back"
            size={18}
            color={page === 1 ? '#ccc' : 'white'}
            style={{ marginRight: 2 }}
          />
          {/* <Text style={[styles.text, page === 1 && styles.disabledText]}>Prev</Text> */}
        </View>
      </TouchableOpacity>

      
      {/* <View style={styles.pageNumber}>
        <Text style={styles.pageText}>{page}</Text>
      </View> */}

      {/* Next Button */}
      <TouchableOpacity
        disabled={page === totalPages}
        onPress={() => onPageChange(page + 1)}
        style={[styles.button, page === totalPages && styles.disabledButton]}
      >
        <View style={styles.row}>
          {/* <Text style={[styles.text, page === totalPages && styles.disabledText]}>N</Text> */}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 5,
    marginHorizontal: 5,
    paddingHorizontal: 7,
    paddingVertical:5,
    // height: 30,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#888',
  },
  pageNumber: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Pagination;
