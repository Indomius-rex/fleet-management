import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Read JWT token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle error
    return Promise.reject(error);
  }
);

export default api;
