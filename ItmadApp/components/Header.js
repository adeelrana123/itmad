import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../theme/ThemeContext';
import { useSelector } from 'react-redux';

const Header = ({ title, showCart = false }) => {
  const navigation = useNavigation();
  const colors = useAppTheme();

  // 🛒 Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items || []);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.buttonBackground },
      ]}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={colors.white || '#fff'} />
      </TouchableOpacity>

      {/* 🔠 Title */}
      <View style={styles.titleWrapper}>
        <Text style={[styles.headerText, { color: colors.white || '#fff' }]}>
          {title}
        </Text>
      </View>

      {/* 🛒 Cart Button with Badge */}
      {showCart ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Cart' })}
        >
          <View>
            <Icon name="cart-outline" size={30} color={colors.white || '#fff'} />
            {totalQuantity > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalQuantity}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.backButton} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'black',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
