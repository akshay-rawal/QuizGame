
import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', 
    timeout: 10000,              // Use a proxy URL for development if VITE_API_URL is not set
    
  });
  
  // Intercept requests to add the token dynamically
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Attaching token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Add the token to the Authorization header
      console.log("token attach request",config.headers.Authorization);
      
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default api;