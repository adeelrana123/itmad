import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createreview } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ReviewForm = ({ productSlug, reviewerId, userEmail }) => {
    const navigation = useNavigation();
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
// const user= useSelector(state=>
// state.auth.user
// )
const { user, token } = useSelector((state) => state.auth);
const useremail =user?.email
// console.log(useremail)


  const handleSubmit = async () => {
   if (!userEmail) {
  Alert.alert(
    'Login Required',
    'Please login first to submit a review.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Login', onPress: () => navigation.navigate('Login') },
    ]
  );
  return;
}

    if (!review || rating === 0) {
      Alert.alert('Error', 'Please write a review and select a rating.');
      return;
    }

    try {
      const payload = { email: userEmail, reviewText: review, rating };
      const response = await createreview(productSlug, reviewerId, payload);

      Alert.alert('Success', 'Review submitted successfully!');
      setReview('');
      setRating(0);
    } catch (err) {
      Alert.alert('Error', 'Failed to submit review.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Email</Text>
      <TextInput value={useremail} editable={false} style={styles.input} />

      <Text style={styles.label}>Review</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        value={review}
        onChangeText={setReview}
        placeholder="Write your review"
      />

      <Text style={styles.label}>Rating</Text>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num)}>
            <Ionicons
              name={num <= rating ? 'star' : 'star-outline'}
              size={30}
              color="#f5a623"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20, borderRadius: 8, elevation: 3 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ReviewForm;
