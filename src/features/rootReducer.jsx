import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import cartReducer from './cart/cartSlice';
// Import other reducers as needed

const createRootReducer = () => combineReducers({
  auth: authReducer,
  user: userReducer,
  cart: cartReducer,
  // Add other reducers here
});

export default createRootReducer;