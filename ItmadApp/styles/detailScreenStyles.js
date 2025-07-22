import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width: 350, height: 330, alignSelf: 'center', borderRadius: 8, justifyContent: "center" },
  noImageContainer: { width: '95%', height: 400, backgroundColor: '#f4f4f4', justifyContent: 'center', alignItems: 'center', borderRadius: 8, alignSelf: 'center' },
  noImageText: { fontSize: 18, color: '#888', fontWeight: '500' },
  detailContainer: { paddingHorizontal: 20, backgroundColor: '#fff' },
  priceContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    padding: 5, borderRadius: 8, marginTop: 10, justifyContent: 'space-between'
  },
  salePrice: { fontSize: 22, fontWeight: 'bold', color: '#FF9800', marginRight: 10 },
  originalPrice: {
    fontSize: 18,
    color: '#888',
    textDecorationLine: 'line-through'
  },
  shippingContainer: { flexDirection: 'row', alignItems: 'center' },
  shippingText: { color: '#666', fontSize: 16, marginLeft: 5 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  icon: { width: 20, marginRight: 5 },
  label: { color: '#555', width: 80, fontWeight: '600', marginLeft: 5 },
  value: { color: '#FFB727', flex: 1, fontWeight: '700', fontSize: 16, marginTop: 8 },
  variantContainer: { marginBottom: 15 },
  variantName: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  variantValues: { flexDirection: 'row', flexWrap: 'wrap' },
  variantItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginBottom: 10 },
  variantImage: { width: 30, height: 30, borderRadius: 15, marginRight: 5 },
  variantText: { color: '#555' },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, borderRadius: 8, backgroundColor: '#f9f9f9', width: '100%', alignSelf: 'center' },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
  activeTabButton: {
    backgroundColor: '#FF9800',
  },
  inactiveTabButton: {
    backgroundColor: 'black',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  discountBox: {
    backgroundColor: '#FF9800',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginLeft: 20,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftZone: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    zIndex: 2,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
  },
  rightZone: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
    zIndex: 2,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 30,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedVariantItem: {
    borderColor: 'green',
    backgroundColor: '#e0ffe0',
  },
  related: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  textrelated: { color: '#FFB727', fontSize: 18, fontWeight: 'bold' },
  fixedBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  reviewButtonBottom: {
    flex: 1,
    backgroundColor:  '#FF9800',
    marginRight: 5,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  reviewButtonTextBottom: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  chatButtonBottom: {
    flex: 1,
    backgroundColor: '#4CAF50',
    marginRight: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buyNowButtonBottom: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 5 },
  
  variantImage: {
  width: 40,
  height: 40,
  marginBottom: 4,
},

variantText: {
  fontSize: 12,
  textAlign: 'center',
}
});

export default styles;
