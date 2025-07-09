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

export const fetchRelatedProducts = async (categoryId, excludeProductId) => {
  try {
    const response = await api.get(`/product/related/${categoryId}/${excludeProductId}`);
    
    return response.data;
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchbanner = async () => {
  try {
    const response = await api.get(`/banner/all`);
    // console.log('banner=>',response.data);
   
    return response.data;
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchbrands = async () => {
  try {
    const response = await api.get(`/brand/get-all`);
    // console.log('brand=>',response.data);
    return response.data;
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchbrandproduct = async (brand) => {
  try {
    const response = await api.get(`/search/filter/${brand}`);
    // console.log('brand=>',response.data);
    return response.data;
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};
export const fetchProductsByCategory = async (categoryName) => {
  try {
    // console.log("API request categoryName adeel:", categoryName);
    const response = await api.get(`/search/filter/category`, {
      params: { categoryName },
    });
    // console.log('API FULL Response:', response.data);

    return response.data; 
  } catch (error) {
    console.log('❌ API Error (category):', error.response?.data || error.message);
    throw error;
  }
};

export const fetchProductsByslug = async (slug) => {
  try {
    const response = await api.get(`/product/${slug}`);

    if (response.data.product) {
      return response.data.product;
    }

    return response.data;
  } catch (error) {
    console.log('❌ API Error (slug):', error.response?.data || error.message);
    throw error;
  }
};


export const fetchAllTrendingProducts = async () => {
  try {
    // Pehle page fetch karen taake totalPages mil jaye
    const firstResponse = await api.get('/product/featured', { params: { page: 1 } });
    const data = firstResponse.data;

    if (!data.success) return [];

    let allProducts = data.products || [];
    const totalPages = data.totalPages || 1;

    // Agar sirf ek page hai to wapas de do
    if (totalPages <= 1) {
      return allProducts;
    }

    // Baaki pages bhi fetch karo
    const promises = [];

    for (let page = 2; page <= totalPages; page++) {
      promises.push(api.get('/product/featured', { params: { page } }));
    }

    const responses = await Promise.all(promises);

    // Har response se products nikal ke allProducts mein add karo
    responses.forEach(res => {
      if (res.data && res.data.products) {
        allProducts = allProducts.concat(res.data.products);
      }
    });

    return allProducts;
  } catch (error) {
    console.log('❌ API Error fetching all trending products:', error.message);
    throw error;
  }
};
export const fetchAllproductnewarrival = async () => {
  try {
    // Pehle page fetch karen taake totalPages mil jaye
    const firstResponse = await api.get('/product//new-arrivals', { params: { page: 1 } });
    const data = firstResponse.data;

    if (!data.success) return [];

    let allProducts = data.products || [];
    const totalPages = data.totalPages || 1;

    // Agar sirf ek page hai to wapas de do
    if (totalPages <= 1) {
      return allProducts;
    }

    // Baaki pages bhi fetch karo
    const promises = [];

    for (let page = 2; page <= totalPages; page++) {
      promises.push(api.get('/product/featured', { params: { page } }));
    }

    const responses = await Promise.all(promises);

    // Har response se products nikal ke allProducts mein add karo
    responses.forEach(res => {
      if (res.data && res.data.products) {
        allProducts = allProducts.concat(res.data.products);
      }
    });

    return allProducts;
  } catch (error) {
    console.log('❌ API Error fetching all trending products:', error.message);
    throw error;
  }
};

export const fetchAllproductcategorygetAll = async () => {
  try {
    const response = await api.get(`/category/getAll`);
    // console.log('✅ API Response--------======', response.data);

    if (response.data.categories) {
      return response.data.categories;
    }

    return [];
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};












export default api;
