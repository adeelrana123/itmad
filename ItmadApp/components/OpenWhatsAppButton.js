import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/detailScreenStyles'; // Reuse same styles

const OpenWhatsAppButton = ({ product, selectedVariantValues,quantity = 1 }) => {
 
  const openWhatsApp = () => {
    const phoneNumber = '+923071111832';

    const productPrice = Number(product.salePrice || 0);
    const deliveryFee = product.freeShipping ? 0 : Number(product.deliveryCharges || 0);
     const total = (productPrice * quantity) + deliveryFee;

    const selectedVariantsText = Object.entries(selectedVariantValues)
      .map(([variantId, valueId]) => {
        const variant = product.variants.find(v => v._id === variantId);
        const valueObj = variant?.values.find(v => v._id === valueId);
        if (variant && valueObj) {
          return `*${variant.name}:* ${valueObj.value}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('\n');

    const message = `
*🛒 New Order Request*
*Title:* ${product.title}
View Product: https://etimadmart.com/product/${product.slug}

━━━━━━━━━━━━━━━
*Quantity:* ${quantity}
${selectedVariantsText ? `*Selected Variants:*\n${selectedVariantsText}\n━━━━━━━━━━━━━━━` : ''}
*Price:* Rs. ${productPrice}
🚚 *Delivery:* ${product.freeShipping ? '✅ Free Delivery' : `Rs. ${deliveryFee}`}
*Total Amount:* Rs. ${total}
━━━━━━━━━━━━━━━
Thank you!
`;

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Make sure WhatsApp is installed on your device.');
    });
  };

  return (
    <TouchableOpacity onPress={openWhatsApp} style={styles.chatButtonBottom}>
      <Icon name="whatsapp" size={16} color="#fff" />
      <Text style={styles.buttonText}>WhatsApp</Text>
    </TouchableOpacity>
  );
};

export default OpenWhatsAppButton;
