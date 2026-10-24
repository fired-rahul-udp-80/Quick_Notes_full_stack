import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null, // 'STUDENT' or 'ADMIN'
  isAuthenticated: false,
  isLoading: true, // App load hone par initial session check ke liye true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    
    // Login ya getMe() response aane par user save karo
    setCredentials: (state, action) => {
      const user = action.payload;
      state.user = user;
      state.role = user?.role || 'STUDENT';
      state.isAuthenticated = !!user;
      state.isLoading = false;
    },

    // Logout hone par state clear karo
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },

    // Loading status change karne ke liye
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
