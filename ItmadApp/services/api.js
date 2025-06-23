import axios from 'axios';

const api = axios.create({
  baseURL: 'https://etimadmart.com/api/v1',
  timeout: 10000,
});

// Fetch all products
export const fetchAllProducts = (page = 1, limit = 10) =>
  api.get(`/product/getAll?page=${page}&limit=${limit}`);

// Create order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/order/create', orderData); // ✅ correct
    return response;
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
