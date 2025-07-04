import React from 'react';
import { View, Text } from 'react-native';
import RenderHTML from 'react-native-render-html';

const ProductDescription = ({ width, description, longDescription, styles }) => {
  return (
    <>
      {description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <RenderHTML
            contentWidth={width}
            source={{ html: description }}
            tagsStyles={{
              ul: { marginVertical: 10, paddingLeft: 25 },
              ol: { marginVertical: 10, paddingLeft: 25 },
              li: {
                marginBottom: 8,
                color: '#333',
                fontSize: 15,
                lineHeight: 22,
                fontFamily: 'System',
              },
              p: {
                color: '#444',
                fontSize: 15,
                lineHeight: 24,
                marginBottom: 5,
                fontFamily: 'System',
              },
              strong: {
                fontWeight: 'bold',
                // color: '#000',
                color:'red'
              },
              h3: {
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 10,
                marginBottom: 10,
                color: '#222',
              },
              h4: {
                fontSize: 17,
                fontWeight: '600',
                marginTop: 16,
                marginBottom: 8,
                color: '#333',
              },
            }}
          />
        </View>
      )}

      {longDescription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <RenderHTML
            contentWidth={width}
            source={{ html: longDescription }}
            tagsStyles={{
              h3: {
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 5,
                color: '#111',
               
              },
              h4: {
                fontSize: 17,
                fontWeight: '600',
                marginTop: 5,
                color: '#222',
                
              },
              ul: { marginVertical: 5, paddingLeft: 20 },
              li: { marginBottom: 5, color: '#444', fontSize: 16 },
              p: { color: '#444', fontSize: 16, lineHeight: 22 },
              strong: { fontWeight: 'bold',
                //  color: '#000',
                 color:'red'
                 },
            }}
          />
        </View>
      )}
    </>
  );
};

export default ProductDescription;
