// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://127.0.0.1:8000/api
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosClient;
