import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { fetchbanner } from '../services/api';

const { width } = Dimensions.get('window');

const BannerListScreen = () => {
  const [banners, setBanners] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchbanner();
        setBanners(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (banners.length > 0) {
        const nextIndex = (currentIndex + 1) % banners.length;
        scrollRef.current.scrollTo({ x: nextIndex * width, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const handleDotPress = index => {
    scrollRef.current.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {banners.map((banner, index) => (
          <Image
            key={index}
            source={{ uri: banner.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {banners.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [1, 1.4, 1],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity key={i} onPress={() => handleDotPress(i)}>
              <Animated.View style={[styles.dot, { opacity, transform: [{ scale }] }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 130,
  },
  image: {
    width: width,
    height: 110,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom:6
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B00',
    marginHorizontal: 6,
  },
});

export default BannerListScreen;
