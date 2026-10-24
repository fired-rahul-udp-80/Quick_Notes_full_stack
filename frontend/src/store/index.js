import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import courseReducer from './slices/courseSlice';
import exploreReducer from './slices/exploreSlice';
import enrolledReducer from './slices/enrolledSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    explore: exploreReducer,
    enrolled: enrolledReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
