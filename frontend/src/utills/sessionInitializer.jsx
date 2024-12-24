import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/store';
import axiosInstance from './axios';

function SessionManager({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token && user) {
      dispatch(login({ user, token, userId: user.userId }));
  
      axiosInstance
        .get('/auth/session')
        .then((response) => {
          const { user, accessToken } = response.data;
          if (user && accessToken) {
            dispatch(login({ user, token: accessToken, userId: user.userId }));
          } else {
            throw new Error('Invalid session response.');
          }
        })
        .catch(async (error) => {
          if (error.response?.status === 401) {
            try {
              const refreshResponse = await axiosInstance.get('/auth/refresh');
              const newAccessToken = refreshResponse.data.accessToken;
              localStorage.setItem('token', newAccessToken);
              dispatch(login({ user, token: newAccessToken, userId: user.userId }));
            } catch (refreshError) {
              dispatch(logout());
              localStorage.clear();
            }
          }
        });
    } else {
      console.warn('No token found. Skipping session restoration.');
    }
  }, [dispatch]);
  

  return children;
}

export default SessionManager;
