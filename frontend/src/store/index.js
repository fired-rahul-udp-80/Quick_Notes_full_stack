import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import exploreReducer from './slices/exploreSlice';
import enrolledReducer from './slices/enrolledSlice';
import themeReducer from './slices/themeSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    explore: exploreReducer,
    enrolled: enrolledReducer,
    theme: themeReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
