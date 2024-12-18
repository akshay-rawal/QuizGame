
import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', 
    timeout: 10000,              // Use a proxy URL for development if VITE_API_URL is not set
    
  });
  
  // Intercept requests to add the token dynamically
  api.interceptors.response.use(
    (response) => response, // Pass through if the response is successful
    async (error) => {
      const originalRequest = error.config;
  
      // If the error status is 401, try to refresh the token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Avoid infinite retry loops
  
        try {
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            {},
            { withCredentials: true } // Send cookies with the refresh request
          );
  
          const newAccessToken = refreshResponse.data.accessToken;
  
          // Save the new token to localStorage
          localStorage.setItem('token', newAccessToken);
  
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  
          // Retry the original request with the new token
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          // Optionally log out the user and clear storage
          localStorage.clear();
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error); // Pass other errors through
    }
  );
  
  export default api;