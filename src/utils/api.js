import axios from 'axios';
import { API_URL } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is important for sending cookies with requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;