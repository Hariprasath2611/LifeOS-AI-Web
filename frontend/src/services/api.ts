import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT authorization token if it exists in local storage
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('lifeos_user');
  if (savedUser) {
    try {
      const { uid } = JSON.parse(savedUser);
      // Since it's a mock token for development verification, we transmit uid as the token
      config.headers.Authorization = `Bearer mock_token_${uid}`;
      config.headers['x-mock-user-id'] = uid;
    } catch (err) {
      console.error("Failed to parse user for auth header:", err);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
