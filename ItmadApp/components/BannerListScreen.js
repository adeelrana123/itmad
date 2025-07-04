import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { fetchbanner } from '../services/api';

const { width, height } = Dimensions.get('window');

const BannerListScreen = () => {
  const [banners, setBanners] = useState([]);
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
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  // 🛡️ Prevent crash if banners is empty
  if (!banners.length) return null;

  const currentBanner = banners[currentIndex];

  return (
    <View style={styles.container}>
      <View style={{ width: width, height: height * 0.3, alignItems: 'center' }}>
        <Image
          source={{ uri: currentBanner.image }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
  },
});

export default BannerListScreen;
