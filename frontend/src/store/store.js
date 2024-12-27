import { configureStore, createSlice } from '@reduxjs/toolkit';

// Helper to safely parse JSON
const parseJSON = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Fetch initial values from localStorage safely
const initialUser = parseJSON(localStorage.getItem('user'), null);
const initialToken = localStorage.getItem('token') || null;

console.log('Parsed initial user:', initialUser);
console.log('Parsed initial token:', initialToken);

// Initial state for the user slice
const initialState = {
  user: initialUser,
  token: initialToken,
  userId: initialUser?.userId || null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;

      // Ensure the payload contains `userId`
      const userId = user?.userId;

      if (!userId) {
        console.error('Missing userId in login payload:', action.payload);
        return;
      }

      state.user = user;
      state.token = token;
      state.userId = user.userId || null;

      // Persist session data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem("userId",user.userId)
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
    },
    refreshToken:(state,action)=>{
         state.token = action.payload.token;
    }
  },
});

// Export actions
export const { login, logout } = userSlice.actions;

// Configure and export the store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
}); 

export default store;
