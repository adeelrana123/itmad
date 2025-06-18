import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Free test API
  timeout: 10000,
});
// Example API Methods
export const getUsers = () => api.get('/users');         
export const getPosts = () => api.get('/posts');         
export const getComments = () => api.get('/comments');   
export const createUser = (data) => api.post('/users', data); 

export default api;
