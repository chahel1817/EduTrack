import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error("Cannot connect to server. Make sure the backend server is running on http://localhost:5000");
      error.message = "Cannot connect to server. Please ensure the backend server is running.";
    }
    return Promise.reject(error);
  }
);
