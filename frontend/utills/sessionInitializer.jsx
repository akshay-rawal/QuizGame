import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login,logout } from '../src/store/store';
import api from './axios';

function SessionManager({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token && user) {
      dispatch(login({ user, token, userId: user.userId }));
  
      api.get('/session')
        .then((response) => {
          console.log('Session is valid:', response.data);
        })
        .catch(async (error) => {
          console.error('Session validation failed:', error);
  
          if (error.response?.status === 401) {
            try {
              const refreshResponse = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/refresh`,
                {},
                { withCredentials: true }
              );
  
              const newAccessToken = refreshResponse.data.accessToken;
              localStorage.setItem('token', newAccessToken);
  
              // Retry session validation with the new token
              const retryResponse = await api.get('/session');
              console.log('Session is now valid after token refresh:', retryResponse.data);
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              dispatch(logout());
              localStorage.clear();
            }
          } else {
            dispatch(logout());
            localStorage.clear();
          }
        });
    } else {
      console.warn('No token found. Skipping session restoration.');
    }
  }, [dispatch]);
  

  return children;
}

export default SessionManager;
