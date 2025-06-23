
import api from "./api";
export const signup = (username, email, password) =>
  api.post('/user/signup', { username, email, password });

export const login = (email, password) =>
  api.post('/user/login', { email, password });

export const logout = () =>
  api.get('/user/logout');

export const getCurrentUser = () =>
  api.get('/user/current');
