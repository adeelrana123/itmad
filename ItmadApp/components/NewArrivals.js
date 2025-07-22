import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchNewArrivals } from '../services/api'; 
import Pagination from './Pagination';
import Icon from 'react-native-vector-icons/FontAwesome';
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 50) / 2;
const PAGE_SIZE = 10;



const NewArrivals = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  //  console.log('projuct',products)
  const onPageChange = (newPage) => {
    setPage(newPage);
  };


const StarRating = ({ rating }) => {
  const maxStars = 5;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Icon
        key={i}
        name="star"
        size={14}
        color={i <= rating ? '#FFD700' : '#CCCCCC'} // Yellow if i <= rating else Gray
        style={{ marginRight: 2 }}
      />
    );
  }

  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};



  useEffect(() => {
    const loadNewArrivals = async () => {
      setLoading(true);
      try {
        const data = await fetchNewArrivals(page, PAGE_SIZE);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (err) {
        console.log('Failed to load new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, [page]);

 

  const renderItem = ({ item }) => {
     const reviewsCount = item.reviews?.length || 0;
const minRating = reviewsCount > 0
  ? Math.min(...item.reviews.map(r => r.rating))
  : 0;
    const imageUri = item.variants?.[0]?.values?.[0]?.image || item.images?.[0];

    return (
 <TouchableOpacity
  style={styles.card}
  onPress={() => {
    const productData = {
      ...item,
      userId: item.creator || 'fallback-id',
      slug: item.slug || '',
      category: item.category, // ✅ this line is missing in your log
    };

    // console.log('Passing to Detail:', productData);

    navigation.navigate('Detail', {
      product: productData,
    });
  }}
>




        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
        <View style={styles.productInfoContainer}>
          <View style={styles.priceContainer}>
            {item.price > item.salePrice && (
              <Text style={styles.originalPrice}>Rs. {item.price}</Text>
            )}
            <Text style={styles.productPrice}>    Rs. {item.salePrice}</Text>
          </View>
          <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.productCategory} numberOfLines={1}>{item.category?.name}</Text>
<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <StarRating rating={minRating} />
         <Text style={{ marginLeft: 6, fontSize: 12, color: '#666' }}>
{reviewsCount > 0 ? `(${reviewsCount})` : ''}
</Text>
        </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>New Arrivals</Text> */}
              <Text style={styles.heading}>New Arrivals ({totalProducts})</Text>
             
           
      {loading ? (
        <ActivityIndicator size="small" color="orange" />
      ) : products.length === 0 ? (
        <Text style={styles.noDataText}>No Products Found</Text>
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex:1
  },
  card: {
    marginRight: 10,
    overflow: 'hidden',
     width: cardWidth,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
   borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
    fontSize: 14,
  },
  productInfoContainer: {
    paddingHorizontal: 10,
  },
  productName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#333',
  },
  productCategory: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  productPrice: {
    fontWeight: 'bold',
    color: '#FF9800',
    fontSize: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
   fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    paddingVertical: 20,
  },
   header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    // color: '#FFB727',
      paddingHorizontal: 15,
      marginBottom:10,
    color: '#FF9800',
  },
  productCount: {
    fontSize: 12,
    color: '#666',
  },
});

export default NewArrivals;
