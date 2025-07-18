// components/ProductImageCarousel.js

import React, { useRef } from 'react';
import { View, Text, Image, TouchableOpacity, PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductImageCarousel = ({
  imageArray,
  currentImageIndex,
  setCurrentImageIndex,
  styles,
   price,
  salePrice
}) => {

  const discount =
    price > salePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

  const handleNext = () => {
    setCurrentImageIndex(prev =>
      prev < imageArray.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex(prev =>
      prev > 0 ? prev - 1 : imageArray.length - 1
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          handlePrev();
        } else if (gestureState.dx < -50) {
          handleNext();
        }
      },
    })
  ).current;

  if (!imageArray.length) {
    return (
      <View style={styles.noImageContainer}>
        <Icon name="image" size={50} color="#ccc" />
        <Text style={styles.noImageText}>No Image Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.imageWrapper}>
      <TouchableOpacity style={styles.leftZone} onPress={handlePrev}>
        <Icon name="chevron-left" size={30} color="gray" />
      </TouchableOpacity>

      <View style={styles.imageWrapper} {...panResponder.panHandlers}>
        <Image
          source={{ uri: imageArray[currentImageIndex] }}
          style={styles.image}
          resizeMode="contain"
        />
        {discount > 0 && (
  <View style={[styles.discountBox, { position: 'absolute', top: 2, right: 10 }]}>
    <Text style={styles.discountText}>{discount}% Save</Text>
  </View>
)}
        <View style={styles.imageCounter}>
          <Text style={styles.counterText}>
            {currentImageIndex + 1} / {imageArray.length}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.rightZone} onPress={handleNext}>
        <Icon name="chevron-right" size={30} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default ProductImageCarousel;
