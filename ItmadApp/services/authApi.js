// services/authApi.js
import api from './api';

export const signup = async (username, email, password) => {
  // console.log('🚀 signup function called with:', username, email, password);
  const payload = { username, email, password };

  try {
    const response = await api.post('/user/signup', payload);
    console.log('✅ API Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Signup Error:', error);
    console.log('❌ Backend Response:', error.response?.data);
    throw error;
  }
};


// export const signup = async (username, email, password) => {
//   try {
//     // Basic client-side validation
//     if (!username || !email || !password) {
//       throw new Error('All fields are required');
//     }

//     if (password.length < 6) {
//       throw new Error('Password must be at least 6 characters');
//     }

//     const payload = { username, email, password };

//     const response = await api.post('/user/signup', payload, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     return response.data;

//   } catch (error) {
//     // Handle API errors or validation errors consistently
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       throw new Error(error.response.data.message || 'Signup failed');
//     } else if (error.request) {
//       // The request was made but no response was received
//       throw new Error('No response from server');
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       throw error; // rethrow validation errors
//     }
//   }
// };



// ✅ Login
export const login = async (email, password) => {
  const response = await api.post('/user/login', { email, password });
  return response.data;
};

// ✅ Logout
export const logout = async () => {
  const response = await api.get('/user/logout');
  return response.data;
};

// ✅ Get Current Logged-In User
export const getCurrentUser = async () => {
  const response = await api.get('/user/current');
  return response.data;
};
