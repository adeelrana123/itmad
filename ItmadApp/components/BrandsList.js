import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { fetchbrands } from '../services/api';
import { useNavigation } from '@react-navigation/native';


const BrandsList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
const navigation = useNavigation();
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await fetchbrands();
        if (data?.brands) {
          setBrands(data.brands); 
        } else {
          setBrands(data); 
        }
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  

 return (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Top Brands</Text>
    </View>

    {loading ? (
      <ActivityIndicator size="small" color="orange" />
    ) : brands.length === 0 ? (
      <Text style={styles.noDataText}>No Brands Found</Text>
    ) : (
      <FlatList
        data={brands}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.brandItem}
            onPress={() =>
              navigation.navigate('BrandProducts', { brand: item.name })
            }
          >
            <View style={styles.logoContainer}>
              <Image source={{ uri: item.logo }} style={styles.logo} />
            </View>
            <Text style={styles.brandName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    )}
  </View>
);

};

const styles = StyleSheet.create({
     sectionHeader: {

    paddingHorizontal: 15,

  marginTop:10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  loaderContainer: {
    // paddingVertical: 10,
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  brandItem: {
    alignItems: 'center',
width: 60,
marginHorizontal:5,
marginTop:10,

  },
 logoContainer: {
  width: 60, // ya jitna aapko chahiye
  height: 60,
  padding: 10, // yahan se control hoga image ka size and spacing
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 30,
  backgroundColor: '#fff', // optional
  borderWidth: 1,
  borderColor: '#ccc', // optional
},

logo: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain', // 'objectFit' React Native mein nahi hota
  borderRadius: 999, // fully round
},

  brandName: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
    textTransform:"uppercase"
  },
  noDataText: {
  textAlign: 'center',
  fontSize: 16,
  color: '#888',
  paddingVertical: 20,
},
});

export default BrandsList;
