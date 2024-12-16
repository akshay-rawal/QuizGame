import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login,logout } from '../src/store/store';
import api from './axios';

function SessionManager({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("localstorage token",localStorage.getItem('token'));
    
    const user = JSON.parse(localStorage.getItem('user'));

    // If token exists in localStorage, try to restore the session
    if (token && user) {
      // Dispatch to restore session in Redux
      dispatch(login({ user, token, userId: user.userId }));
      console.log('Session restored with user and token:', { user, token });

      // Now verify session with API
      api.get('/session')
        .then((response) => {
          console.log('Session is valid:', response.data);
        })
        .catch((error) => {
          console.error('Session validation failed:', error);
          // If session is invalid, log the user out
          dispatch(logout());
          localStorage.clear();  // Optionally clear localStorage
        });
    } else {
      console.warn('No token found. Skipping session restoration.');
    }
  }, [dispatch]);

  return children;
}

export default SessionManager;
