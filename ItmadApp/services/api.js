import axios from 'axios';

const api = axios.create({
  baseURL: 'https://etimadmart.com/api/v1',
  timeout: 10000,
});
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

export const fetchbrandproduct = async (brand, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/search/filter/${brand}?page=${page}&limit=${limit}`);
    // console.log('brand=> ......', response.data);
    return response.data;  
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/order/create', orderData); 
    // console.log('BestSellers adeel========', response.data);
    return response;
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};
export const createreview = async (productSlug, reviewerId,payload) => {
  // console.log('📦 createreview called', { productSlug, reviewerId });

  try {
    const response = await api.post(
      `/review/create/${productSlug}/${reviewerId}`
      ,payload
    );
    // console.log('✅ Review submitted. Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchproductReview = async (slug) => {
  // console.log('📥 Fetching reviews for:', slug); 

  try {
    const response = await api.get(`/review/${slug}`);
    // console.log('✅ Reviews fetched:', response.data);

    return response.data;
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};



export const fetchRelatedProducts = async (categoryId, excludeProductId) => {
  try {
    const response = await api.get(`/product/related/${categoryId}/${excludeProductId}`);
    // console.log('fetchRelatedProducts====>',response.data )
    return response.data;
    
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};




export const fetchProductsByCategory = async (categoryName, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/search/filter/category`, {
      params: { categoryName, page, limit },
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


export const fetchTrendingProducts = async (page = 1, limit = 10) => {
  try {
    const res = await api.get('/product/featured', { params: { page, limit } });
    return res.data;
  } catch (error) {
    console.log('❌ API Error fetching trending products:', error.message);
    throw error;
  }
};


export const fetchNewArrivals = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/product/new-arrivals', {
      params: { page, limit },
    });
    // console.log('fetchNewArrivals adeel========', response.data);
    return response.data; 
  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
};



export const fetchBestSellers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/product/best-sellers?page=${page}&limit=${limit}`);
    // console.log('BestSellers adeel========', response.data);
    return response.data; 
  } catch (error) {
    console.log('❌ API Error:', error.response?.data || error.message);
    throw error;
  }
};












export default api;
