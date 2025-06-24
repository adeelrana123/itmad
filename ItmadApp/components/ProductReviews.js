import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,Image } from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';

import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProductReviews = ({ route }) => {
  const { productId } = route.params;
  const [reviews, setReviews] = React.useState([]);
  const [newReview, setNewReview] = React.useState('');

 const [isSubmitting, setIsSubmitting] = React.useState(false);
 const [userName, setUserName] = React.useState('Guest User');
 const [userImage, setUserImage] = React.useState(null);
React.useEffect(() => {
  const fetchUserData = async () => {
    const storedName = await AsyncStorage.getItem('username');
    const storedImage = await AsyncStorage.getItem('avatar');
     console.log('🧾 Avatar URI from AsyncStorage:', storedImage);
    if (storedName) setUserName(storedName);
    if (storedImage) setUserImage(storedImage);
  };

  fetchUserData();
  fetchReviews();
}, [productId]);

    const handleAddReview = async () => {
    if (newReview.trim() === '') {
      Alert.alert('Error', 'Please enter your review');
      return;
    }
    
   

    setIsSubmitting(true);
    
   const reviewData = {
  productId,
 name: userName,
  comment: newReview,
 image: userImage,
  date: new Date().toISOString().split('T')[0],
  createdAt: firestore.Timestamp.now(), // ✅ use this
};

    try {
    
      console.log('Submitting review:', reviewData);
      console.log('Review Data:', JSON.stringify(reviewData, null, 2));

      await firestore().collection('productReviews').add(reviewData);
     
      await fetchReviews(); 
      
      Alert.alert(
        'Success',
        '✅ Your review has been submitted successfully.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert(
        'Error', 
        `Failed to submit review: ${error.message}`,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
     setNewReview('');
setReviews(''); 
    } finally {
      setIsSubmitting(false);
    }
  };

 const fetchReviews = async () => {
  try {
    const snapshot = await firestore()
      .collection('productReviews')
      .where('productId', '==', productId)
      .get(); 

    const fetchedReviews = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate()?.toISOString().split('T')[0] || doc.data().date
      }))
      .sort((a, b) => {
        // Manual sort fallback (if createdAt exists)
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return bTime - aTime;
      });

    setReviews(fetchedReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    Alert.alert('Error', 'Failed to load reviews');
  }
};

  React.useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (!productId) {
  Alert.alert('Error', 'Product ID is missing');
  console.error('❌ productId is undefined!');
  return;
}
console.log('Review values:', {
  productId,
  newReview,
 
});

return (
  <View style={styles.section}>
    <Header title="Product Reviews" />

    <ScrollView contentContainerStyle={{ padding: 15 }}>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <View key={review.id} style={styles.reviewItem}>
  <View style={styles.reviewHeader}>
    <View style={styles.nameRow}>
      {review.image ? (
  <Image source={{ uri: review.image }} style={styles.profileImage} />
) : (
  <View style={styles.defaultAvatar}>
    <Text style={styles.avatarText}>{review.name?.[0]}</Text>
  </View>
)}
      <Text style={styles.reviewName}>{review.name}</Text>
    </View>
    <Text style={styles.reviewDate}>{review.date}</Text>
  </View>

  <Text style={styles.reviewComment}>{review.comment}</Text>
</View>

        ))
      ) : (
        <Text style={styles.noReviewsText}>No reviews yet. Be the first to review!</Text>
      )}

      {/* Review Form */}
      <View style={styles.reviewInputContainer}>
        <Text style={styles.inputLabel}>Write a Review</Text>

        <TextInput
          placeholder="Share your honest thoughts about this product..."
          style={styles.reviewInput}
          value={newReview}
          onChangeText={setNewReview}
          multiline
          numberOfLines={4}
          editable={!isSubmitting}
        />

        {/* <Text style={styles.inputLabel}>Your Rating</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => !isSubmitting && setNewRating(star)}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Icon
                name={star <= newRating ? 'star' : 'star-o'}
                size={32}
                color={isSubmitting ? '#ccc' : '#FFD700'}
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View> */}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleAddReview}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

};

const styles = StyleSheet.create({
  section: {
    flex: 1,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  profileImage: {
  width: 35,
  height: 35,
  borderRadius: 50,
  marginRight: 10,
},
defaultAvatar: {
  width: 35,
  height: 35,
  borderRadius: 50,
  backgroundColor: '#ccc',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
},
avatarText: {
  color: '#fff',
  fontWeight: 'bold',
},
nameRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingBottom: 5,
  },
  reviewInputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  reviewInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewItem: {
  backgroundColor: '#f9f9f9',
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
  borderColor: '#ddd',
  borderWidth: 1, 
   borderLeftWidth: 1,
},

  reviewName: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewComment: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  noReviewsText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 15,
  },
  reviewHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  
},
});

export default ProductReviews;