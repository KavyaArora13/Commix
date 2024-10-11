import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
// Import other reducers as needed

const createRootReducer = () => combineReducers({
  auth: authReducer,
  user: userReducer,
  // Add other reducers here
});

export default createRootReducer;